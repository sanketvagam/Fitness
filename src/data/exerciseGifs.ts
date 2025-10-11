export const exerciseGifMap: Record<string, string> = {
  'jumping jacks': 'https://cdn.dribbble.com/userupload/23995967/file/original-b7327e47be94975940e98b26277e5ead.gif',
  'push-ups': 'https://tenor.com/tcupsnoJBUB.gif',
  'squats': 'https://tenor.com/lF2KVwBJJJG.gif',
  'plank': 'https://tenor.com/uvls4uSjwM2.gif',
  'burpees': 'https://tenor.com/TJ3I.gif',
  'lunges': 'https://tenor.com/bp52v.gif',
  'mountain climbers': 'https://tenor.com/sZMjb9i1Qfo.gif',
  'high knees': 'https://tenor.com/bhqkR.gif',
  'calf raises': 'https://tenor.com/uCR31Dpf6E0.gif',
  'jump rope': 'https://tenor.com/jNNb7A7T7Ik.gif',
  'rest': 'https://tenor.com/fucAxxkXgQI.gif',
  'stretch': 'https://tenor.com/bniAW.gif',
  'sit-ups': 'https://tenor.com/bx7B6.gif',
  'bicycle crunches': 'https://tenor.com/72Pr.gif',
  'side plank': 'https://tenor.com/bEf6x.gif',
  'tricep dips': 'https://tenor.com/bEfsr.gif',
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
