import { Card } from "@/components/ui/card";
import { CalorieData } from "@/types/fitness";
import { Utensils, Flame, TrendingUp } from "lucide-react";
import { useMealData } from "@/hooks/useMealData";
import { Progress } from "@/components/ui/progress";

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

  const proteinProgress = Math.min((proteinConsumed / calorieData.protein) * 100, 100);
  const carbsProgress = Math.min((carbsConsumed / calorieData.carbs) * 100, 100);
  const fatsProgress = Math.min((fatsConsumed / calorieData.fats) * 100, 100);
  return (
    <Card className="p-6 border-border/50 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg mb-1">Daily Calorie Plan</h3>
          <p className="text-sm text-muted-foreground">Personalized nutrition targets</p>
        </div>
        <div className="p-2 rounded-full bg-accent/10">
          <Utensils className="w-5 h-5 text-accent" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Daily Calories</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {caloriesConsumed} / {calorieData.targetCalories} kcal
            </span>
          </div>
          <Progress value={calorieProgress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            {remainingCalories > 0
              ? `${remainingCalories} kcal remaining`
              : `${Math.abs(remainingCalories)} kcal over target`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">BMR</p>
            <p className="text-xl font-bold">{calorieData.bmr}</p>
            <p className="text-xs text-muted-foreground">Base metabolic rate</p>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">TDEE</p>
            <p className="text-xl font-bold">{calorieData.tdee}</p>
            <p className="text-xs text-muted-foreground">Total daily energy</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Macronutrient Breakdown</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Protein (30%)</span>
                <span className="font-semibold text-sm">{proteinConsumed}g / {calorieData.protein}g</span>
              </div>
              <Progress value={proteinProgress} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Carbs (40%)</span>
                <span className="font-semibold text-sm">{carbsConsumed}g / {calorieData.carbs}g</span>
              </div>
              <Progress value={carbsProgress} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Fats (30%)</span>
                <span className="font-semibold text-sm">{fatsConsumed}g / {calorieData.fats}g</span>
              </div>
              <Progress value={fatsProgress} className="h-1.5" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
