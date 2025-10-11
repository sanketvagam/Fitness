import { useState } from 'react';
import { TodayView } from './TodayView';
import { RunView } from './RunView';
import { WorkoutSuggestion } from '@/types/workout';

export function PersonalWorkoutPlans() {
  const [activeView, setActiveView] = useState<'today' | 'run'>('today');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSuggestion | null>(null);

  const handleStartWorkout = (suggestion: WorkoutSuggestion) => {
    setCurrentWorkout(suggestion);
    setActiveView('run');
  };

  const handleCompleteWorkout = () => {
    setCurrentWorkout(null);
    setActiveView('today');
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

  return <TodayView onStartWorkout={handleStartWorkout} />;
}
