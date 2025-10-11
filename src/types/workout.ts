export interface MicroPlan {
  id: string;
  name: string;
  duration: 5 | 10 | 15 | 20;
  category: 'cardio' | 'strength' | 'mobility' | 'flexibility';
  time_preference: 'AM' | 'PM' | 'anytime';
  progression_level: 1 | 2 | 3 | 4 | 5;
  cues: string[];
  created_at?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id: string | null;
  completed_at: string;
  duration_minutes: number;
  rpe?: number;
  pain?: number;
  notes?: string;
  created_at?: string;
  micro_plans?: MicroPlan;
}

export interface PainTracking {
  id: string;
  user_id: string;
  area: string;
  level: number;
  date: string;
  created_at?: string;
}

export interface AdherenceStats {
  id: string;
  user_id: string;
  complete_streak: number;
  miss_streak: number;
  last_activity_date: string | null;
  total_aqm: number;
  updated_at?: string;
}

export interface WorkoutSuggestion {
  planId: string;
  name: string;
  duration: number;
  reason: string;
  cues: string[];
  category: string;
  gifUrl?: string;
}

export interface ExerciseGif {
  cue: string;
  gifUrl: string;
}
