import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Activity, Waves, Footprints, Scale, Plus, Zap, Calendar, Clock, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { format } from 'date-fns';

interface QuickActivityWidgetProps {
  onLogActivity: (activity: {
    type: 'running' | 'swimming' | 'steps' | 'weight' | 'exercise';
    value: number;
    unit?: string;
  }) => void;
}

const activityTypes = [
  {
    type: 'exercise' as const,
    icon: Zap,
    label: 'Exercise',
    unit: 'min',
    color: 'from-red-500 to-pink-500',
    quickValues: [5, 10, 15],
  },
  {
    type: 'steps' as const,
    icon: Footprints,
    label: 'Steps',
    unit: 'steps',
    color: 'from-orange-500 to-yellow-500',
    quickValues: [5000, 10000, 15000],
  },
  {
    type: 'running' as const,
    icon: Activity,
    label: 'Running',
    unit: 'km',
    color: 'from-blue-500 to-cyan-500',
    quickValues: [2, 5, 10],
  },
  {
    type: 'swimming' as const,
    icon: Waves,
    label: 'Swimming',
    unit: 'laps',
    color: 'from-teal-500 to-emerald-500',
    quickValues: [10, 20, 30],
  },
  {
    type: 'weight' as const,
    icon: Scale,
    label: 'Weight',
    unit: 'kg',
    color: 'from-red-500 to-pink-500',
    quickValues: [0.5, 1, 2],
  }

];

export function QuickActivityWidget({ onLogActivity }: QuickActivityWidgetProps) {
  const [selectedType, setSelectedType] = useState<typeof activityTypes[0] | null>(null);
  const [value, setValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { sessions, getWeeklyAQM, loading, refresh } = useWorkoutPlans();

  const weeklyAQM = getWeeklyAQM();

  useEffect(() => {
    if (showHistory) {
      console.log('Refreshing workout history...');
      refresh();
    }
  }, [showHistory]);

  useEffect(() => {
    console.log('Sessions updated:', sessions.length, sessions);
  }, [sessions]);

  const handleQuickLog = (type: typeof activityTypes[0], quickValue: number) => {
    console.log(type.type);
    console.log(quickValue);
    onLogActivity({
      type: type.type,
      value: quickValue,
    });
    toast.success(`${quickValue} ${type.unit} logged! 💪`);
  };

  const handleExerciseLog = (duration: { label: string; value: number; unit: string }) => {

    console.log(duration.value);
    console.log(duration.unit);
    onLogActivity({
      type: 'exercise',
      value: duration.value,
      unit: duration.unit,
    });
    toast.success(`${duration.label} exercise logged! 💪`);
  };

  const handleCustomLog = () => {
    if (!selectedType || !value) {
      toast.error('Please enter a value');
      return;
    }

    onLogActivity({
      type: selectedType.type,
      value: Number(value),
    });

    toast.success(`${value} ${selectedType.unit} logged! 💪`);
    setValue('');
    setSelectedType(null);
    setIsExpanded(false);
  };

  const exportToCSV = () => {
    if (sessions.length === 0) {
      toast.error('No sessions to export');
      return;
    }

    const headers = ['Date', 'Workout', 'Duration (min)', 'RPE', 'Pain', 'Notes'];
    const rows = sessions.map(s => [
      format(new Date(s.completed_at), 'yyyy-MM-dd HH:mm'),
      s.micro_plans?.name || 'Unknown',
      s.duration_minutes.toString(),
      s.rpe?.toString() || '',
      s.pain?.toString() || '',
      s.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Exported workout history');
  };

  if (showHistory) {
    if (loading) {
      return (
        <Card className="overflow-hidden border-2 border-primary/20">
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden border-2 border-primary/20">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Activity History</h3>
                <p className="text-xs text-white/90">Track your workout journey</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(false)}
              className="text-white hover:bg-white/20"
            >
              Back to Log
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Weekly Activity Quality Minutes</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
            {sessions.length > 0 && (
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
          <div className="text-3xl font-bold">{weeklyAQM} minutes</div>

          {sessions.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No workout sessions yet</p>
              <p className="text-sm">Complete your first workout to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="py-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">
                            {session.micro_plans?.name || 'Custom Workout'}
                          </h4>
                          {session.micro_plans && (
                            <Badge variant="outline" className="text-xs">
                              {session.micro_plans.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(session.completed_at), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.duration_minutes} min
                          </span>
                        </div>
                        {session.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{session.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {session.rpe !== null && session.rpe !== undefined && (
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">RPE</div>
                            <div className="font-semibold text-sm">{session.rpe}/10</div>
                          </div>
                        )}
                        {session.pain !== null && session.pain !== undefined && (
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Pain</div>
                            <div className="font-semibold text-sm">{session.pain}/10</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/20">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">Quick Log</h3>
              <p className="text-xs text-white/90">Track your activity instantly</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(true)}
              className="text-white hover:bg-white/20"
            >
              History
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20"
            >
              {isExpanded ? 'Simple' : 'Custom'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="simple"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {activityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.type} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center',
                          type.color
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{type.label}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {type.unit}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {type.quickValues.map((quickValue) => (
                        <Button
                          key={quickValue}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLog(type, quickValue)}
                          className="flex-1 h-9"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {quickValue}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.type}
                      variant={selectedType?.type === type.type ? 'default' : 'outline'}
                      onClick={() => setSelectedType(type)}
                      className="h-auto py-3 flex flex-col gap-1"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{type.label}</span>
                    </Button>
                  );
                })}
              </div>

              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder={`Enter ${selectedType.unit}`}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCustomLog}
                      disabled={!value}
                      className="px-6"
                    >
                      Log
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
