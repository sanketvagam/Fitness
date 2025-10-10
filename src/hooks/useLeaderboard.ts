import { LeaderboardEntry } from '@/types/fitness';

// Mock leaderboard data - in a real app, this would come from a backend
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: '1',
    username: 'FitnessKing',
    avatar: '👑',
    score: 12450,
    level: 24,
    badges: 15,
    rank: 1,
  },
  {
    id: '2',
    username: 'RunnerQueen',
    avatar: '🏃‍♀️',
    score: 11230,
    level: 22,
    badges: 13,
    rank: 2,
  },
  {
    id: '3',
    username: 'GymWarrior',
    avatar: '💪',
    score: 10890,
    level: 21,
    badges: 12,
    rank: 3,
  },
  {
    id: '4',
    username: 'YogaMaster',
    avatar: '🧘',
    score: 9560,
    level: 19,
    badges: 11,
    rank: 4,
  },
  {
    id: '5',
    username: 'CardioChamp',
    avatar: '🚴',
    score: 8920,
    level: 18,
    badges: 10,
    rank: 5,
  },
  {
    id: '6',
    username: 'HealthHero',
    avatar: '🦸',
    score: 8450,
    level: 17,
    badges: 9,
    rank: 6,
  },
  {
    id: '7',
    username: 'FitLife',
    avatar: '⭐',
    score: 7890,
    level: 16,
    badges: 8,
    rank: 7,
  },
  {
    id: '8',
    username: 'SwimPro',
    avatar: '🏊',
    score: 7340,
    level: 15,
    badges: 8,
    rank: 8,
  },
  {
    id: '9',
    username: 'ActiveAce',
    avatar: '🎯',
    score: 6890,
    level: 14,
    badges: 7,
    rank: 9,
  },
  {
    id: '10',
    username: 'WellnessWizard',
    avatar: '✨',
    score: 6450,
    level: 13,
    badges: 7,
    rank: 10,
  },
];

export function useLeaderboard() {
  const getLeaderboard = (): LeaderboardEntry[] => {
    return MOCK_LEADERBOARD;
  };

  const getUserRank = (userId: string): number => {
    const entry = MOCK_LEADERBOARD.find(e => e.id === userId);
    return entry?.rank || 0;
  };

  return {
    leaderboard: getLeaderboard(),
    getUserRank,
  };
}
