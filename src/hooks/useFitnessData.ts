import { useLocalStorage } from './useLocalStorage';
import { FitnessGoal, Activity, DashboardStats } from '@/types/fitness';

export function useFitnessData() {
  const [goals, setGoals] = useLocalStorage<FitnessGoal[]>('habitbar-goals', []);
  const [activities, setActivities] = useLocalStorage<Activity[]>('habitbar-activities', []);

  const addGoal = (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    const newGoal: FitnessGoal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<FitnessGoal>) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    setActivities(activities.filter(a => a.goalId !== id));
  };

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
    };
    setActivities([...activities, newActivity]);
    
    // Update goal progress
    const goal = goals.find(g => g.id === activity.goalId);
    if (goal) {
      updateGoal(goal.id, { current: goal.current + activity.value });
    }
    
    return newActivity;
  };

  const getStats = (): DashboardStats => {
    const completed = goals.filter(g => g.current >= g.target).length;
    const inProgress = goals.length - completed;
    
    // Calculate streak
    const sortedActivities = [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const activity of sortedActivities) {
      const activityDate = new Date(activity.date);
      activityDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }

    return {
      totalGoals: goals.length,
      completed,
      inProgress,
      currentStreak: streak,
    };
  };

  return {
    goals,
    activities,
    addGoal,
    updateGoal,
    deleteGoal,
    addActivity,
    getStats,
  };
}
