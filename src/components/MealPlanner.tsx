import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed, Trash2 } from "lucide-react";
import { AddMealDialog } from "./AddMealDialog";
import { useMealData } from "@/hooks/useMealData";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalorieData } from "@/types/fitness";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface MealPlannerProps {
  calorieData?: CalorieData;
}

export function MealPlanner({ calorieData }: MealPlannerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { meals, getWeeklyNutrition, deleteMeal } = useMealData();
  const { toast } = useToast();

  const today = new Date();

  const weeklyData = useMemo(() => {
    return getWeeklyNutrition();
  }, [meals]);

  const todayData = weeklyData[weeklyData.length - 1];
  const targetCalories = calorieData?.targetCalories || 2000;

  const remainingCalories = targetCalories - todayData.totalCalories;
  const progress = (todayData.totalCalories / targetCalories) * 100;

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
                {todayData.totalCalories}
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
              <p className="text-lg font-semibold">{Math.round(todayData.totalProtein)}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="text-lg font-semibold">{Math.round(todayData.totalCarbs)}g</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fats</p>
              <p className="text-lg font-semibold">{Math.round(todayData.totalFats)}g</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals by Day */}
      <div className="space-y-6">
        {weeklyData.every(day => day.meals.length === 0) ? (
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
          weeklyData.map((dayData, dayIndex) => {
            if (dayData.meals.length === 0) return null;

            const date = new Date(dayData.date);
            const isToday = dayData.date === format(today, 'yyyy-MM-dd');

            return (
              <motion.div
                key={dayData.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {format(date, 'EEEE, MMMM d, yyyy')}
                          {isToday && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                              Today
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Total: {dayData.totalCalories} kcal | Protein: {Math.round(dayData.totalProtein)}g | Carbs: {Math.round(dayData.totalCarbs)}g | Fats: {Math.round(dayData.totalFats)}g
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Meal Type</TableHead>
                          <TableHead className="text-right">Calories (kcal/100g)</TableHead>
                          <TableHead className="text-right">Protein (g)</TableHead>
                          <TableHead className="text-right">Carbs (g)</TableHead>
                          <TableHead className="text-right">Fats (g)</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dayData.meals.map((meal, mealIndex) => {
                          const sameTypeMeals = dayData.meals.filter(m => m.type === meal.type);
                          const typeCount = sameTypeMeals.findIndex(m => m.id === meal.id) + 1;
                          const displayName = `${meal.type}${typeCount}`;

                          return (
                          <TableRow key={meal.id}>
                            <TableCell className="font-medium capitalize">{displayName}</TableCell>
                            <TableCell className="text-right">{meal.calories}</TableCell>
                            <TableCell className="text-right">{Math.round(meal.protein)}</TableCell>
                            <TableCell className="text-right">{Math.round(meal.carbs)}</TableCell>
                            <TableCell className="text-right">{Math.round(meal.fats)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  deleteMeal(meal.id);
                                  toast({
                                    title: "Meal deleted",
                                    description: "The meal has been removed from your log",
                                  });
                                }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      <AddMealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </motion.div>
  );
}
