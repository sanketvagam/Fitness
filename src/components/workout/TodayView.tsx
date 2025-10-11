import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SuggestionCard } from './SuggestionCard';
import { generateSuggestions } from '@/lib/suggestionEngine';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { WorkoutSuggestion } from '@/types/workout';
import { Loader2 } from 'lucide-react';

interface TodayViewProps {
  onStartWorkout: (suggestion: WorkoutSuggestion) => void;
}

export function TodayView({ onStartWorkout }: TodayViewProps) {
  const { plans, stats, recentPain, loading } = useWorkoutPlans();
  const [selectedDuration, setSelectedDuration] = useState<number | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<WorkoutSuggestion[]>([]);

  const durations = [5, 10, 15, 20];

  useEffect(() => {
    if (plans.length > 0) {
      const newSuggestions = generateSuggestions({
        plans,
        stats,
        recentPain,
        selectedDuration,
      });
      setSuggestions(newSuggestions);
    }
  }, [plans, stats, recentPain, selectedDuration]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Today's Workout</h2>
        <p className="text-muted-foreground">
          Choose your duration and start one of these personalized suggestions
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedDuration === undefined ? 'default' : 'outline'}
          onClick={() => setSelectedDuration(undefined)}
          size="lg"
        >
          All
        </Button>
        {durations.map((duration) => (
          <Button
            key={duration}
            variant={selectedDuration === duration ? 'default' : 'outline'}
            onClick={() => setSelectedDuration(duration)}
            size="lg"
          >
            {duration} min
          </Button>
        ))}
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No workout plans available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.planId}
              suggestion={suggestion}
              onStart={() => onStartWorkout(suggestion)}
            />
          ))}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Complete Streak</p>
            <p className="text-2xl font-bold">{stats.complete_streak} days</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Total AQM</p>
            <p className="text-2xl font-bold">{stats.total_aqm} min</p>
          </div>
        </div>
      )}
    </div>
  );
}
