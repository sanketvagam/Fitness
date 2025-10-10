import { Integration, ConnectedIntegration } from "@/types/integrations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Link as LinkIcon } from "lucide-react";

interface IntegrationCardProps {
  integration: Integration;
  connected?: ConnectedIntegration;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

export function IntegrationCard({ 
  integration, 
  connected, 
  onConnect, 
  onDisconnect 
}: IntegrationCardProps) {
  const isConnected = connected?.status === "connected";

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center text-2xl`}>
            {integration.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{integration.name}</h3>
            {integration.platform && (
              <Badge variant="secondary" className="text-xs mt-1">
                {integration.platform === "ios" ? "iOS" : integration.platform === "android" ? "Android" : "Web"}
              </Badge>
            )}
          </div>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">Connected</span>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {integration.description}
      </p>

      <div className="mb-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">Data Types:</p>
        <div className="flex flex-wrap gap-2">
          {integration.dataTypes.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {connected?.lastSync && (
        <p className="text-xs text-muted-foreground mb-4">
          Last synced: {new Date(connected.lastSync).toLocaleString()}
        </p>
      )}

      <Button
        onClick={() => isConnected ? onDisconnect(integration.id) : onConnect(integration.id)}
        variant={isConnected ? "outline" : "default"}
        className="w-full"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </Card>
  );
}
