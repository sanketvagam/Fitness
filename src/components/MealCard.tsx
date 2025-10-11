import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Coffee, Sun, Moon, Cookie } from "lucide-react";
import { Meal } from "@/types/fitness";
import { Badge } from "@/components/ui/badge";

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
}

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

const mealColors = {
  breakfast: "bg-orange-500/10 text-orange-500",
  lunch: "bg-yellow-500/10 text-yellow-500",
  dinner: "bg-blue-500/10 text-blue-500",
  snack: "bg-purple-500/10 text-purple-500",
};

export function MealCard({ meal, onDelete }: MealCardProps) {
  const Icon = mealIcons[meal.type];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-lg ${mealColors[meal.type]} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{meal.name}</h4>
                <Badge variant="outline" className="text-xs capitalize">
                  {meal.type}
                </Badge>
              </div>
              {meal.notes && (
                <p className="text-sm text-muted-foreground mt-1">{meal.notes}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Calories (kcal/100g): </span>
                <span className="font-semibold">{meal.calories}</span>
              </div>
              {meal.protein > 0 && (
                <div>
                  <span className="text-muted-foreground">Protein: </span>
                  <span className="font-semibold">{meal.protein}g</span>
                </div>
              )}
              {meal.carbs > 0 && (
                <div>
                  <span className="text-muted-foreground">Carbs: </span>
                  <span className="font-semibold">{meal.carbs}g</span>
                </div>
              )}
              {meal.fats > 0 && (
                <div>
                  <span className="text-muted-foreground">Fats: </span>
                  <span className="font-semibold">{meal.fats}g</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(meal.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
