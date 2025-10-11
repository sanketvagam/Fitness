import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TodayView } from './TodayView';
import { RunView } from './RunView';
import { HistoryView } from './HistoryView';
import { WorkoutSuggestion } from '@/types/workout';

export function PersonalWorkoutPlans() {
  const [activeView, setActiveView] = useState<'today' | 'run' | 'history'>('today');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSuggestion | null>(null);

  const handleStartWorkout = (suggestion: WorkoutSuggestion) => {
    setCurrentWorkout(suggestion);
    setActiveView('run');
  };

  const handleCompleteWorkout = () => {
    setCurrentWorkout(null);
    setActiveView('history');
  };

  const handleCancelWorkout = () => {
    setCurrentWorkout(null);
    setActiveView('today');
  };

  if (activeView === 'run' && currentWorkout) {
    return (
      <RunView
        suggestion={currentWorkout}
        onComplete={handleCompleteWorkout}
        onCancel={handleCancelWorkout}
      />
    );
  }

  return (
    <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="today" className="mt-6">
        <TodayView onStartWorkout={handleStartWorkout} />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <HistoryView />
      </TabsContent>
    </Tabs>
  );
}
