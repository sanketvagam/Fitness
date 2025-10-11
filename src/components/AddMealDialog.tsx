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
import { foodDatabase, parseNutrients, FoodItem } from "@/data/foodDatabase";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMealDialog({ open, onOpenChange }: AddMealDialogProps) {
  const { addMeal } = useMealData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: "breakfast" as "breakfast" | "lunch" | "dinner" | "snack",
    notes: "",
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);

  const handleFoodSelect = (foodName: string) => {
    const foodItem = foodDatabase.find(item => item.Food === foodName);
    if (foodItem && !selectedItems.find(item => item.Food === foodName)) {
      setSelectedItems([...selectedItems, foodItem]);
    }
    setPopoverOpen(false);
  };

  const handleRemoveItem = (foodName: string) => {
    setSelectedItems(selectedItems.filter(item => item.Food !== foodName));
  };

  const calculateTotals = () => {
    return selectedItems.reduce((totals, item) => {
      const nutrients = parseNutrients(item.Nutrients);
      return {
        calories: totals.calories + item.ItemCalories,
        protein: totals.protein + nutrients.protein,
        carbs: totals.carbs + nutrients.carbs,
        fats: totals.fats + nutrients.fats,
      };
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one meal item",
        variant: "destructive",
      });
      return;
    }

    const totals = calculateTotals();
    const mealName = selectedItems.map(item => item.Food).join(", ");

    addMeal({
      name: mealName,
      type: formData.type,
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fats: totals.fats,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: formData.notes,
    });

    toast({
      title: "Meal added!",
      description: `Meal with ${selectedItems.length} items has been logged`,
    });

    setFormData({
      type: "breakfast",
      notes: "",
    });
    setSelectedItems([]);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Select Meal Items</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  Select items to add...
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
                              selectedItems.find(item => item.Food === food.Food) ? "opacity-100" : "opacity-0"
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
          </div>

          {selectedItems.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Calories (kcal/100g)</TableHead>
                    <TableHead className="text-right">Protein (g)</TableHead>
                    <TableHead className="text-right">Carbs (g)</TableHead>
                    <TableHead className="text-right">Fats (g)</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => {
                    const nutrients = parseNutrients(item.Nutrients);
                    return (
                      <TableRow key={item.Food}>
                        <TableCell className="font-medium">{item.Food}</TableCell>
                        <TableCell className="text-right">{item.ItemCalories}</TableCell>
                        <TableCell className="text-right">{nutrients.protein}</TableCell>
                        <TableCell className="text-right">{nutrients.carbs}</TableCell>
                        <TableCell className="text-right">{nutrients.fats}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.Food)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{calculateTotals().calories}</TableCell>
                    <TableCell className="text-right">{calculateTotals().protein.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{calculateTotals().carbs.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{calculateTotals().fats.toFixed(1)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

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
