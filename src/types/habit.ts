export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: 'health' | 'fitness' | 'nutrition' | 'mindfulness';
  streak: number;
  completedDates: string[];
  targetPerWeek?: number;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
}
