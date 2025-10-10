import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed } from "lucide-react";
import { AddMealDialog } from "./AddMealDialog";
import { MealCard } from "./MealCard";
import { useMealData } from "@/hooks/useMealData";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalorieData } from "@/types/fitness";

interface MealPlannerProps {
  calorieData?: CalorieData;
}

export function MealPlanner({ calorieData }: MealPlannerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getDailyNutrition, deleteMeal } = useMealData();
  
  const today = new Date();
  const dailyNutrition = getDailyNutrition(today);
  const targetCalories = calorieData?.targetCalories || 2000;

  const remainingCalories = targetCalories - dailyNutrition.totalCalories;
  const progress = (dailyNutrition.totalCalories / targetCalories) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Meal Planner</h2>
            <p className="text-sm text-muted-foreground">
              {format(today, 'EEEE, MMMM d')}
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </div>

      {/* Daily Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Calories Today</p>
              <p className="text-3xl font-bold">
                {dailyNutrition.totalCalories}
                <span className="text-lg text-muted-foreground">/{targetCalories}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className={`text-2xl font-bold ${remainingCalories < 0 ? 'text-destructive' : 'text-green-500'}`}>
                {remainingCalories > 0 ? remainingCalories : 0} cal
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-secondary"
              />
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="text-lg font-semibold">{Math.round(dailyNutrition.totalProtein)}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="text-lg font-semibold">{Math.round(dailyNutrition.totalCarbs)}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fats</p>
              <p className="text-lg font-semibold">{Math.round(dailyNutrition.totalFats)}g</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals */}
      <div className="space-y-4">
        {dailyNutrition.meals.length === 0 ? (
          <Card className="p-12 text-center">
            <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No meals logged yet</h3>
            <p className="text-muted-foreground mb-4">Start tracking your nutrition today!</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Meal
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {dailyNutrition.meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MealCard meal={meal} onDelete={deleteMeal} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddMealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </motion.div>
  );
}
