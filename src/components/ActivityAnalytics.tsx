import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from '@/types/fitness';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface ActivityAnalyticsProps {
  activities: Activity[];
}

const activityColors = {
  workout: 'hsl(var(--primary))',
  distance: 'hsl(var(--primary))',
  steps: 'hsl(var(--primary))',
  weight: 'hsl(var(--primary))',
};

export function ActivityAnalytics({ activities }: ActivityAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');

  const getDaysData = () => {
    const days = parseInt(timeRange);
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return dateRange.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayActivities = activities.filter((a) => a.date === dateStr);

      return {
        date: format(date, 'MMM dd'),
        fullDate: dateStr,
        workout: dayActivities.filter((a) => a.type === 'workout').length,
        distance: dayActivities
          .filter((a) => a.type === 'distance')
          .reduce((sum, a) => sum + a.value, 0),
        steps: dayActivities
          .filter((a) => a.type === 'steps')
          .reduce((sum, a) => sum + a.value, 0),
        weight: dayActivities.find((a) => a.type === 'weight')?.value || 0,
        total: dayActivities.length,
      };
    });
  };

  const chartData = getDaysData();

  const getTypeStats = () => {
    const days = parseInt(timeRange);
    const cutoffDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
    const recentActivities = activities.filter((a) => a.date >= cutoffDate);

    return [
      {
        name: 'Workouts',
        value: recentActivities.filter((a) => a.type === 'workout').length,
        color: activityColors.workout,
      },
      {
        name: 'Distance',
        value: recentActivities
          .filter((a) => a.type === 'distance')
          .reduce((sum, a) => sum + a.value, 0),
        color: activityColors.distance,
      },
      {
        name: 'Steps',
        value: Math.round(
          recentActivities.filter((a) => a.type === 'steps').reduce((sum, a) => sum + a.value, 0) /
            1000
        ),
        color: activityColors.steps,
      },
    ].filter((stat) => stat.value > 0);
  };

  const typeStats = getTypeStats();

  const getInsights = () => {
    const days = parseInt(timeRange);
    const totalActivities = chartData.reduce((sum, day) => sum + day.total, 0);
    const avgPerDay = (totalActivities / days).toFixed(1);

    const mostActiveDay = chartData.reduce((max, day) => (day.total > max.total ? day : max), chartData[0]);

    const totalWorkouts = chartData.reduce((sum, day) => sum + day.workout, 0);
    const totalDistance = chartData.reduce((sum, day) => sum + day.distance, 0);

    return {
      avgPerDay,
      mostActiveDay: mostActiveDay?.date || 'N/A',
      totalActivities,
      totalWorkouts,
      totalDistance: totalDistance.toFixed(1),
    };
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <CardTitle className="text-lg">Activity Analytics</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeRange === '7' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7')}
              >
                7D
              </Button>
              <Button
                variant={timeRange === '30' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30')}
              >
                30D
              </Button>
              <Button
                variant={timeRange === '90' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90')}
              >
                90D
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Activities</div>
              <div className="text-2xl font-bold">{insights.totalActivities}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg Per Day</div>
              <div className="text-2xl font-bold">{insights.avgPerDay}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Workouts</div>
              <div className="text-2xl font-bold">{insights.totalWorkouts}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Distance</div>
              <div className="text-2xl font-bold">{insights.totalDistance}km</div>
            </Card>
          </div>

          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="mt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {typeStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="workout"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Workouts"
                    />
                    <Line
                      type="monotone"
                      dataKey="distance"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Distance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Most Active Day</h4>
                <p className="text-sm text-muted-foreground">
                  Your most active day was <span className="font-medium text-foreground">{insights.mostActiveDay}</span>
                </p>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
