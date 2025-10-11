import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/types/fitness';
import { toast } from '@/hooks/use-toast';

export const useActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedActivities: Activity[] =
        data?.map((activity) => ({
          id: activity.id,
          goalId: activity.goal_id,
          type: activity.type,
          value: parseFloat(activity.value),
          date: activity.date,
          notes: activity.notes,
        })) || [];

      setActivities(mappedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load activities.',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const getRecentActivities = (limit: number = 10) => {
    return activities.slice(0, limit);
  };

  const getActivitiesByDateRange = (startDate: string, endDate: string) => {
    return activities.filter(
      (activity) => activity.date >= startDate && activity.date <= endDate
    );
  };

  const getActivitiesByType = (type: Activity['type']) => {
    return activities.filter((activity) => activity.type === type);
  };

  const getTodayActivities = () => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter((activity) => activity.date === today);
  };

  const getWeekActivities = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    return getActivitiesByDateRange(weekAgoStr, todayStr);
  };

  const getMonthActivities = () => {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    return getActivitiesByDateRange(monthAgoStr, todayStr);
  };

  const getActivityStats = () => {
    const today = getTodayActivities();
    const week = getWeekActivities();
    const month = getMonthActivities();

    return {
      today: today.length,
      week: week.length,
      month: month.length,
      total: activities.length,
      byType: {
        workout: getActivitiesByType('workout').length,
        distance: getActivitiesByType('distance').length,
        steps: getActivitiesByType('steps').length,
        weight: getActivitiesByType('weight').length,
      },
    };
  };

  return {
    activities,
    loading,
    getRecentActivities,
    getActivitiesByDateRange,
    getActivitiesByType,
    getTodayActivities,
    getWeekActivities,
    getMonthActivities,
    getActivityStats,
    refetch: fetchActivities,
  };
};
