import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '@/hooks/useHabits';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HABIT_ICONS = [
  { value: 'droplet', label: 'Water' },
  { value: 'moon', label: 'Sleep' },
  { value: 'move', label: 'Stretch' },
  { value: 'brain', label: 'Meditation' },
  { value: 'dumbbell', label: 'Workout' },
  { value: 'apple', label: 'Healthy Eating' },
  { value: 'bookOpen', label: 'Reading' },
  { value: 'smile', label: 'Gratitude' },
];

export function AddHabitDialog({ open, onOpenChange }: AddHabitDialogProps) {
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('circle');
  const [category, setCategory] = useState<'health' | 'fitness' | 'nutrition' | 'mindfulness'>('health');
  const [targetPerWeek, setTargetPerWeek] = useState('5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    addHabit({
      name: name.trim(),
      icon,
      category,
      targetPerWeek: parseInt(targetPerWeek),
    });

    toast.success('Habit added successfully!');
    onOpenChange(false);
    
    setName('');
    setIcon('circle');
    setCategory('health');
    setTargetPerWeek('5');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Workout"
            />
          </div>

          <div>
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HABIT_ICONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="target">Target per Week</Label>
            <Input
              id="target"
              type="number"
              min="1"
              max="7"
              value={targetPerWeek}
              onChange={(e) => setTargetPerWeek(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Habit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
