import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from '@/types/fitness';
import { Dumbbell, Route, Footprints, Scale, Calendar, FileText } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

const activityConfig = {
  workout: {
    icon: Dumbbell,
    label: 'Workout',
  },
  distance: {
    icon: Route,
    label: 'Distance',
  },
  steps: {
    icon: Footprints,
    label: 'Steps',
  },
  weight: {
    icon: Scale,
    label: 'Weight',
  },
};

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  if (displayActivities.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start logging your workouts and activities to see them here
          </p>
        </div>
      </Card>
    );
  }

  const groupedActivities = displayActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Activity History</CardTitle>
          <Badge variant="secondary">
            {displayActivities.length} {displayActivities.length === 1 ? 'activity' : 'activities'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([date, dateActivities]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2 sticky top-0 bg-background py-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h4>
                  <div className="flex-1 border-t border-border" />
                </div>

                <div className="space-y-2 pl-6 border-l-2 border-border">
                  {dateActivities.map((activity, index) => {
                    const config = activityConfig[activity.type];
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                      >
                        <div className="absolute -left-[37px] top-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                          <Icon className="w-3 h-3 text-primary-foreground" />
                        </div>

                        <Card className="p-4 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {config.label}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">{activity.value}</span>
                                <span className="text-sm text-muted-foreground">
                                  {activity.type === 'workout'
                                    ? 'session'
                                    : activity.type === 'distance'
                                    ? 'km'
                                    : activity.type === 'steps'
                                    ? 'steps'
                                    : 'kg'}
                                </span>
                              </div>
                              {activity.notes && (
                                <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                                  <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                  <p className="line-clamp-2">{activity.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
