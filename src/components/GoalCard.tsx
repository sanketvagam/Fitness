import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FitnessGoal } from "@/types/fitness";
import { Target, Trash2, Calendar, TrendingUp } from '@/components/icons';
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: FitnessGoal;
  onDelete: (id: string) => void;
  onAddActivity: (goalId: string) => void;
}

const goalIcons: Record<string, string> = {
  "weight-loss": "🏋️",
  "run-distance": "🏃",
  "gym-frequency": "💪",
  "daily-steps": "👟",
};

export function GoalCard({ goal, onDelete, onAddActivity }: GoalCardProps) {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isCompleted = goal.current >= goal.target;

  return (
    <Card className={cn(
      "p-6 border-border/50 backdrop-blur-sm transition-all hover:scale-[1.02]",
      isCompleted && "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/30"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{goalIcons[goal.type] || "🎯"}</span>
          <div>
            <h3 className="font-bold text-lg">{goal.title}</h3>
            <p className="text-sm text-muted-foreground">{goal.category}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(goal.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {goal.current} / {goal.target} {goal.unit}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{daysRemaining > 0 ? `${daysRemaining} days left` : "Deadline passed"}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-primary">
            <TrendingUp className="w-4 h-4" />
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {!isCompleted && (
          <Button 
            onClick={() => onAddActivity(goal.id)} 
            className="w-full"
            variant="default"
          >
            <Target className="w-4 h-4 mr-2" />
            Log Activity
          </Button>
        )}
        
        {isCompleted && (
          <div className="text-center py-2 px-4 bg-primary/10 rounded-lg">
            <span className="text-sm font-semibold text-primary">🎉 Goal Completed!</span>
          </div>
        )}
      </div>
    </Card>
  );
}
