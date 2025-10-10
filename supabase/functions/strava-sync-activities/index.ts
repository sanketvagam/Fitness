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
      .eq('provider', 'strava')
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
      const clientId = Deno.env.get('STRAVA_CLIENT_ID');
      const clientSecret = Deno.env.get('STRAVA_CLIENT_SECRET');

      const refreshResponse = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
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
          refresh_token: refreshData.refresh_token,
          expires_at: new Date(refreshData.expires_at * 1000).toISOString(),
        })
        .eq('id', integration_id);
    }

    const startedAt = new Date().toISOString();

    const perPage = 50;
    const activitiesResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!activitiesResponse.ok) {
      const errorData = await activitiesResponse.text();
      console.error('Failed to fetch activities:', errorData);

      await supabase.from('sync_history').insert({
        integration_id: integration_id,
        user_id: user.id,
        sync_type: 'manual',
        status: 'failed',
        activities_synced: 0,
        error_message: `Failed to fetch activities: ${errorData}`,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({ error: 'Failed to fetch activities from Strava', details: errorData }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const stravaActivities = await activitiesResponse.json();

    const { data: existingGoals } = await supabase
      .from('goals')
      .select('id, type')
      .eq('user_id', user.id);

    let syncedCount = 0;
    const importedActivities = [];

    for (const stravaActivity of stravaActivities) {
      const activityDate = new Date(stravaActivity.start_date).toISOString().split('T')[0];

      let activityType: 'workout' | 'distance' | 'steps' | 'weight' = 'workout';
      let activityValue = 1;
      let matchingGoal = null;

      if (stravaActivity.type === 'Run' || stravaActivity.type === 'Ride') {
        activityType = 'distance';
        activityValue = stravaActivity.distance / 1000;
        matchingGoal = existingGoals?.find(g => g.type === 'run-distance');
      } else if (stravaActivity.type === 'Walk') {
        activityType = 'steps';
        activityValue = Math.round(stravaActivity.distance * 1.3);
        matchingGoal = existingGoals?.find(g => g.type === 'daily-steps');
      } else {
        activityType = 'workout';
        activityValue = 1;
        matchingGoal = existingGoals?.find(g => g.type === 'gym-frequency');
      }

      if (matchingGoal) {
        const { data: existingActivity } = await supabase
          .from('activities')
          .select('id')
          .eq('goal_id', matchingGoal.id)
          .eq('date', activityDate)
          .eq('type', activityType)
          .maybeSingle();

        if (!existingActivity) {
          const { error: insertError } = await supabase.from('activities').insert({
            goal_id: matchingGoal.id,
            user_id: user.id,
            type: activityType,
            value: activityValue.toString(),
            date: activityDate,
            notes: `Synced from Strava: ${stravaActivity.name}`,
          });

          if (!insertError) {
            syncedCount++;
            importedActivities.push({
              name: stravaActivity.name,
              type: stravaActivity.type,
              distance: stravaActivity.distance,
              date: activityDate,
            });
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
        total_activities: stravaActivities.length,
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