import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { WorkoutSuggestion } from '@/types/workout';
import { ChevronRight, Pause, Play, X } from 'lucide-react';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { toast } from 'sonner';
import { getExerciseGif } from '@/data/exerciseGifs';

interface RunViewProps {
  suggestion: WorkoutSuggestion;
  onComplete: () => void;
  onCancel: () => void;
}

export function RunView({ suggestion, onComplete, onCancel }: RunViewProps) {
  const { completeSession } = useWorkoutPlans();
  const [timeLeft, setTimeLeft] = useState(suggestion.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCueIndex, setCurrentCueIndex] = useState(0);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [rpe, setRpe] = useState([5]);
  const [pain, setPain] = useState([0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowFinishDialog(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextCue = () => {
    if (currentCueIndex < suggestion.cues.length - 1) {
      setCurrentCueIndex((prev) => prev + 1);
    }
  };

  const handleFinish = async () => {
    const actualDuration = Math.ceil((suggestion.duration * 60 - timeLeft) / 60);
    const success = await completeSession(
      suggestion.planId,
      actualDuration,
      rpe[0],
      pain[0],
      notes || undefined
    );

    if (success) {
      toast.success('Workout completed!');
      setShowFinishDialog(false);
      onComplete();
    } else {
      toast.error('Failed to save workout');
    }
  };

  const progress = ((suggestion.duration * 60 - timeLeft) / (suggestion.duration * 60)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{suggestion.name}</h2>
          <p className="text-muted-foreground">{suggestion.duration} minute workout</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-6xl font-mono">{formatTime(timeLeft)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="lg"
              className="w-32"
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {timeLeft === suggestion.duration * 60 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFinishDialog(true)}
              size="lg"
            >
              Finish Early
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Cue</CardTitle>
            <span className="text-sm text-muted-foreground">
              {currentCueIndex + 1} / {suggestion.cues.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-md aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={getExerciseGif(suggestion.cues[currentCueIndex])}
                alt={suggestion.cues[currentCueIndex]}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://media.tenor.com/Z5uXJMaLXagAAAAM/workout.gif';
                }}
              />
            </div>
            <p className="text-lg text-center font-medium">{suggestion.cues[currentCueIndex]}</p>
          </div>
          {currentCueIndex < suggestion.cues.length - 1 && (
            <Button onClick={handleNextCue} variant="outline" className="w-full">
              <ChevronRight className="h-4 w-4 mr-2" />
              Next Cue
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Workout</DialogTitle>
            <DialogDescription>
              How was your workout? This helps us personalize future suggestions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Rate of Perceived Exertion (RPE): {rpe[0]}/10</Label>
              <Slider
                value={rpe}
                onValueChange={setRpe}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                0 = No effort, 10 = Maximum effort
              </p>
            </div>

            <div className="space-y-2">
              <Label>Pain Level: {pain[0]}/10</Label>
              <Slider
                value={pain}
                onValueChange={setPain}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                0 = No pain, 10 = Extreme pain
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did you feel? Any observations?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleFinish}>Complete Workout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
