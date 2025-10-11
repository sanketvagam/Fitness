import { useLocalStorage } from './useLocalStorage';
import { Meal, DailyNutrition } from '@/types/fitness';
import { startOfDay, format } from 'date-fns';

export function useMealData() {
  const [meals, setMeals] = useLocalStorage<Meal[]>('habitbar-meals', []);

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: crypto.randomUUID(),
    };
    setMeals([...meals, newMeal]);
    return newMeal;
  };

  const deleteMeal = (id: string) => {
    setMeals((currentMeals) => currentMeals.filter(m => m.id !== id));
  };

  const getMealsByDate = (date: Date): Meal[] => {
    const targetDate = format(startOfDay(date), 'yyyy-MM-dd');
    return meals.filter(m => m.date === targetDate);
  };

  const getDailyNutrition = (date: Date): DailyNutrition => {
    const dayMeals = getMealsByDate(date);
    
    return {
      date: format(startOfDay(date), 'yyyy-MM-dd'),
      totalCalories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
      totalProtein: dayMeals.reduce((sum, m) => sum + m.protein, 0),
      totalCarbs: dayMeals.reduce((sum, m) => sum + m.carbs, 0),
      totalFats: dayMeals.reduce((sum, m) => sum + m.fats, 0),
      meals: dayMeals,
    };
  };

  const getWeeklyNutrition = (): DailyNutrition[] => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(getDailyNutrition(date));
    }
    
    return days;
  };

  return {
    meals,
    addMeal,
    deleteMeal,
    getMealsByDate,
    getDailyNutrition,
    getWeeklyNutrition,
  };
}
