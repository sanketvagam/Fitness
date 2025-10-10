import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { FitnessGoal, Activity, DashboardStats } from '@/types/fitness';
import { toast } from '@/hooks/use-toast';

export const useSupabaseFitnessData = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fitness_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedGoals: FitnessGoal[] =
        data?.map((goal) => ({
          id: goal.id,
          type: goal.type,
          title: goal.title,
          target: parseFloat(goal.target),
          current: parseFloat(goal.current),
          unit: goal.unit,
          deadline: goal.deadline,
          createdAt: goal.created_at,
          category: goal.category,
        })) || [];

      setGoals(mappedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load goals.',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('fitness_goals')
        .insert({
          user_id: user.id,
          type: goal.type,
          title: goal.title,
          target: goal.target,
          current: goal.current,
          unit: goal.unit,
          deadline: goal.deadline,
          category: goal.category,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newGoal: FitnessGoal = {
          id: data.id,
          type: data.type,
          title: data.title,
          target: parseFloat(data.target),
          current: parseFloat(data.current),
          unit: data.unit,
          deadline: data.deadline,
          createdAt: data.created_at,
          category: data.category,
        };

        setGoals((prev) => [newGoal, ...prev]);
        toast({
          title: 'Goal created',
          description: 'Your fitness goal has been added.',
        });
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create goal.',
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('fitness_goals').delete().eq('id', goalId);

      if (error) throw error;

      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      toast({
        title: 'Goal deleted',
        description: 'Your goal has been removed.',
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete goal.',
      });
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'date'>) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('activities').insert({
        user_id: user.id,
        goal_id: activity.goalId,
        type: activity.type,
        value: activity.value,
        notes: activity.notes,
        date: new Date().toISOString().split('T')[0],
      });

      if (error) throw error;

      const { data: goalData, error: goalError } = await supabase
        .from('fitness_goals')
        .select('current')
        .eq('id', activity.goalId)
        .single();

      if (goalError) throw goalError;

      const newCurrent = parseFloat(goalData.current) + activity.value;

      const { error: updateError } = await supabase
        .from('fitness_goals')
        .update({ current: newCurrent, updated_at: new Date().toISOString() })
        .eq('id', activity.goalId);

      if (updateError) throw updateError;

      await fetchGoals();

      toast({
        title: 'Activity logged',
        description: 'Your progress has been updated.',
      });
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log activity.',
      });
    }
  };

  const getStats = (): DashboardStats => {
    const totalGoals = goals.length;
    const completed = goals.filter((g) => g.current >= g.target).length;
    const inProgress = totalGoals - completed;

    return {
      totalGoals,
      completed,
      inProgress,
      currentStreak: 0,
    };
  };

  return {
    goals,
    loading,
    addGoal,
    deleteGoal,
    addActivity,
    getStats,
    refetch: fetchGoals,
  };
};
