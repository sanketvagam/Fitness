import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { GoalType } from "@/types/fitness";
import { toast } from "sonner";

interface CreateGoalDialogProps {
  onCreateGoal: (goal: {
    type: GoalType;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string;
    category: string;
  }) => void;
}

const goalTypes = [
  { value: "weight-loss", label: "Weight Loss", unit: "kg", category: "Fitness" },
  { value: "run-distance", label: "Run Distance", unit: "km", category: "Cardio" },
  { value: "gym-frequency", label: "Gym Sessions", unit: "sessions", category: "Strength" },
  { value: "daily-steps", label: "Daily Steps", unit: "steps", category: "Activity" },
];

export function CreateGoalDialog({ onCreateGoal }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<GoalType>("run-distance");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !target || !deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedType = goalTypes.find(g => g.value === type);
    
    onCreateGoal({
      type,
      title,
      target: Number(target),
      current: 0,
      unit: selectedType?.unit || "",
      deadline,
      category: selectedType?.category || "",
    });

    toast.success("Goal created successfully! 🎯");
    setOpen(false);
    setTitle("");
    setTarget("");
    setDeadline("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Fitness Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Goal Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as GoalType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {goalTypes.map((gt) => (
                  <SelectItem key={gt.value} value={gt.value}>
                    {gt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Goal Title</Label>
            <Input
              placeholder="e.g., Run 5km daily"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Target ({goalTypes.find(g => g.value === type)?.unit})</Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
