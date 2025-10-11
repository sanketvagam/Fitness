import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { format } from 'date-fns';
import { Download, Calendar, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function HistoryView() {
  const { sessions, getWeeklyAQM, loading } = useWorkoutPlans();

  const weeklyAQM = getWeeklyAQM();

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

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity History</h2>
          <p className="text-muted-foreground">Track your workout journey</p>
        </div>
        {sessions.length > 0 && (
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Activity Quality Minutes
          </CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{weeklyAQM} minutes</div>
        </CardContent>
      </Card>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No workout sessions yet</p>
            <p className="text-sm">Complete your first workout to start tracking!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {session.micro_plans?.name || 'Custom Workout'}
                      </h3>
                      {session.micro_plans && (
                        <Badge variant="outline" className="text-xs">
                          {session.micro_plans.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                      <p className="text-sm text-muted-foreground mt-2">{session.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {session.rpe !== null && session.rpe !== undefined && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">RPE</div>
                        <div className="font-semibold">{session.rpe}/10</div>
                      </div>
                    )}
                    {session.pain !== null && session.pain !== undefined && (
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Pain</div>
                        <div className="font-semibold">{session.pain}/10</div>
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
  );
}
