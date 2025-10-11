export const exerciseGifMap: Record<string, string> = {
  'jumping jacks': 'https://cdn.dribbble.com/userupload/23995967/file/original-b7327e47be94975940e98b26277e5ead.gif',
  'push-ups': 'https://media.tenor.com/L7tYMDkJGlMAAAAM/push-up.gif',
  'squats': 'https://media.tenor.com/YwGJNH9kVGAAAAAM/squat.gif',
  'plank': 'https://media.tenor.com/xB6zMVR5yYsAAAAM/plank.gif',
  'burpees': 'https://media.tenor.com/W5KvXxjGGUMAAAAM/burpee.gif',
  'lunges': 'https://media.tenor.com/6iCYvKHKfx0AAAAM/lunge.gif',
  'mountain climbers': 'https://media.tenor.com/WUoNqz8yPlwAAAAM/mountain-climbers.gif',
  'high knees': 'https://media.tenor.com/Kzu0UxNNc78AAAAM/high-knees.gif',
  'calf raises': 'https://media.tenor.com/M7LqSVSLyY4AAAAM/calf-raise.gif',
  'jump rope': 'https://media.tenor.com/xB5vG4Y8AIAAAAAS/jump-rope.gif',
  'rest': 'https://media.tenor.com/T0UQXsXx-eYAAAAM/rest.gif',
  'stretch': 'https://media.tenor.com/R5L1gLqJo5MAAAAM/stretch.gif',
  'sit-ups': 'https://media.tenor.com/XxcQT6kRKqQAAAAM/sit-ups.gif',
  'bicycle crunches': 'https://media.tenor.com/6hXJwxLRcfEAAAAM/bicycle-crunch.gif',
  'side plank': 'https://media.tenor.com/yG3yZhNF8GMAAAAM/side-plank.gif',
  'tricep dips': 'https://media.tenor.com/m1kMYnH4WdYAAAAM/tricep-dips.gif',
};

export function getExerciseGif(cue: string): string {
  const lowerCue = cue.toLowerCase();

  for (const [key, url] of Object.entries(exerciseGifMap)) {
    if (lowerCue.includes(key)) {
      return url;
    }
  }

  return 'https://media.tenor.com/Z5uXJMaLXagAAAAM/workout.gif';
}
