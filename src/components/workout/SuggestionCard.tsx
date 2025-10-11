import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play } from 'lucide-react';
import { WorkoutSuggestion } from '@/types/workout';

interface SuggestionCardProps {
  suggestion: WorkoutSuggestion;
  onStart: () => void;
}

export function SuggestionCard({ suggestion, onStart }: SuggestionCardProps) {
  const categoryColors = {
    cardio: 'bg-red-500/10 text-red-700 dark:text-red-300',
    strength: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
    mobility: 'bg-green-500/10 text-green-700 dark:text-green-300',
    flexibility: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{suggestion.name}</CardTitle>
            <CardDescription className="text-sm">{suggestion.reason}</CardDescription>
          </div>
          <Badge className={categoryColors[suggestion.category as keyof typeof categoryColors]}>
            {suggestion.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{suggestion.duration} minutes</span>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Workout Cues:</p>
          <ul className="space-y-1">
            {suggestion.cues.map((cue, index) => (
              <li key={index} className="text-sm text-muted-foreground ml-4 list-disc">
                {cue}
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={onStart} className="w-full" size="lg">
          <Play className="h-4 w-4 mr-2" />
          Start Workout
        </Button>
      </CardContent>
    </Card>
  );
}
