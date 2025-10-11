import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "late-night-snack";

interface MealTypeSelectorProps {
  value: MealType;
  onChange: (value: MealType) => void;
  label?: string;
  autoDetect?: boolean;
}

export function MealTypeSelector({
  value,
  onChange,
  label = "Meal Type",
  autoDetect = true
}: MealTypeSelectorProps) {

  const detectMealType = (): MealType => {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 11) {
      return "breakfast";
    } else if (hours >= 11 && hours < 16) {
      return "lunch";
    } else if (hours >= 16 && hours < 19) {
      return "snack";
    } else if (hours >= 19 && hours < 23) {
      return "dinner";
    } else {
      return "late-night-snack";
    }
  };

  useEffect(() => {
    if (autoDetect) {
      const detectedType = detectMealType();
      onChange(detectedType);
    }
  }, [autoDetect]);

  return (
    <div>
      <Label htmlFor="meal-type">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="meal-type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="breakfast">Breakfast</SelectItem>
          <SelectItem value="lunch">Lunch</SelectItem>
          <SelectItem value="snack">Snacks</SelectItem>
          <SelectItem value="dinner">Dinner</SelectItem>
          <SelectItem value="late-night-snack">Late Night Snacks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
