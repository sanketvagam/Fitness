import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { toast } from "sonner";

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  onAddActivity: (activity: {
    goalId: string;
    type: "workout" | "weight" | "steps" | "distance";
    value: number;
    date: string;
    notes?: string;
  }) => void;
}

export function AddActivityDialog({ 
  open, 
  onOpenChange, 
  goalId, 
  onAddActivity 
}: AddActivityDialogProps) {
  const [type, setType] = useState<"workout" | "weight" | "steps" | "distance" | "running" | "swimming" | "exercise">("workout");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!value) {
      toast.error("Please enter a value");
      return;
    }

    onAddActivity({
      goalId,
      type,
      value: Number(value),
      date,
      notes: notes || undefined,
    });

    toast.success("Activity logged! 💪");
    onOpenChange(false);
    setValue("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Log Activity
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise">Personalized Exercise (min)</SelectItem>
                <SelectItem value="running">Running (km)</SelectItem>
                <SelectItem value="swimming">Swimming (laps)</SelectItem>
                <SelectItem value="steps">Steps</SelectItem>
                <SelectItem value="workout">Workout Session</SelectItem>
                <SelectItem value="distance">Distance (km)</SelectItem>
                <SelectItem value="weight">Weight (kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="How did it feel?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Log Activity
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
