import { MicroPlan, AdherenceStats, PainTracking, WorkoutSuggestion } from '@/types/workout';

interface SuggestionContext {
  plans: MicroPlan[];
  stats: AdherenceStats | null;
  recentPain: PainTracking[];
  selectedDuration?: number;
}

export function generateSuggestions(context: SuggestionContext): WorkoutSuggestion[] {
  const { plans, stats, recentPain, selectedDuration } = context;

  const now = new Date();
  const hour = now.getHours();
  const isAM = hour < 12;
  const timePreference = isAM ? 'AM' : 'PM';

  let filteredPlans = plans;

  if (selectedDuration) {
    filteredPlans = filteredPlans.filter(p => p.duration === selectedDuration);
  }

  const missStreak = stats?.miss_streak || 0;
  const completeStreak = stats?.complete_streak || 0;

  const painAreas = getPainfulAreas(recentPain);

  const suggestions: WorkoutSuggestion[] = [];

  if (missStreak >= 2) {
    const winPlan = filteredPlans.find(
      p => p.duration === 5 && (p.time_preference === timePreference || p.time_preference === 'anytime')
    ) || filteredPlans.find(p => p.duration === 5);

    if (winPlan) {
      suggestions.push({
        planId: winPlan.id,
        name: winPlan.name,
        duration: winPlan.duration,
        reason: `Quick 5-min win to break the ${missStreak}-day miss streak!`,
        cues: winPlan.cues,
        category: winPlan.category,
      });
    }
  }

  if (painAreas.length > 0) {
    const mobilityPlan = filteredPlans.find(
      p => p.category === 'mobility' &&
      (p.time_preference === timePreference || p.time_preference === 'anytime') &&
      p.name.toLowerCase().includes(painAreas[0])
    ) || filteredPlans.find(
      p => p.category === 'mobility' &&
      (p.time_preference === timePreference || p.time_preference === 'anytime')
    );

    if (mobilityPlan && !suggestions.some(s => s.planId === mobilityPlan.id)) {
      suggestions.push({
        planId: mobilityPlan.id,
        name: mobilityPlan.name,
        duration: mobilityPlan.duration,
        reason: `Mobility work to address ${painAreas[0]} discomfort`,
        cues: mobilityPlan.cues,
        category: mobilityPlan.category,
      });
    }
  }

  if (completeStreak >= 3 && suggestions.length < 2) {
    const targetDuration = selectedDuration
      ? Math.min(selectedDuration, 20)
      : Math.min((stats?.last_activity_date ? 10 : 5) + 5, 20);

    const progressionPlan = filteredPlans.find(
      p => p.duration === targetDuration &&
      (p.time_preference === timePreference || p.time_preference === 'anytime') &&
      !suggestions.some(s => s.planId === p.id)
    );

    if (progressionPlan) {
      suggestions.push({
        planId: progressionPlan.id,
        name: progressionPlan.name,
        duration: progressionPlan.duration,
        reason: `${completeStreak}-day streak! Ready for ${targetDuration}min challenge`,
        cues: progressionPlan.cues,
        category: progressionPlan.category,
      });
    }
  }

  if (suggestions.length < 2) {
    const preferredPlans = filteredPlans.filter(
      p => (p.time_preference === timePreference || p.time_preference === 'anytime') &&
      !suggestions.some(s => s.planId === p.id)
    );

    const timeBasedPlans = preferredPlans.length > 0 ? preferredPlans : filteredPlans.filter(
      p => !suggestions.some(s => s.planId === p.id)
    );

    const categoryPreference = isAM ? ['cardio', 'mobility'] : ['strength', 'mobility'];

    for (const category of categoryPreference) {
      if (suggestions.length >= 2) break;

      const categoryPlan = timeBasedPlans.find(
        p => p.category === category && !suggestions.some(s => s.planId === p.id)
      );

      if (categoryPlan) {
        suggestions.push({
          planId: categoryPlan.id,
          name: categoryPlan.name,
          duration: categoryPlan.duration,
          reason: `${isAM ? 'Morning' : 'Evening'} ${category} routine`,
          cues: categoryPlan.cues,
          category: categoryPlan.category,
        });
      }
    }
  }

  while (suggestions.length < 2 && filteredPlans.length > suggestions.length) {
    const remaining = filteredPlans.filter(p => !suggestions.some(s => s.planId === p.id));
    if (remaining.length === 0) break;

    const fallbackPlan = remaining[0];
    suggestions.push({
      planId: fallbackPlan.id,
      name: fallbackPlan.name,
      duration: fallbackPlan.duration,
      reason: 'Great option for today',
      cues: fallbackPlan.cues,
      category: fallbackPlan.category,
    });
  }

  return suggestions.slice(0, 2);
}

function getPainfulAreas(recentPain: PainTracking[]): string[] {
  const painMap = new Map<string, number[]>();

  recentPain.forEach(p => {
    if (!painMap.has(p.area)) {
      painMap.set(p.area, []);
    }
    painMap.get(p.area)!.push(p.level);
  });

  const painfulAreas: string[] = [];

  painMap.forEach((levels, area) => {
    if (levels.length >= 3 && levels.some(l => l >= 3)) {
      painfulAreas.push(area);
    }
  });

  return painfulAreas;
}
