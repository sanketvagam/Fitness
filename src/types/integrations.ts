export type IntegrationType = 
  | "apple-health" 
  | "google-fit" 
  | "fitbit" 
  | "strava" 
  | "garmin" 
  | "samsung-health"
  | "pacer"
  | "google-auth"
  | "facebook-auth"
  | "apple-auth";

export interface Integration {
  id: IntegrationType;
  name: string;
  description: string;
  icon: string;
  color: string;
  dataTypes: string[];
  requiresOAuth: boolean;
  platform?: "ios" | "android" | "web";
  category?: "fitness" | "auth";
}

export interface ConnectedIntegration {
  id: IntegrationType;
  connectedAt: string;
  lastSync?: string;
  status: "connected" | "disconnected" | "error";
}
