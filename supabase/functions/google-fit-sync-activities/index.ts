import { createClient } from 'npm:@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { integration_id } = await req.json();

    if (!integration_id) {
      return new Response(
        JSON.stringify({ error: 'integration_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('user_id', user.id)
      .eq('provider', 'google_fit')
      .maybeSingle();

    if (integrationError || !integration) {
      return new Response(
        JSON.stringify({ error: 'Integration not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let accessToken = integration.access_token;
    const expiresAt = new Date(integration.expires_at);
    const now = new Date();

    if (now >= expiresAt) {
      const clientId = Deno.env.get('GOOGLE_FIT_CLIENT_ID');
      const clientSecret = Deno.env.get('GOOGLE_FIT_CLIENT_SECRET');

      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          refresh_token: integration.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.text();
        console.error('Token refresh failed:', errorData);
        return new Response(
          JSON.stringify({ error: 'Failed to refresh token', details: errorData }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      await supabase
        .from('integrations')
        .update({
          access_token: refreshData.access_token,
          refresh_token: refreshData.refresh_token || integration.refresh_token,
          expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
        })
        .eq('id', integration_id);
    }

    const startedAt = new Date().toISOString();

    const endTimeMillis = Date.now();
    const startTimeMillis = endTimeMillis - (7 * 24 * 60 * 60 * 1000);

    const aggregateResponse = await fetch(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
            },
            {
              dataTypeName: 'com.google.distance.delta',
            },
            {
              dataTypeName: 'com.google.activity.segment',
            },
            {
              dataTypeName: 'com.google.weight',
            },
          ],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis,
        }),
      }
    );

    if (!aggregateResponse.ok) {
      const errorData = await aggregateResponse.text();
      console.error('Failed to fetch fitness data:', errorData);

      await supabase.from('sync_history').insert({
        integration_id: integration_id,
        user_id: user.id,
        sync_type: 'manual',
        status: 'failed',
        activities_synced: 0,
        error_message: `Failed to fetch fitness data: ${errorData}`,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({ error: 'Failed to fetch fitness data from Google Fit', details: errorData }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const fitnessData = await aggregateResponse.json();

    const { data: existingGoals } = await supabase
      .from('goals')
      .select('id, type')
      .eq('user_id', user.id);

    let syncedCount = 0;
    const importedActivities = [];

    for (const bucket of fitnessData.bucket || []) {
      const dateStr = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];

      for (const dataset of bucket.dataset || []) {
        for (const point of dataset.point || []) {
          const dataTypeName = point.dataTypeName;

          if (dataTypeName === 'com.google.step_count.delta') {
            const steps = point.value?.[0]?.intVal || 0;
            if (steps > 0) {
              const matchingGoal = existingGoals?.find(g => g.type === 'daily-steps');

              if (matchingGoal) {
                const { data: existingActivity } = await supabase
                  .from('activities')
                  .select('id')
                  .eq('goal_id', matchingGoal.id)
                  .eq('date', dateStr)
                  .eq('type', 'steps')
                  .maybeSingle();

                if (!existingActivity) {
                  const { error: insertError } = await supabase.from('activities').insert({
                    goal_id: matchingGoal.id,
                    user_id: user.id,
                    type: 'steps',
                    value: steps.toString(),
                    date: dateStr,
                    notes: 'Synced from Google Fit',
                  });

                  if (!insertError) {
                    syncedCount++;
                    importedActivities.push({
                      type: 'steps',
                      value: steps,
                      date: dateStr,
                    });
                  }
                }
              }
            }
          } else if (dataTypeName === 'com.google.distance.delta') {
            const distanceMeters = point.value?.[0]?.fpVal || 0;
            const distanceKm = distanceMeters / 1000;
            if (distanceKm > 0) {
              const matchingGoal = existingGoals?.find(g => g.type === 'run-distance');

              if (matchingGoal) {
                const { data: existingActivity } = await supabase
                  .from('activities')
                  .select('id')
                  .eq('goal_id', matchingGoal.id)
                  .eq('date', dateStr)
                  .eq('type', 'distance')
                  .maybeSingle();

                if (!existingActivity) {
                  const { error: insertError } = await supabase.from('activities').insert({
                    goal_id: matchingGoal.id,
                    user_id: user.id,
                    type: 'distance',
                    value: distanceKm.toFixed(2),
                    date: dateStr,
                    notes: 'Synced from Google Fit',
                  });

                  if (!insertError) {
                    syncedCount++;
                    importedActivities.push({
                      type: 'distance',
                      value: distanceKm,
                      date: dateStr,
                    });
                  }
                }
              }
            }
          } else if (dataTypeName === 'com.google.weight') {
            const weightKg = point.value?.[0]?.fpVal || 0;
            if (weightKg > 0) {
              const matchingGoal = existingGoals?.find(g => g.type === 'weight-loss');

              if (matchingGoal) {
                const { data: existingActivity } = await supabase
                  .from('activities')
                  .select('id')
                  .eq('goal_id', matchingGoal.id)
                  .eq('date', dateStr)
                  .eq('type', 'weight')
                  .maybeSingle();

                if (!existingActivity) {
                  const { error: insertError } = await supabase.from('activities').insert({
                    goal_id: matchingGoal.id,
                    user_id: user.id,
                    type: 'weight',
                    value: weightKg.toFixed(1),
                    date: dateStr,
                    notes: 'Synced from Google Fit',
                  });

                  if (!insertError) {
                    syncedCount++;
                    importedActivities.push({
                      type: 'weight',
                      value: weightKg,
                      date: dateStr,
                    });
                  }
                }
              }
            }
          } else if (dataTypeName === 'com.google.activity.segment') {
            const activityType = point.value?.[0]?.intVal || 0;
            if (activityType === 7 || activityType === 8 || activityType === 1) {
              const matchingGoal = existingGoals?.find(g => g.type === 'gym-frequency');

              if (matchingGoal) {
                const { data: existingActivity } = await supabase
                  .from('activities')
                  .select('id')
                  .eq('goal_id', matchingGoal.id)
                  .eq('date', dateStr)
                  .eq('type', 'workout')
                  .maybeSingle();

                if (!existingActivity) {
                  const { error: insertError } = await supabase.from('activities').insert({
                    goal_id: matchingGoal.id,
                    user_id: user.id,
                    type: 'workout',
                    value: '1',
                    date: dateStr,
                    notes: 'Synced from Google Fit',
                  });

                  if (!insertError) {
                    syncedCount++;
                    importedActivities.push({
                      type: 'workout',
                      value: 1,
                      date: dateStr,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    await supabase
      .from('integrations')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', integration_id);

    await supabase.from('sync_history').insert({
      integration_id: integration_id,
      user_id: user.id,
      sync_type: 'manual',
      status: 'success',
      activities_synced: syncedCount,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        activities_synced: syncedCount,
        imported_activities: importedActivities,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});