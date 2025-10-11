import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutPlansDialog } from "@/components/WorkoutPlansDialog";
import { Dumbbell } from "@/components/icons";
import { useState } from "react";

export function PersonalWorkoutPlans() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workout Plans</h2>
          <p className="text-sm text-muted-foreground">
            Track your workouts and stay consistent
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Dumbbell className="w-4 h-4" />
          Browse Plans
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Dumbbell className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Plans</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start a workout plan to reach your fitness goals
            </p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
              Browse Workout Plans
            </Button>
          </div>
        </Card>
      </div>

      <WorkoutPlansDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
