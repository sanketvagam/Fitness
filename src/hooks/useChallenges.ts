import { useLocalStorage } from './useLocalStorage';
import { Challenge, UserChallenge } from '@/types/fitness';

const CHALLENGES: Challenge[] = [
  {
    id: 'burn-10k',
    name: '10K Calorie Burn',
    description: 'Burn 10,000 calories in 7 days',
    goal: 10000,
    unit: 'calories',
    duration: 7,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 1247,
    category: 'calories',
    isActive: true,
  },
  {
    id: 'step-master',
    name: 'Step Master',
    description: 'Walk 100,000 steps in 30 days',
    goal: 100000,
    unit: 'steps',
    duration: 30,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 3421,
    category: 'steps',
    isActive: true,
  },
  {
    id: 'workout-week',
    name: 'Workout Week',
    description: 'Complete 5 workouts in 7 days',
    goal: 5,
    unit: 'workouts',
    duration: 7,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 892,
    category: 'workouts',
    isActive: true,
  },
  {
    id: 'distance-demon',
    name: 'Distance Demon',
    description: 'Run 50km in 14 days',
    goal: 50,
    unit: 'km',
    duration: 14,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    participants: 567,
    category: 'distance',
    isActive: true,
  },
];

export function useChallenges() {
  const [userChallenges, setUserChallenges] = useLocalStorage<UserChallenge[]>('habitbar-user-challenges', []);

  const joinChallenge = (challengeId: string) => {
    const alreadyJoined = userChallenges.some(uc => uc.challengeId === challengeId);
    if (alreadyJoined) return;

    const newUserChallenge: UserChallenge = {
      challengeId,
      progress: 0,
      joinedAt: new Date().toISOString(),
    };
    setUserChallenges([...userChallenges, newUserChallenge]);
  };

  const leaveChallenge = (challengeId: string) => {
    setUserChallenges(userChallenges.filter(uc => uc.challengeId !== challengeId));
  };

  const updateProgress = (challengeId: string, progress: number) => {
    setUserChallenges(
      userChallenges.map(uc =>
        uc.challengeId === challengeId ? { ...uc, progress } : uc
      )
    );
  };

  const activeChallenges = CHALLENGES.filter(c => c.isActive);
  const joinedChallenges = activeChallenges.filter(c =>
    userChallenges.some(uc => uc.challengeId === c.id)
  );

  return {
    allChallenges: CHALLENGES,
    activeChallenges,
    joinedChallenges,
    userChallenges,
    joinChallenge,
    leaveChallenge,
    updateProgress,
  };
}
