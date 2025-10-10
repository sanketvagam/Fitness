import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntegrations } from '@/hooks/useIntegrations';
import { CheckCircle2, RefreshCw, Link2, Unlink, Clock, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface ConnectFitnessAppsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const fitnessApps = [
  {
    id: 'strava',
    name: 'Strava',
    description: 'Track running and cycling activities',
    icon: '🏃',
    gradient: 'from-orange-500 to-red-500',
    color: '#FC4C02',
    features: ['Running', 'Cycling', 'Distance', 'Elevation'],
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    description: 'Sync steps, heart rate, and sleep data',
    icon: '⌚',
    gradient: 'from-teal-500 to-cyan-500',
    color: '#00B0B9',
    features: ['Steps', 'Heart Rate', 'Sleep', 'Calories'],
  },
  {
    id: 'garmin',
    name: 'Garmin',
    description: 'Import workouts and health metrics',
    icon: '📍',
    gradient: 'from-blue-600 to-blue-500',
    color: '#007CC3',
    features: ['GPS', 'Workouts', 'Heart Rate', 'VO2 Max'],
  },
  {
    id: 'apple_health',
    name: 'Apple Health',
    description: 'Sync all your Apple Health data',
    icon: '🍎',
    gradient: 'from-pink-500 to-red-500',
    color: '#FF2D55',
    features: ['Steps', 'Workouts', 'Heart Rate', 'Nutrition'],
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    description: 'Connect your Google Fit activities',
    icon: '💪',
    gradient: 'from-green-500 to-emerald-500',
    color: '#4285F4',
    features: ['Activity', 'Steps', 'Weight', 'Nutrition'],
  },
  {
    id: 'myfitnesspal',
    name: 'MyFitnessPal',
    description: 'Import nutrition and calorie data',
    icon: '🍽️',
    gradient: 'from-blue-500 to-indigo-500',
    color: '#0071E3',
    features: ['Calories', 'Nutrition', 'Meals', 'Weight'],
  },
];

export function ConnectFitnessApps({ open, onOpenChange }: ConnectFitnessAppsProps) {
  const { integrations, syncHistory, loading, syncing, connectIntegration, disconnectIntegration, syncIntegration, isConnected, getIntegration, refetch } = useIntegrations();
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stravaConnected = urlParams.get('strava_connected');

    if (stravaConnected === 'true') {
      toast.success('Strava connected successfully! You can now sync your activities.');
      refetch();

      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [refetch]);

  const handleConnect = async (appId: string) => {
    setConnectingApp(appId);
    await connectIntegration(appId);
    if (appId !== 'strava') {
      setConnectingApp(null);
    }
  };

  const handleDisconnect = async (appId: string) => {
    const integration = getIntegration(appId);
    if (integration) {
      await disconnectIntegration(integration.id);
    }
  };

  const handleSync = async (appId: string) => {
    const integration = getIntegration(appId);
    if (integration) {
      await syncIntegration(integration.id, appId);
    }
  };

  const connectedApps = integrations.filter(i => i.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            Connect Fitness Apps
          </DialogTitle>
          <DialogDescription>
            Connect your favorite fitness apps to automatically sync your activities
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="apps" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apps">Available Apps</TabsTrigger>
            <TabsTrigger value="connected">
              Connected
              {connectedApps.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {connectedApps.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">Sync History</TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="mt-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fitnessApps.map((app, index) => {
                  const connected = isConnected(app.id);
                  const integration = getIntegration(app.id);

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={cn(
                        'p-4 transition-all hover:shadow-lg',
                        connected && 'border-green-500 border-2'
                      )}>
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg flex-shrink-0',
                            app.gradient
                          )}>
                            {app.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{app.name}</h3>
                              {connected && (
                                <Badge className="bg-green-500 hover:bg-green-600">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Connected
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {app.description}
                            </p>

                            <div className="flex flex-wrap gap-1 mb-3">
                              {app.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>

                            {integration?.lastSync && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                <Clock className="w-3 h-3" />
                                <span>
                                  Last synced {formatDistanceToNow(new Date(integration.lastSync), { addSuffix: true })}
                                </span>
                              </div>
                            )}

                            <div className="flex gap-2">
                              {!connected ? (
                                <Button
                                  onClick={() => handleConnect(app.id)}
                                  disabled={connectingApp === app.id || loading}
                                  className={cn('w-full bg-gradient-to-r', app.gradient)}
                                  size="sm"
                                >
                                  {connectingApp === app.id ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                      Connecting...
                                    </>
                                  ) : (
                                    <>
                                      <Link2 className="w-4 h-4 mr-2" />
                                      Connect
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleSync(app.id)}
                                    disabled={syncing}
                                    variant="default"
                                    size="sm"
                                    className="flex-1"
                                  >
                                    {syncing ? (
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <RefreshCw className="w-4 h-4 mr-2" />
                                    )}
                                    Sync Now
                                  </Button>
                                  <Button
                                    onClick={() => handleDisconnect(app.id)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                  >
                                    <Unlink className="w-4 h-4 mr-2" />
                                    Disconnect
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="connected" className="mt-6">
            <ScrollArea className="h-[500px]">
              {connectedApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Link2 className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Connected Apps</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Connect your fitness apps to start syncing activities automatically
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {connectedApps.map((integration) => {
                    const appInfo = fitnessApps.find(app => app.id === integration.provider);
                    if (!appInfo) return null;

                    return (
                      <Card key={integration.id} className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shadow-lg',
                            appInfo.gradient
                          )}>
                            {appInfo.icon}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold">{appInfo.name}</h3>
                              <Badge className="bg-green-500">Active</Badge>
                            </div>
                            {integration.lastSync ? (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Last synced {formatDistanceToNow(new Date(integration.lastSync), { addSuffix: true })}
                                </span>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">Never synced</p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSync(integration.provider)}
                              disabled={syncing}
                              size="sm"
                            >
                              <RefreshCw className={cn('w-4 h-4 mr-2', syncing && 'animate-spin')} />
                              Sync
                            </Button>
                            <Button
                              onClick={() => handleDisconnect(integration.provider)}
                              variant="outline"
                              size="sm"
                            >
                              <Unlink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ScrollArea className="h-[500px]">
              {syncHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Activity className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Sync History</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Your sync history will appear here once you start syncing data
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {syncHistory.map((sync) => {
                    const integration = integrations.find(i => i.id === sync.integrationId);
                    const appInfo = fitnessApps.find(app => app.id === integration?.provider);

                    return (
                      <Card key={sync.id} className={cn(
                        'p-4',
                        sync.status === 'success' && 'bg-green-500/5 border-green-500/20',
                        sync.status === 'failed' && 'bg-red-500/5 border-red-500/20'
                      )}>
                        <div className="flex items-start gap-4">
                          {appInfo && (
                            <div className={cn(
                              'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-lg',
                              appInfo.gradient
                            )}>
                              {appInfo.icon}
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{appInfo?.name || 'Unknown App'}</h4>
                              {sync.status === 'success' && (
                                <Badge className="bg-green-500">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Success
                                </Badge>
                              )}
                              {sync.status === 'failed' && (
                                <Badge variant="destructive">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Failed
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {sync.syncType}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>{sync.activitiesSynced} activities</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{format(new Date(sync.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                              </div>
                            </div>

                            {sync.errorMessage && (
                              <p className="text-sm text-destructive mt-2">{sync.errorMessage}</p>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
