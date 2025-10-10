import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Target, TrendingDown, Dumbbell, Activity, Flame, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { GoalType } from "@/types/fitness";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

const goalTemplates = [
  {
    type: "weight-loss" as GoalType,
    icon: TrendingDown,
    title: "Weight Loss",
    description: "Lose weight and get healthier",
    unit: "kg",
    category: "Fitness",
    gradient: "from-red-500 to-pink-500",
    suggestions: [5, 10, 15, 20],
    defaultTarget: 10,
    placeholder: "e.g., Lose 10kg by summer"
  },
  {
    type: "run-distance" as GoalType,
    icon: Activity,
    title: "Running Distance",
    description: "Build endurance and stamina",
    unit: "km",
    category: "Cardio",
    gradient: "from-blue-500 to-cyan-500",
    suggestions: [50, 100, 200, 300],
    defaultTarget: 100,
    placeholder: "e.g., Run 100km this month"
  },
  {
    type: "gym-frequency" as GoalType,
    icon: Dumbbell,
    title: "Gym Sessions",
    description: "Stay consistent with workouts",
    unit: "sessions",
    category: "Strength",
    gradient: "from-purple-500 to-indigo-500",
    suggestions: [12, 20, 30, 40],
    defaultTarget: 20,
    placeholder: "e.g., Hit the gym 20 times"
  },
  {
    type: "daily-steps" as GoalType,
    icon: Flame,
    title: "Daily Steps",
    description: "Stay active throughout the day",
    unit: "steps",
    category: "Activity",
    gradient: "from-orange-500 to-yellow-500",
    suggestions: [5000, 8000, 10000, 15000],
    defaultTarget: 10000,
    placeholder: "e.g., Walk 10,000 steps daily"
  },
];

export function CreateGoalDialog({ onCreateGoal }: CreateGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'customize'>(('select'));
  const [selectedTemplate, setSelectedTemplate] = useState<typeof goalTemplates[0] | null>(null);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState<Date>();

  const handleTemplateSelect = (template: typeof goalTemplates[0]) => {
    setSelectedTemplate(template);
    setTarget(template.defaultTarget.toString());
    setTitle("");
    setStep('customize');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedTemplate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate || !title || !target || !deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    onCreateGoal({
      type: selectedTemplate.type,
      title,
      target: Number(target),
      current: 0,
      unit: selectedTemplate.unit,
      deadline: format(deadline, 'yyyy-MM-dd'),
      category: selectedTemplate.category,
    });

    toast.success("Goal created successfully! 🎯");

    setOpen(false);
    setStep('select');
    setSelectedTemplate(null);
    setTitle("");
    setTarget("");
    setDeadline(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setStep('select');
        setSelectedTemplate(null);
        setTitle("");
        setTarget("");
        setDeadline(undefined);
      }
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Create Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === 'select' ? 'Choose Your Goal' : 'Customize Your Goal'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 py-4"
            >
              <p className="text-muted-foreground text-center mb-6">
                Select a goal type to get started on your fitness journey
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.type}
                      className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="space-y-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <div className="flex items-center text-sm text-primary font-medium">
                          Click to customize
                          <Target className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'customize' && selectedTemplate && (
            <motion.form
              key="customize"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6 py-4"
            >
              <div className={`p-6 rounded-xl bg-gradient-to-br ${selectedTemplate.gradient} text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <selectedTemplate.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTemplate.title}</h3>
                    <p className="text-white/90">{selectedTemplate.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Give your goal a name</Label>
                <Input
                  placeholder={selectedTemplate.placeholder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Set your target ({selectedTemplate.unit})
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {selectedTemplate.suggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        type="button"
                        variant={target === suggestion.toString() ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setTarget(suggestion.toString())}
                      >
                        {suggestion} {selectedTemplate.unit}
                      </Button>
                    ))}
                  </div>
                  <Input
                    type="number"
                    placeholder="Or enter custom value"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="text-base h-12"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Choose your deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 text-base",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {deadline ? format(deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={!title || !target || !deadline}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Create Goal
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
