import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/hooks/useHabits';
import { Plus, CheckCircle2, Circle, Flame, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddHabitDialog } from './AddHabitDialog';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

export function HabitTracker() {
  const { habits, toggleHabitCompletion, isHabitCompletedToday, deleteHabit } = useHabits();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return Icon || LucideIcons.Circle;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Daily Habits</h2>
          <p className="text-sm text-muted-foreground">Build consistency, one day at a time</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Habit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {habits.map((habit, index) => {
          const isCompleted = isHabitCompletedToday(habit.id);
          const IconComponent = getIcon(habit.icon);

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isCompleted ? 'text-primary' : ''}`}>
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-accent" />
                          <span className="font-semibold">{habit.streak}</span>
                          <span>day streak</span>
                        </div>
                        {habit.targetPerWeek && (
                          <span className="text-xs">
                            Target: {habit.targetPerWeek}x/week
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isCompleted ? 'default' : 'outline'}
                      onClick={() => toggleHabitCompletion(habit.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No habits yet. Add your first habit to get started!</p>
        </Card>
      )}

      <AddHabitDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
