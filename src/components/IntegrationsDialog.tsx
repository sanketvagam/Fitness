import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationCard } from "@/components/IntegrationCard";
import { availableIntegrations } from "@/data/integrations";
import { ConnectedIntegration, IntegrationType } from "@/types/integrations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Link2, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface IntegrationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntegrationsDialog({ open, onOpenChange }: IntegrationsDialogProps) {
  const [connections, setConnections] = useLocalStorage<ConnectedIntegration[]>("fitforge-integrations", []);
  const [showInfo, setShowInfo] = useState(true);

  const handleConnect = (id: string) => {
    // Show info about requiring backend
    toast.info("Backend Required", {
      description: "Real integration requires OAuth setup with backend. This is a demo connection.",
      duration: 4000,
    });

    const newConnection: ConnectedIntegration = {
      id: id as IntegrationType,
      connectedAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
      status: "connected",
    };

    setConnections([...connections.filter(c => c.id !== id), newConnection]);
    toast.success(`Connected to ${availableIntegrations.find(i => i.id === id)?.name}! 🎉`);
  };

  const handleDisconnect = (id: string) => {
    setConnections(connections.filter(c => c.id !== id));
    toast.success(`Disconnected from ${availableIntegrations.find(i => i.id === id)?.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Link2 className="w-6 h-6" />
            Connect Fitness Trackers
          </DialogTitle>
          <DialogDescription>
            Sync your fitness data from wearables and apps
          </DialogDescription>
        </DialogHeader>

        {showInfo && (
          <Alert className="border-primary/50 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium mb-1">⚡ Full Integration Requires Backend</p>
                  <p className="text-xs text-muted-foreground">
                    Real connections need OAuth authentication with each service. This demo shows the UI.
                    To enable real syncing, you'll need:
                  </p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1 ml-4 list-disc">
                    <li>Backend server for OAuth flows</li>
                    <li>API credentials from each service (Fitbit, Strava, etc.)</li>
                    <li>Webhook endpoints for data synchronization</li>
                  </ul>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfo(false)}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="auth" className="space-y-4 mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="auth">Social Login</TabsTrigger>
            <TabsTrigger value="fitness">Fitness Trackers</TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Authentication Services</h3>
              <span className="text-sm text-muted-foreground">
                {connections.filter(c => availableIntegrations.find(i => i.id === c.id)?.category === 'auth').length} connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableIntegrations.filter(i => i.category === 'auth').map((integration) => {
                const connection = connections.find(c => c.id === integration.id);
                return (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    connected={connection}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="fitness" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Fitness & Health Apps</h3>
              <span className="text-sm text-muted-foreground">
                {connections.filter(c => availableIntegrations.find(i => i.id === c.id)?.category === 'fitness').length} connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableIntegrations.filter(i => i.category === 'fitness').map((integration) => {
                const connection = connections.find(c => c.id === integration.id);
                return (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    connected={connection}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            How Integration Works
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• <strong>OAuth 2.0:</strong> Secure authentication with each service</li>
            <li>• <strong>Data Sync:</strong> Automatic periodic sync of fitness metrics</li>
            <li>• <strong>Privacy:</strong> You control what data is shared</li>
            <li>• <strong>Real-time:</strong> Updates reflect within minutes of activity</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
