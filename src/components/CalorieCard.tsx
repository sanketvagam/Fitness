import { Card } from "@/components/ui/card";
import { CalorieData } from "@/types/fitness";
import { Utensils } from "lucide-react";
import { useMealData } from "@/hooks/useMealData";
import { ProgressRing } from "./ProgressRing";

interface CalorieCardProps {
  calorieData: CalorieData;
}

export function CalorieCard({ calorieData }: CalorieCardProps) {
  const { getDailyNutrition } = useMealData();
  const todayNutrition = getDailyNutrition(new Date());

  const caloriesConsumed = todayNutrition.totalCalories;
  const remainingCalories = calorieData.targetCalories - caloriesConsumed;
  const calorieProgress = Math.min((caloriesConsumed / calorieData.targetCalories) * 100, 100);

  const proteinConsumed = Math.round(todayNutrition.totalProtein);
  const carbsConsumed = Math.round(todayNutrition.totalCarbs);
  const fatsConsumed = Math.round(todayNutrition.totalFats);

  const proteinPercentage = Math.round((proteinConsumed / calorieData.protein) * 100);
  const carbsPercentage = Math.round((carbsConsumed / calorieData.carbs) * 100);
  const fatsPercentage = Math.round((fatsConsumed / calorieData.fats) * 100);

  const getCalorieStatus = () => {
    if (caloriesConsumed < calorieData.targetCalories * 0.8) {
      return { text: "Below Target", color: "text-blue-500" };
    } else if (caloriesConsumed <= calorieData.targetCalories) {
      return { text: "On Track", color: "text-green-500" };
    } else if (caloriesConsumed <= calorieData.targetCalories * 1.1) {
      return { text: "Slightly Over", color: "text-yellow-500" };
    } else {
      return { text: "Over Target", color: "text-red-500" };
    }
  };

  const status = getCalorieStatus();

  return (
    <Card className="p-6 border-border/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg mb-1">Daily Calories</h3>
          <p className="text-sm text-muted-foreground">Nutrition tracking</p>
        </div>
        <div className="p-2 rounded-full bg-primary/10">
          <Utensils className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <ProgressRing progress={calorieProgress} size={100} />
        <div className="flex-1">
          <p className="text-3xl font-bold mb-1">{caloriesConsumed}</p>
          <p className={`text-sm font-semibold mb-2 ${status.color}`}>
            {status.text}
          </p>
          <p className="text-xs text-muted-foreground">
            {remainingCalories > 0
              ? `${remainingCalories} kcal remaining`
              : `${Math.abs(remainingCalories)} kcal over`}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 mx-auto mb-2 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-500">{proteinPercentage}%</span>
            </div>
            <p className="font-semibold text-foreground">{proteinConsumed}g</p>
            <p className="text-muted-foreground">Protein</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 mx-auto mb-2 flex items-center justify-center">
              <span className="text-sm font-bold text-green-500">{carbsPercentage}%</span>
            </div>
            <p className="font-semibold text-foreground">{carbsConsumed}g</p>
            <p className="text-muted-foreground">Carbs</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 mx-auto mb-2 flex items-center justify-center">
              <span className="text-sm font-bold text-yellow-500">{fatsPercentage}%</span>
            </div>
            <p className="font-semibold text-foreground">{fatsConsumed}g</p>
            <p className="text-muted-foreground">Fats</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
