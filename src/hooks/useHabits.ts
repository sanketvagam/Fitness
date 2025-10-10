import { useLocalStorage } from './useLocalStorage';
import { Habit } from '@/types/habit';
import { format, startOfDay, differenceInDays } from 'date-fns';

const DEFAULT_HABITS: Omit<Habit, 'id' | 'streak' | 'completedDates'>[] = [
  { name: 'Drink 8 glasses of water', icon: 'droplet', category: 'health', targetPerWeek: 7 },
  { name: 'Sleep 8 hours', icon: 'moon', category: 'health', targetPerWeek: 7 },
  { name: 'Stretch for 10 minutes', icon: 'move', category: 'fitness', targetPerWeek: 5 },
  { name: 'Meditate', icon: 'brain', category: 'mindfulness', targetPerWeek: 5 },
];

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('fitforge-habits', 
    DEFAULT_HABITS.map(h => ({
      ...h,
      id: crypto.randomUUID(),
      streak: 0,
      completedDates: [],
    }))
  );

  const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      streak: 0,
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabitCompletion = (habitId: string, date: Date = new Date()) => {
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompleted = habit.completedDates.includes(dateStr);
      let newCompletedDates: string[];
      
      if (isCompleted) {
        newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
      } else {
        newCompletedDates = [...habit.completedDates, dateStr].sort();
      }

      const streak = calculateStreak(newCompletedDates);

      return {
        ...habit,
        completedDates: newCompletedDates,
        streak,
      };
    }));
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    const today = startOfDay(new Date());
    
    let streak = 0;
    let currentDate = today;

    for (const date of sortedDates) {
      const diff = differenceInDays(currentDate, startOfDay(date));
      
      if (diff === 0 || diff === 1) {
        streak++;
        currentDate = startOfDay(date);
      } else {
        break;
      }
    }

    return streak;
  };

  const isHabitCompletedToday = (habitId: string): boolean => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    return habit.completedDates.includes(today);
  };

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedToday,
  };
}
