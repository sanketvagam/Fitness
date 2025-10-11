import { useLocalStorage } from './useLocalStorage';
import { Badge, Achievement, UserLevel } from '@/types/fitness';

const BADGES: Badge[] = [
  {
    id: 'first-goal',
    name: 'First Steps',
    description: 'Create your first fitness goal',
    icon: '🎯',
    category: 'milestone',
    requirement: 1,
  },
  {
    id: 'goal-master',
    name: 'Goal Master',
    description: 'Complete 5 fitness goals',
    icon: '🏆',
    category: 'milestone',
    requirement: 5,
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: '🔥',
    category: 'streak',
    requirement: 7,
  },
  {
    id: 'month-streak',
    name: 'Consistency King',
    description: 'Maintain a 30-day activity streak',
    icon: '👑',
    category: 'streak',
    requirement: 30,
  },
  {
    id: 'first-5k',
    name: 'First 5K',
    description: 'Run your first 5 kilometers',
    icon: '🏃',
    category: 'fitness',
    requirement: 5,
  },
  {
    id: 'marathon-ready',
    name: 'Marathon Ready',
    description: 'Run a total of 42 kilometers',
    icon: '🎖️',
    category: 'fitness',
    requirement: 42,
  },
  {
    id: 'healthy-bmi',
    name: 'Healthy Weight',
    description: 'Achieve a BMI below 25',
    icon: '⚖️',
    category: 'milestone',
    requirement: 25,
  },
  {
    id: 'meal-tracker',
    name: 'Nutrition Pro',
    description: 'Log 50 meals',
    icon: '🍎',
    category: 'nutrition',
    requirement: 50,
  },
  {
    id: 'calorie-deficit',
    name: 'Calorie Master',
    description: 'Achieve calorie deficit for 14 days',
    icon: '💪',
    category: 'nutrition',
    requirement: 14,
  },
  {
    id: 'social-sharer',
    name: 'Inspiration',
    description: 'Share your progress 10 times',
    icon: '📱',
    category: 'social',
    requirement: 10,
  },
];

function calculateLevel(xp: number): UserLevel {
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = level * 100 - xp;
  
  const titles = [
    'Beginner',
    'Novice',
    'Intermediate',
    'Advanced',
    'Expert',
    'Master',
    'Champion',
    'Legend',
  ];
  
  const titleIndex = Math.min(Math.floor(level / 5), titles.length - 1);
  
  return {
    level,
    xp,
    xpToNextLevel,
    title: titles[titleIndex],
  };
}

export function useAchievements() {
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('habitbar-achievements', []);
  const [xp, setXp] = useLocalStorage<number>('habitbar-xp', 0);

  const unlockedBadges = BADGES.filter(badge =>
    achievements.some(a => a.badgeId === badge.id)
  ).map(badge => ({
    ...badge,
    earnedAt: achievements.find(a => a.badgeId === badge.id)?.unlockedAt,
  }));

  const lockedBadges = BADGES.filter(badge =>
    !achievements.some(a => a.badgeId === badge.id)
  );

  const checkAndUnlock = (badgeId: string, currentProgress: number) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    const hasAchievement = achievements.some(a => a.badgeId === badgeId);
    if (hasAchievement) return;

    if (currentProgress >= badge.requirement) {
      const newAchievement: Achievement = {
        id: crypto.randomUUID(),
        badgeId,
        unlockedAt: new Date().toISOString(),
        progress: currentProgress,
      };
      setAchievements([...achievements, newAchievement]);
      addXP(50); // Award XP for unlocking badge
      return true;
    }
    return false;
  };

  const addXP = (amount: number) => {
    setXp(xp + amount);
  };

  const userLevel = calculateLevel(xp);

  return {
    allBadges: BADGES,
    unlockedBadges,
    lockedBadges,
    achievements,
    checkAndUnlock,
    addXP,
    userLevel,
    xp,
  };
}
