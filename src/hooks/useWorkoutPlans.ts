import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { MicroPlan, WorkoutSession, AdherenceStats, PainTracking } from '@/types/workout';

export function useWorkoutPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MicroPlan[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState<AdherenceStats | null>(null);
  const [recentPain, setRecentPain] = useState<PainTracking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      loadPlans(),
      loadSessions(),
      loadStats(),
      loadRecentPain(),
    ]);
    setLoading(false);
  };

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('micro_plans')
      .select('*')
      .order('duration', { ascending: true });

    if (!error && data) {
      setPlans(data as MicroPlan[]);
    }
  };

  const loadSessions = async () => {
    if (!user) {
      console.log('loadSessions: No user found');
      return;
    }

    console.log('loadSessions: Loading sessions for user', user.id);
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*, micro_plans(*)')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('loadSessions error:', error);
    } else {
      console.log('loadSessions: Loaded', data?.length, 'sessions', data);
      setSessions(data as WorkoutSession[]);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('adherence_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error) {
      setStats(data as AdherenceStats | null);
    }
  };

  const loadRecentPain = async () => {
    if (!user) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('pain_tracking')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (!error && data) {
      setRecentPain(data as PainTracking[]);
    }
  };

  const completeSession = async (
    planId: string,
    durationMinutes: number,
    rpe?: number,
    pain?: number,
    notes?: string
  ) => {
    if (!user) return;

    const { error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        duration_minutes: durationMinutes,
        rpe,
        pain,
        notes,
        completed_at: new Date().toISOString(),
      });

    if (!error) {
      await updateAdherenceStats(durationMinutes);
      await loadData();
    }

    return !error;
  };

  const updateAdherenceStats = async (minutesCompleted: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const currentStats = stats || {
      id: crypto.randomUUID(),
      user_id: user.id,
      complete_streak: 0,
      miss_streak: 0,
      last_activity_date: null,
      total_aqm: 0,
    };

    const lastDate = currentStats.last_activity_date ? new Date(currentStats.last_activity_date) : null;
    const todayDate = new Date(today);

    let newCompleteStreak = currentStats.complete_streak;
    let newMissStreak = 0;

    if (lastDate) {
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        newCompleteStreak += 1;
      } else if (daysDiff === 0) {
        newCompleteStreak = currentStats.complete_streak;
      } else {
        newCompleteStreak = 1;
      }
    } else {
      newCompleteStreak = 1;
    }

    await supabase
      .from('adherence_stats')
      .upsert({
        user_id: user.id,
        complete_streak: newCompleteStreak,
        miss_streak: newMissStreak,
        last_activity_date: today,
        total_aqm: currentStats.total_aqm + minutesCompleted,
        updated_at: new Date().toISOString(),
      });
  };

  const trackPain = async (area: string, level: number, date?: string) => {
    if (!user) return;

    const painDate = date || new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('pain_tracking')
      .upsert({
        user_id: user.id,
        area,
        level,
        date: painDate,
      });

    if (!error) {
      await loadRecentPain();
    }

    return !error;
  };

  const getWeeklyAQM = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = sessions.filter(
      s => new Date(s.completed_at) >= sevenDaysAgo
    );

    return recentSessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  };

  return {
    plans,
    sessions,
    stats,
    recentPain,
    loading,
    completeSession,
    trackPain,
    getWeeklyAQM,
    refresh: loadData,
  };
}
