import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Integration {
  id: string;
  userId: string;
  provider: string;
  providerUserId?: string;
  status: 'active' | 'expired' | 'disconnected';
  lastSync?: string;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SyncHistory {
  id: string;
  integrationId: string;
  userId: string;
  syncType: 'manual' | 'automatic' | 'scheduled';
  status: 'success' | 'failed' | 'partial';
  activitiesSynced: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export const useIntegrations = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchIntegrations = useCallback(async () => {
    if (!user) {
      setIntegrations([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedIntegrations: Integration[] =
        data?.map((integration) => ({
          id: integration.id,
          userId: integration.user_id,
          provider: integration.provider,
          providerUserId: integration.provider_user_id,
          status: integration.status,
          lastSync: integration.last_sync,
          settings: integration.settings || {},
          createdAt: integration.created_at,
          updatedAt: integration.updated_at,
        })) || [];

      setIntegrations(mappedIntegrations);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSyncHistory = useCallback(async (limit: number = 10) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sync_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const mappedHistory: SyncHistory[] =
        data?.map((history) => ({
          id: history.id,
          integrationId: history.integration_id,
          userId: history.user_id,
          syncType: history.sync_type,
          status: history.status,
          activitiesSynced: history.activities_synced,
          errorMessage: history.error_message,
          startedAt: history.started_at,
          completedAt: history.completed_at,
          createdAt: history.created_at,
        })) || [];

      setSyncHistory(mappedHistory);
    } catch (error) {
      console.error('Error fetching sync history:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchIntegrations();
    fetchSyncHistory();
  }, [fetchIntegrations, fetchSyncHistory]);

  const connectIntegration = async (provider: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      if (provider === 'strava') {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const stravaClientId = import.meta.env.VITE_STRAVA_CLIENT_ID;

        if (!stravaClientId) {
          toast.error('Strava integration not configured');
          return { success: false, error: 'Strava client ID not configured' };
        }

        const redirectUri = `${supabaseUrl}/functions/v1/strava-oauth-callback`;
        const scope = 'read,activity:read_all,activity:read';

        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${user.id}`;

        window.location.href = authUrl;

        return { success: true, data: { redirecting: true } };
      } else if (provider === 'google_fit') {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const googleFitClientId = import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID;

        if (!googleFitClientId) {
          toast.error('Google Fit integration not configured');
          return { success: false, error: 'Google Fit client ID not configured' };
        }

        const redirectUri = `${supabaseUrl}/functions/v1/google-fit-oauth-callback`;
        const scope = 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.location.read';

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleFitClientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${user.id}&access_type=offline&prompt=consent`;

        window.location.href = authUrl;

        return { success: true, data: { redirecting: true } };
      } else {
        const { data, error } = await supabase
          .from('integrations')
          .insert({
            user_id: user.id,
            provider,
            provider_user_id: `${provider}_${Date.now()}`,
            access_token: 'mock_token',
            status: 'active',
            settings: {},
          })
          .select()
          .single();

        if (error) throw error;

        await fetchIntegrations();
        toast.success(`${provider} connected successfully!`);
        return { success: true, data };
      }
    } catch (error: any) {
      console.error('Error connecting integration:', error);
      toast.error(error.message || 'Failed to connect integration');
      return { success: false, error: error.message };
    }
  };

  const disconnectIntegration = async (integrationId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('integrations')
        .update({ status: 'disconnected' })
        .eq('id', integrationId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchIntegrations();
      toast.success('Integration disconnected');
      return { success: true };
    } catch (error: any) {
      console.error('Error disconnecting integration:', error);
      toast.error('Failed to disconnect integration');
      return { success: false, error: error.message };
    }
  };

  const syncIntegration = async (integrationId: string, provider: string) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    setSyncing(true);

    try {
      if (provider === 'strava' || provider === 'google_fit') {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('Not authenticated');
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const functionName = provider === 'strava' ? 'strava-sync-activities' : 'google-fit-sync-activities';
        const providerName = provider === 'strava' ? 'Strava' : 'Google Fit';

        const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': supabaseAnonKey,
          },
          body: JSON.stringify({
            integration_id: integrationId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to sync activities');
        }

        const result = await response.json();

        await fetchIntegrations();
        await fetchSyncHistory();

        toast.success(`Synced ${result.activities_synced} activities from ${providerName}!`);
        return { success: true, activities: result.imported_activities };
      } else {
        const startedAt = new Date().toISOString();
        const mockActivities = generateMockActivities(provider);

        await new Promise(resolve => setTimeout(resolve, 2000));

        const { error: historyError } = await supabase
          .from('sync_history')
          .insert({
            integration_id: integrationId,
            user_id: user.id,
            sync_type: 'manual',
            status: 'success',
            activities_synced: mockActivities.length,
            started_at: startedAt,
            completed_at: new Date().toISOString(),
          });

        if (historyError) throw historyError;

        const { error: updateError } = await supabase
          .from('integrations')
          .update({ last_sync: new Date().toISOString() })
          .eq('id', integrationId);

        if (updateError) throw updateError;

        await fetchIntegrations();
        await fetchSyncHistory();

        toast.success(`Synced ${mockActivities.length} activities from ${provider}!`);
        return { success: true, activities: mockActivities };
      }
    } catch (error: any) {
      console.error('Error syncing integration:', error);
      toast.error(error.message || 'Failed to sync data');
      return { success: false, error: error.message };
    } finally {
      setSyncing(false);
    }
  };

  const isConnected = (provider: string) => {
    return integrations.some(
      (integration) => integration.provider === provider && integration.status === 'active'
    );
  };

  const getIntegration = (provider: string) => {
    return integrations.find(
      (integration) => integration.provider === provider && integration.status === 'active'
    );
  };

  return {
    integrations,
    syncHistory,
    loading,
    syncing,
    connectIntegration,
    disconnectIntegration,
    syncIntegration,
    isConnected,
    getIntegration,
    refetch: () => {
      fetchIntegrations();
      fetchSyncHistory();
    },
  };
};

function generateMockActivities(provider: string) {
  const activities = [];
  const count = Math.floor(Math.random() * 5) + 3;

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    const types = ['workout', 'distance', 'steps'];
    const type = types[Math.floor(Math.random() * types.length)];

    let value;
    if (type === 'workout') value = 1;
    else if (type === 'distance') value = Math.floor(Math.random() * 10) + 2;
    else value = Math.floor(Math.random() * 5000) + 5000;

    activities.push({
      type,
      value,
      date: date.toISOString().split('T')[0],
      source: provider,
    });
  }

  return activities;
}
