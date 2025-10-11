export interface FoodItem {
  Food: string;
  ItemCalories: number;
  Nutrients: string;
  Micronutrients: string;
}

export const foodDatabase: FoodItem[] = [
  {
    Food: "Chapati (whole wheat)",
    ItemCalories: 297,
    Nutrients: "9.0Protein(g), 48.0Carbs(g), 7.0Fat(g), 6.5Fiber(g), 45Calcium(mg), 3.5Iron(mg), 76Magnesium(mg), 180Potassium(mg), 420Sodium(mg), 1.8Zinc(mg)",
    Micronutrients: "0Vit A(μg RAE), 0Vit C(mg), 0.18Vit B6(mg), 38Folate(μg), 0Vit B12(μg)"
  }
];

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
