import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseFitnessData } from "@/hooks/useSupabaseFitnessData";
import { useProfile } from "@/hooks/useProfile";
import { useActivities } from "@/hooks/useActivities";
import { useAchievements } from "@/hooks/useAchievements";
import { useChallenges } from "@/hooks/useChallenges";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useMealData } from "@/hooks/useMealData";
import { StatCard } from "@/components/StatCard";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import { AddActivityDialog } from "@/components/AddActivityDialog";
import { UserProfileDialog } from "@/components/UserProfileDialog";
import { BMICard } from "@/components/BMICard";
import { CalorieCard } from "@/components/CalorieCard";
import { WorkoutPlansDialog } from "@/components/WorkoutPlansDialog";
import { MealPlanner } from "@/components/MealPlanner";
import { BadgeCard } from "@/components/BadgeCard";
import { LevelProgress } from "@/components/LevelProgress";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Leaderboard } from "@/components/Leaderboard";
import { ShareProgressCard } from "@/components/ShareProgressCard";
import { HabitTracker } from "@/components/HabitTracker";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { UserMenu } from "@/components/UserMenu";
import { QuickActivityWidget } from "@/components/QuickActivityWidget";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ActivityAnalytics } from "@/components/ActivityAnalytics";
import { Target, TrendingUp, Award, Flame, Trophy, Users, Utensils } from "lucide-react";
import { UserProfile, BMIData, CalorieData, GoalType } from "@/types/fitness";
import { calculateBMI, calculateCalories } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { goals, addGoal, deleteGoal, addActivity, getStats, refetch: refetchGoals } = useSupabaseFitnessData();
  const { profile: userProfile, saveProfile, loading: profileLoading } = useProfile();
  const { activities, getRecentActivities, refetch: refetchActivities } = useActivities();
  const stats = getStats();
  const { allBadges, unlockedBadges, lockedBadges, userLevel, checkAndUnlock } = useAchievements();
  const { activeChallenges, joinedChallenges, userChallenges, joinChallenge, leaveChallenge } = useChallenges();
  const { leaderboard } = useLeaderboard();
  const { getDailyNutrition, meals } = useMealData();
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [bmiData, setBmiData] = useState<BMIData | null>(null);
  const [calorieData, setCalorieData] = useState<CalorieData | null>(null);
  const [integrationsDialogOpen, setIntegrationsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [todayCalories, setTodayCalories] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Check for badge unlocks based on stats
  useEffect(() => {
    if (goals.length >= 1) checkAndUnlock('first-goal', goals.length);
    if (stats.completed >= 5) checkAndUnlock('goal-master', stats.completed);
    if (stats.currentStreak >= 7) checkAndUnlock('week-streak', stats.currentStreak);
    if (stats.currentStreak >= 30) checkAndUnlock('month-streak', stats.currentStreak);
  }, [goals, stats]);

  useEffect(() => {
    if (userProfile) {
      setBmiData(calculateBMI(userProfile.weight, userProfile.height));
      setCalorieData(calculateCalories(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    const nutrition = getDailyNutrition(new Date());
    setTodayCalories(nutrition.totalCalories);
  }, [meals]);

  useEffect(() => {
    if (!profileLoading && !userProfile && user) {
      setProfileDialogOpen(true);
    }
  }, [profileLoading, userProfile, user]);

  const handleAddActivity = (goalId: string) => {
    setSelectedGoalId(goalId);
    setActivityDialogOpen(true);
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    await saveProfile(profile);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HabitBar
              </h1>
              <p className="text-sm text-muted-foreground">
                {userProfile ? `Welcome back, ${userProfile.name}! 💪` : "Raise the bar, never skip the habit"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <CreateGoalDialog onCreateGoal={addGoal} />
            <UserMenu onOpenProfile={() => setProfileDialogOpen(true)} />
          </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
              <StatCard
                title="Total Goals"
                value={stats.totalGoals}
                icon={Target}
                gradient
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={Award}
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                icon={TrendingUp}
              />
              <StatCard
                title="Current Streak"
                value={`${stats.currentStreak} days`}
                icon={Flame}
                gradient
              />
              <StatCard
                title="Calories Today"
                value={todayCalories}
                icon={Utensils}
              />
            </div>

            {/* BMI & Calorie Section */}
            {userProfile && bmiData && calorieData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Health Metrics</h2>
                  <WorkoutPlansDialog />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                  <BMICard bmiData={bmiData} />
                  <CalorieCard calorieData={calorieData} />
                </div>
              </div>
            )}

            {/* Quick Activity Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <QuickActivityWidget
                  onLogActivity={async (activity) => {
                    let matchingGoal = goals.find(
                      (g) =>
                        (activity.type === 'exercise' && g.type === 'gym-frequency') ||
                        (activity.type === 'running' && g.type === 'run-distance') ||
                        (activity.type === 'swimming' && g.type === 'gym-frequency') ||
                        (activity.type === 'steps' && g.type === 'daily-steps') ||
                        (activity.type === 'weight' && g.type === 'weight-loss')
                    );

                    if (!matchingGoal) {
                      const goalDefaults: Record<string, { type: GoalType; title: string; target: number; unit: string; category: string }> = {
                        exercise: { type: 'gym-frequency', title: 'Workout Frequency', target: 50, unit: 'sessions', category: 'fitness' },
                        running: { type: 'run-distance', title: 'Running Distance', target: 100, unit: 'km', category: 'cardio' },
                        swimming: { type: 'gym-frequency', title: 'Swimming Sessions', target: 30, unit: 'laps', category: 'cardio' },
                        steps: { type: 'daily-steps', title: 'Daily Steps', target: 300000, unit: 'steps', category: 'activity' },
                      };

                      const defaultGoal = goalDefaults[activity.type];
                      if (defaultGoal) {
                        const endDate = new Date();
                        endDate.setMonth(endDate.getMonth() + 1);
                        await addGoal({
                          ...defaultGoal,
                          current: 0,
                          deadline: endDate.toISOString().split('T')[0],
                        });
                        await refetchGoals();
                        matchingGoal = goals.find(
                          (g) =>
                            (activity.type === 'exercise' && g.type === 'gym-frequency') ||
                            (activity.type === 'running' && g.type === 'run-distance') ||
                            (activity.type === 'swimming' && g.type === 'gym-frequency') ||
                            (activity.type === 'steps' && g.type === 'daily-steps')
                        );
                      }
                    }

                    if (matchingGoal) {
                      await addActivity({
                        goalId: matchingGoal.id,
                        type: activity.type,
                        value: activity.value,
                        notes: activity.unit ? `${activity.value} ${activity.unit}` : undefined,
                      });
                      refetchActivities();
                      refetchGoals();
                    }
                  }}
                />
              </div>
              <div className="lg:col-span-2">
                <ActivityFeed activities={getRecentActivities(5)} limit={5} />
              </div>
            </div>

            {/* BMI & Calorie Section */}
            {userProfile && bmiData && calorieData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Health Metrics</h2>
                  <WorkoutPlansDialog />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                  <BMICard bmiData={bmiData} />
                  <CalorieCard calorieData={calorieData} onClick={() => setActiveTab("meals")} />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <QuickActivityWidget
                  onLogActivity={async (activity) => {
                    let matchingGoal = goals.find(
                      (g) =>
                        (activity.type === 'exercise' && g.type === 'gym-frequency') ||
                        (activity.type === 'running' && g.type === 'run-distance') ||
                        (activity.type === 'swimming' && g.type === 'gym-frequency') ||
                        (activity.type === 'steps' && g.type === 'daily-steps') ||
                        (activity.type === 'weight' && g.type === 'weight-loss')
                    );

                    if (!matchingGoal) {
                      const goalDefaults: Record<string, { type: GoalType; title: string; target: number; unit: string; category: string }> = {
                        exercise: { type: 'gym-frequency', title: 'Workout Frequency', target: 50, unit: 'sessions', category: 'fitness' },
                        running: { type: 'run-distance', title: 'Running Distance', target: 100, unit: 'km', category: 'cardio' },
                        swimming: { type: 'gym-frequency', title: 'Swimming Sessions', target: 30, unit: 'laps', category: 'cardio' },
                        steps: { type: 'daily-steps', title: 'Daily Steps', target: 300000, unit: 'steps', category: 'activity' },
                      };

                      const defaultGoal = goalDefaults[activity.type];
                      if (defaultGoal) {
                        const endDate = new Date();
                        endDate.setMonth(endDate.getMonth() + 1);
                        await addGoal({
                          ...defaultGoal,
                          current: 0,
                          deadline: endDate.toISOString().split('T')[0],
                        });
                        await refetchGoals();
                        matchingGoal = goals.find(
                          (g) =>
                            (activity.type === 'exercise' && g.type === 'gym-frequency') ||
                            (activity.type === 'running' && g.type === 'run-distance') ||
                            (activity.type === 'swimming' && g.type === 'gym-frequency') ||
                            (activity.type === 'steps' && g.type === 'daily-steps')
                        );
                      }
                    }

                    if (matchingGoal) {
                      await addActivity({
                        goalId: matchingGoal.id,
                        type: activity.type,
                        value: activity.value,
                        notes: activity.unit ? `${activity.value} ${activity.unit}` : undefined,
                      });
                      refetchActivities();
                      refetchGoals();
                    }
                  }}
                />
              </div>
              <div className="lg:col-span-2">
                <ActivityFeed activities={activities} />
              </div>
            </div>

            <ActivityAnalytics activities={activities} />
          </TabsContent>

          {/* Meals Tab */}
          <TabsContent value="meals">
            <MealPlanner calorieData={calorieData || undefined} />
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits">
            <HabitTracker />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Goals</h2>
                <span className="text-sm text-muted-foreground">
                  {goals.length} {goals.length === 1 ? 'goal' : 'goals'} active
                </span>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Target className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your fitness journey by creating your first goal!
                  </p>
                  <CreateGoalDialog onCreateGoal={addGoal} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onDelete={deleteGoal}
                      onAddActivity={handleAddActivity}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <LevelProgress userLevel={userLevel} />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Badges</h2>
                  <span className="text-sm text-muted-foreground">
                    {unlockedBadges.length} of {allBadges.length} unlocked
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Unlocked ({unlockedBadges.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {unlockedBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} isUnlocked={true} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
                      Locked ({lockedBadges.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {lockedBadges.map((badge) => (
                        <BadgeCard key={badge.id} badge={badge} isUnlocked={false} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {joinedChallenges.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Your Challenges</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {joinedChallenges.map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        userChallenge={userChallenges.find(uc => uc.challengeId === challenge.id)}
                        onJoin={joinChallenge}
                        onLeave={leaveChallenge}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Available Challenges</h2>
                  <span className="text-sm text-muted-foreground">
                    {activeChallenges.length} active
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {activeChallenges
                    .filter(c => !joinedChallenges.find(jc => jc.id === c.id))
                    .map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onJoin={joinChallenge}
                        onLeave={leaveChallenge}
                      />
                    ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Community</h2>
                  <p className="text-sm text-muted-foreground">Connect, compete, and share your journey</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Leaderboard entries={leaderboard} />
                </div>
                <div>
                  <ShareProgressCard stats={stats} userLevel={userLevel} userName={userProfile?.name} />
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <AddActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        goalId={selectedGoalId}
        onAddActivity={addActivity}
      />
      <UserProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        onSave={handleSaveProfile}
        currentProfile={userProfile || undefined}
      />
    </div>
  );
};

export default Index;
