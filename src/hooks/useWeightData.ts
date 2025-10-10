import { useLocalStorage } from './useLocalStorage';
import { WeightEntry } from '@/types/fitness';
import { format, startOfDay } from 'date-fns';

export function useWeightData() {
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('fitforge-weights', []);

  const addWeight = (weight: number, date: Date = new Date()) => {
    const newEntry: WeightEntry = {
      id: crypto.randomUUID(),
      weight,
      date: format(startOfDay(date), 'yyyy-MM-dd'),
    };
    setWeights([...weights, newEntry]);
    return newEntry;
  };

  const deleteWeight = (id: string) => {
    setWeights(weights.filter(w => w.id !== id));
  };

  const getWeightHistory = (days: number = 30) => {
    const sorted = [...weights].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return sorted.slice(-days);
  };

  return {
    weights,
    addWeight,
    deleteWeight,
    getWeightHistory,
  };
}
