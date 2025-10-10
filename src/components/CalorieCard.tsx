import { Card } from "@/components/ui/card";
import { CalorieData } from "@/types/fitness";
import { Utensils, Flame, TrendingUp } from "lucide-react";

interface CalorieCardProps {
  calorieData: CalorieData;
}

export function CalorieCard({ calorieData }: CalorieCardProps) {
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
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Target Calories</span>
          </div>
          <p className="text-3xl font-bold">{calorieData.targetCalories} <span className="text-lg text-muted-foreground">kcal/day</span></p>
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Protein (30%)</span>
              <span className="font-semibold">{calorieData.protein}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Carbs (40%)</span>
              <span className="font-semibold">{calorieData.carbs}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fats (30%)</span>
              <span className="font-semibold">{calorieData.fats}g</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
