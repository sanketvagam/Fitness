import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMealData } from "@/hooks/useMealData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { foodDatabase, parseNutrients } from "@/data/foodDatabase";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMealDialog({ open, onOpenChange }: AddMealDialogProps) {
  const { addMeal } = useMealData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    notes: "",
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [customInput, setCustomInput] = useState(false);

  const handleFoodSelect = (foodName: string) => {
    const foodItem = foodDatabase.find(item => item.Food === foodName);
    if (foodItem) {
      const nutrients = parseNutrients(foodItem.Nutrients);
      setFormData({
        ...formData,
        name: foodItem.Food,
        calories: foodItem.ItemCalories.toString(),
        protein: nutrients.protein.toString(),
        carbs: nutrients.carbs.toString(),
        fats: nutrients.fats.toString(),
      });
    }
    setPopoverOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.calories) {
      toast({
        title: "Missing information",
        description: "Please enter meal name and calories",
        variant: "destructive",
      });
      return;
    }

    addMeal({
      name: formData.name,
      type: formData.type,
      calories: parseFloat(formData.calories),
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fats: parseFloat(formData.fats) || 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: formData.notes,
    });

    toast({
      title: "Meal added!",
      description: `${formData.name} has been logged`,
    });

    setFormData({
      name: "",
      type: "breakfast",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      notes: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Meal Name</Label>
            {customInput ? (
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Salad"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomInput(false)}
                >
                  Select from list
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between"
                    >
                      {formData.name || "Select meal..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search meals..." />
                      <CommandList>
                        <CommandEmpty>No meal found.</CommandEmpty>
                        <CommandGroup>
                          {foodDatabase.map((food) => (
                            <CommandItem
                              key={food.Food}
                              value={food.Food}
                              onSelect={handleFoodSelect}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.name === food.Food ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {food.Food} - {food.ItemCalories} cal
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomInput(true)}
                >
                  Custom
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="type">Meal Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories">Calories *</Label>
              <Input
                id="calories"
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="500"
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                placeholder="30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                placeholder="40"
              />
            </div>
            <div>
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                placeholder="15"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Meal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
