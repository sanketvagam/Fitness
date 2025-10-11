export type GoalType = "weight-loss" | "run-distance" | "gym-frequency" | "daily-steps";

export interface UserProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  weight: number; // in kg
  height: number; // in cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active";
  fitnessGoal: "lose-weight" | "maintain" | "gain-muscle";
}

export interface BMIData {
  bmi: number;
  category: string;
  healthStatus: string;
}

export interface CalorieData {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FitnessGoal {
  id: string;
  type: GoalType;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  createdAt: string;
  category: string;
}

export interface Activity {
  id: string;
  goalId: string;
  type: "workout" | "weight" | "steps" | "distance" | "running" | "swimming" | "exercise";
  value: number;
  date: string;
  notes?: string;
}

export interface DashboardStats {
  totalGoals: number;
  completed: number;
  inProgress: number;
  currentStreak: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  description: string;
}

export interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  notes?: string;
}

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: Meal[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "fitness" | "nutrition" | "streak" | "milestone" | "social";
  requirement: number;
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  badgeId: string;
  unlockedAt: string;
  progress: number;
}

export interface UserLevel {
  level: number;
  xp: number;
  xpToNextLevel: number;
  title: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: number;
  unit: string;
  duration: number; // in days
  startDate: string;
  endDate: string;
  participants: number;
  category: "calories" | "steps" | "workouts" | "distance";
  isActive: boolean;
}

export interface UserChallenge {
  challengeId: string;
  progress: number;
  joinedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  level: number;
  badges: number;
  rank: number;
}
