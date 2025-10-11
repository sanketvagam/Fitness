# Personalized Exercises - Quick Log Feature

## Overview

The Quick Log widget now includes a **Personalized Exercise** section that allows users to log custom exercise durations with one click.

## Current Implementation

### Activity Types Available

1. **Running**
   - Quick values: 2 km, 5 km, 10 km
   - Icon: Running figure
   - Color: Blue to Cyan gradient
   - Maps to: `run-distance` goal type

2. **Swimming**
   - Quick values: 10 laps, 20 laps, 30 laps
   - Icon: Wave
   - Color: Teal to Emerald gradient
   - Maps to: `gym-frequency` goal type

3. **Steps**
   - Quick values: 5,000, 10,000, 15,000 steps
   - Icon: Footprints
   - Color: Orange to Yellow gradient
   - Maps to: `daily-steps` goal type

4. **Weight**
   - Quick values: 0.5 kg, 1 kg, 2 kg (for tracking weight changes)
   - Icon: Scale
   - Color: Red to Pink gradient
   - Maps to: `weight-loss` goal type

5. **Personalized Exercise** (NEW!)
   - Quick durations: 5 min, 10 min, 15 min, 20 min
   - Icon: Activity
   - Color: Purple to Indigo gradient
   - Maps to: `gym-frequency` goal type
   - Stores duration in activity notes

## How to Add More Personalized Exercises

### Option 1: Add More Time Durations

Edit `src/components/QuickActivityWidget.tsx`:

```typescript
const exerciseTypes = [
  { label: '5 min', value: 5, unit: 'minutes' },
  { label: '10 min', value: 10, unit: 'minutes' },
  { label: '15 min', value: 15, unit: 'minutes' },
  { label: '20 min', value: 20, unit: 'minutes' },
  // Add more durations:
  { label: '30 min', value: 30, unit: 'minutes' },
  { label: '45 min', value: 45, unit: 'minutes' },
  { label: '60 min', value: 60, unit: 'minutes' },
];
```

### Option 2: Add Specific Exercise Types

To add specific named exercises (like yoga, pilates, cycling, etc.):

1. **Create a new activity type** in the `activityTypes` array:

```typescript
{
  type: 'yoga' as const,
  icon: Sparkles, // or any lucide-react icon
  label: 'Yoga',
  unit: 'minutes',
  color: 'from-pink-500 to-purple-500',
  quickValues: [15, 30, 45],
},
```

2. **Update the TypeScript interface**:

```typescript
interface QuickActivityWidgetProps {
  onLogActivity: (activity: {
    type: 'running' | 'swimming' | 'steps' | 'weight' | 'exercise' | 'yoga' | 'cycling' | 'pilates'; // Add new types here
    value: number;
    unit?: string;
  }) => void;
}
```

3. **Update the goal matching logic** in `src/pages/Index.tsx`:

```typescript
const matchingGoal = goals.find(
  (g) =>
    (activity.type === 'exercise' && g.type === 'gym-frequency') ||
    (activity.type === 'yoga' && g.type === 'gym-frequency') ||
    (activity.type === 'cycling' && g.type === 'gym-frequency') ||
    // ... other mappings
);
```

## Example: Adding Yoga, Pilates, and Cycling

### Step 1: Update QuickActivityWidget.tsx

```typescript
const activityTypes = [
  {
    type: 'running' as const,
    icon: Activity,
    label: 'Running',
    unit: 'km',
    color: 'from-blue-500 to-cyan-500',
    quickValues: [2, 5, 10],
  },
  {
    type: 'swimming' as const,
    icon: Waves,
    label: 'Swimming',
    unit: 'laps',
    color: 'from-teal-500 to-emerald-500',
    quickValues: [10, 20, 30],
  },
  {
    type: 'yoga' as const,
    icon: Heart, // or use another icon
    label: 'Yoga',
    unit: 'minutes',
    color: 'from-pink-500 to-rose-500',
    quickValues: [15, 30, 45],
  },
  {
    type: 'pilates' as const,
    icon: Dumbbell,
    label: 'Pilates',
    unit: 'minutes',
    color: 'from-violet-500 to-purple-500',
    quickValues: [20, 30, 45],
  },
  {
    type: 'cycling' as const,
    icon: Bike, // from lucide-react
    label: 'Cycling',
    unit: 'km',
    color: 'from-green-500 to-emerald-500',
    quickValues: [5, 10, 20],
  },
  // Keep existing steps and weight...
];
```

