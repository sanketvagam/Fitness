import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from '@/types/fitness';
import { Dumbbell, Route, Footprints, Scale, Calendar, Clock, FileText, Activity as ActivityIcon, Waves } from '@/components/icons';
import { cn } from '@/lib/utils';
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
    gradient: 'from-purple-500 to-indigo-500',
    bgGradient: 'from-purple-500/10 to-indigo-500/10',
  },
  distance: {
    icon: Route,
    label: 'Distance',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
  },
  steps: {
    icon: Footprints,
    label: 'Steps',
    gradient: 'from-orange-500 to-yellow-500',
    bgGradient: 'from-orange-500/10 to-yellow-500/10',
  },
  weight: {
    icon: Scale,
    label: 'Weight',
    gradient: 'from-red-500 to-pink-500',
    bgGradient: 'from-red-500/10 to-pink-500/10',
  },
  running: {
    icon: Route,
    label: 'Running',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
  },
  swimming: {
    icon: Waves,
    label: 'Swimming',
    gradient: 'from-teal-500 to-emerald-500',
    bgGradient: 'from-teal-500/10 to-emerald-500/10',
  },
  exercise: {
    icon: ActivityIcon,
    label: 'Exercise',
    gradient: 'from-purple-500 to-indigo-500',
    bgGradient: 'from-purple-500/10 to-indigo-500/10',
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
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5" />
          <h3 className="font-bold">Activity History</h3>
          <Badge variant="secondary" className="ml-auto">
            {displayActivities.length} {displayActivities.length === 1 ? 'activity' : 'activities'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-6">
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
                      <div
                        className={cn(
                          'absolute -left-[37px] top-3 w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center border-2 border-background shadow-md',
                          config.gradient
                        )}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </div>

                      <Card
                        className={cn(
                          'p-4 hover:shadow-md transition-all bg-gradient-to-br',
                          config.bgGradient
                        )}
                      >
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
                                  : activity.type === 'weight'
                                  ? 'kg'
                                  : activity.type === 'running'
                                  ? 'km'
                                  : activity.type === 'swimming'
                                  ? 'laps'
                                  : activity.type === 'exercise'
                                  ? 'min'
                                  : ''}
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
    </Card>
  );
}
