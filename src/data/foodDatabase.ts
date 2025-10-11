import foodItems from './fooditems.json';

export interface FoodItem {
  Food: string;
  ItemCalories: number;
  Nutrients: string;
  Micronutrients: string;
}

export const foodDatabase: FoodItem[] = foodItems as FoodItem[];

export function parseNutrients(nutrients: string) {
  const matches = nutrients.match(/(\d+\.?\d*)Protein\(g\), (\d+\.?\d*)Carbs\(g\), (\d+\.?\d*)Fat\(g\)/);

  if (!matches) {
    return { protein: 0, carbs: 0, fats: 0 };
  }

  return {
    protein: parseFloat(matches[1]),
    carbs: parseFloat(matches[2]),
    fats: parseFloat(matches[3])
  };
}