### Step 2: Update the interface

```typescript
interface QuickActivityWidgetProps {
  onLogActivity: (activity: {
    type: 'running' | 'swimming' | 'steps' | 'weight' | 'exercise' | 'yoga' | 'pilates' | 'cycling';
    value: number;
    unit?: string;
  }) => void;
}
```

### Step 3: Update Index.tsx goal matching

```typescript
const matchingGoal = goals.find(
  (g) =>
    (activity.type === 'exercise' && g.type === 'gym-frequency') ||
    (activity.type === 'running' && g.type === 'run-distance') ||
    (activity.type === 'swimming' && g.type === 'gym-frequency') ||
    (activity.type === 'yoga' && g.type === 'gym-frequency') ||
    (activity.type === 'pilates' && g.type === 'gym-frequency') ||
    (activity.type === 'cycling' && g.type === 'run-distance') ||
    (activity.type === 'steps' && g.type === 'daily-steps') ||
    (activity.type === 'weight' && g.type === 'weight-loss')
);
```

## Layout Considerations

### Current Layout
- **Simple Mode**: Shows all activity types in a scrollable list
- **Custom Mode**: Shows activity type buttons in a 2-column grid

### Recommended Layouts

**For 4-6 activity types**: Current 2-column grid works well

**For 7-9 activity types**: Consider 3-column grid:
```typescript
<div className="grid grid-cols-3 gap-2">
```

**For 10+ activity types**: Consider categorizing or tabs:
```typescript
// Category tabs
<Tabs defaultValue="cardio">
  <TabsList>
    <TabsTrigger value="cardio">Cardio</TabsTrigger>
    <TabsTrigger value="strength">Strength</TabsTrigger>
    <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
  </TabsList>

  <TabsContent value="cardio">
    {/* Running, Swimming, Cycling */}
  </TabsContent>

  <TabsContent value="strength">
    {/* Weight training, Pilates */}
  </TabsContent>

  <TabsContent value="flexibility">
    {/* Yoga, Stretching */}
  </TabsContent>
</Tabs>
```

## Available Lucide Icons for Exercises

Common exercise icons from `lucide-react`:

- `Activity` - Generic exercise
- `Waves` - Swimming
- `Footprints` - Steps/Walking
- `Bike` - Cycling
- `Dumbbell` - Weight training
- `Heart` - Cardio/Yoga
- `Zap` - High intensity
- `Wind` - Running/Speed
- `Target` - Goal-oriented
- `TrendingUp` - Progress
- `Calendar` - Scheduled workout
- `Timer` - Timed exercise

## Data Storage

Activities are stored with:
- **Type**: The activity type (running, swimming, yoga, etc.)
- **Value**: The numeric value (distance, laps, minutes)
- **Notes**: Optional additional info (e.g., "15 minutes")
- **Date**: ISO date string
- **Goal ID**: Links to the matching goal

Example database entry:
```json
{
  "type": "exercise",
  "value": 15,
  "notes": "15 minutes",
  "date": "2025-10-11",
  "goal_id": "abc-123"
}
```

## Future Enhancements

1. **Custom Exercise Names**: Allow users to create their own exercise types
2. **Sets and Reps**: Track strength training with sets/reps
3. **Exercise Templates**: Pre-defined workout routines
4. **Rest Timer**: Built-in rest timer between sets
5. **Exercise History**: View history of specific exercises
6. **Personal Records**: Track PRs for each exercise
7. **Exercise Notes**: Add custom notes per exercise
8. **Exercise Library**: Browse and select from exercise database

## Tips for Implementation

1. **Keep it simple**: Don't add too many options at once
2. **User feedback**: Add success messages for each logged activity
3. **Visual consistency**: Use consistent color gradients and icons
4. **Goal matching**: Ensure each activity maps to at least one goal type
5. **Mobile friendly**: Test layout on mobile devices (grid should be responsive)
6. **Loading states**: Show loading indicators for async operations

## Questions?

When adding new exercises, consider:
- What unit makes sense? (minutes, km, laps, reps)
- Which goal type does it match?
- What quick values are most common?
- Which icon best represents it?
- What color scheme fits the activity?
