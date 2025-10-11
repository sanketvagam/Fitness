import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, TrendingUp } from '@/components/icons';
import { workoutPlans } from "@/data/workoutPlans";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WorkoutPlansDialog() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500";
      case "advanced":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Dumbbell className="w-4 h-4" />
          View Workout Plans
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Workout Plans
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <Tabs defaultValue={workoutPlans[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              {workoutPlans.map((plan) => (
                <TabsTrigger key={plan.id} value={plan.id} className="text-xs">
                  {plan.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            {workoutPlans.map((plan) => (
              <TabsContent key={plan.id} value={plan.id} className="space-y-4 mt-4">
                <Card className="p-4 border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <Badge className={getDifficultyColor(plan.difficulty)}>
                      {plan.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{plan.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{plan.exercises.length} exercises</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-3">
                  {plan.exercises.map((exercise, index) => (
                    <Card key={index} className="p-4 border-border/50">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1">{exercise.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Sets:</span>
                              <span className="font-semibold">{exercise.sets}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Reps:</span>
                              <span className="font-semibold">{exercise.reps}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">Rest:</span>
                              <span className="font-semibold">{exercise.rest}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
