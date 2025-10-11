export const exerciseGifMap: Record<string, string> = {
  'jumping jacks': 'https://media.tenor.com/eRLD0jUIEMsAAAAM/jumping-jacks-exercise.gif',
  'push-ups': 'https://media.tenor.com/4D9P0K3C1HgAAAAM/pushup-push-up.gif',
  'squats': 'https://media.tenor.com/wB-Ww4Z7N9AAAAAM/squat.gif',
  'plank': 'https://media.tenor.com/wJMj7y4OL5MAAAAM/plank-hold.gif',
  'burpees': 'https://media.tenor.com/YKbIIWLrJhMAAAAM/burpee.gif',
  'lunges': 'https://media.tenor.com/ALw-j8xYYrcAAAAM/lunge-exercise.gif',
  'mountain climbers': 'https://media.tenor.com/QF8o7z8EQHIAAAAM/mountain-climbers.gif',
  'high knees': 'https://media.tenor.com/Y5LqJxgXVTcAAAAM/high-knees.gif',
  'calf raises': 'https://media.tenor.com/8z5oUXJLYKsAAAAM/calf-raises.gif',
  'jump rope': 'https://media.tenor.com/bhDw-8JFVjsAAAAM/jump-rope.gif',
  'rest': 'https://media.tenor.com/HKHXZnT7VbIAAAAM/rest-relax.gif',
  'stretch': 'https://media.tenor.com/9x3PuW7jG_IAAAAM/stretching.gif',
  'sit-ups': 'https://media.tenor.com/SFZiFwmCZ6UAAAAM/sit-ups.gif',
  'bicycle crunches': 'https://media.tenor.com/VuA9MxjvXb0AAAAM/bicycle-crunch.gif',
  'side plank': 'https://media.tenor.com/sW3pPjN3LfkAAAAM/side-plank.gif',
  'tricep dips': 'https://media.tenor.com/7WlDnRMqLd4AAAAM/tricep-dips.gif',
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
