import { describe, it, expect } from 'vitest';
import { generateSuggestions } from './suggestionEngine';
import { MicroPlan, AdherenceStats, PainTracking } from '@/types/workout';

const mockPlans: MicroPlan[] = [
  {
    id: '1',
    name: 'Quick Morning Wake-up',
    duration: 5,
    category: 'cardio',
    time_preference: 'AM',
    progression_level: 1,
    cues: ['Jump', 'Run'],
  },
  {
    id: '2',
    name: 'Core Foundation',
    duration: 10,
    category: 'strength',
    time_preference: 'PM',
    progression_level: 2,
    cues: ['Plank', 'Bridge'],
  },
  {
    id: '3',
    name: 'Hip Mobility',
    duration: 10,
    category: 'mobility',
    time_preference: 'anytime',
    progression_level: 2,
    cues: ['Stretch', 'Rotate'],
  },
  {
    id: '4',
    name: 'Cardio Challenge',
    duration: 20,
    category: 'cardio',
    time_preference: 'AM',
    progression_level: 4,
    cues: ['Sprint', 'Jump'],
  },
];

describe('suggestionEngine', () => {
  it('suggests 5-min win plan when miss streak >= 2', () => {
    const stats: AdherenceStats = {
      id: '1',
      user_id: 'user1',
      complete_streak: 0,
      miss_streak: 2,
      last_activity_date: null,
      total_aqm: 0,
    };

    const suggestions = generateSuggestions({
      plans: mockPlans,
      stats,
      recentPain: [],
    });

    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].duration).toBe(5);
    expect(suggestions[0].reason).toContain('miss streak');
  });

  it('suggests mobility plan when pain is tracked', () => {
    const recentPain: PainTracking[] = [
      {
        id: '1',
        user_id: 'user1',
        area: 'hip',
        level: 5,
        date: '2025-10-11',
      },
      {
        id: '2',
        user_id: 'user1',
        area: 'hip',
        level: 4,
        date: '2025-10-10',
      },
      {
        id: '3',
        user_id: 'user1',
        area: 'hip',
        level: 3,
        date: '2025-10-09',
      },
    ];

    const suggestions = generateSuggestions({
      plans: mockPlans,
      stats: null,
      recentPain,
    });

    expect(suggestions.length).toBeGreaterThan(0);
    const mobilityPlan = suggestions.find(s => s.category === 'mobility');
    expect(mobilityPlan).toBeDefined();
  });

  it('suggests progression when complete streak >= 3', () => {
    const stats: AdherenceStats = {
      id: '1',
      user_id: 'user1',
      complete_streak: 3,
      miss_streak: 0,
      last_activity_date: '2025-10-10',
      total_aqm: 50,
    };

    const suggestions = generateSuggestions({
      plans: mockPlans,
      stats,
      recentPain: [],
    });

    expect(suggestions.length).toBeGreaterThan(0);
    const progressionSuggestion = suggestions.find(s => s.reason.includes('streak'));
    expect(progressionSuggestion).toBeDefined();
  });

  it('filters by selected duration', () => {
    const suggestions = generateSuggestions({
      plans: mockPlans,
      stats: null,
      recentPain: [],
      selectedDuration: 10,
    });

    suggestions.forEach(s => {
      expect(s.duration).toBe(10);
    });
  });

  it('returns maximum 2 suggestions', () => {
    const suggestions = generateSuggestions({
      plans: mockPlans,
      stats: null,
      recentPain: [],
    });

    expect(suggestions.length).toBeLessThanOrEqual(2);
  });

  it('handles empty plans gracefully', () => {
    const suggestions = generateSuggestions({
      plans: [],
      stats: null,
      recentPain: [],
    });

    expect(suggestions).toEqual([]);
  });
});
