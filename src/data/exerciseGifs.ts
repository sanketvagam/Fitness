export const exerciseGifMap: Record<string, string> = {
  'jumping jacks': 'https://i.pinimg.com/originals/95/07/5d/95075dda87f2a29ea751c50b522e6bc4.gif',
  'push-ups': 'https://i.pinimg.com/originals/87/7c/c0/877cc0a7b7befe546ec5e1bcbbccce8f.gif',
  'squats': 'https://i.pinimg.com/originals/9d/5f/84/9d5f84dc4b74546c5069033b999370f4.gif',
  'plank': 'https://i.pinimg.com/originals/45/f4/6d/45f46d71defae0e0410dc191bc5a150e.gif',
  'burpees': 'https://i.pinimg.com/originals/23/eb/b0/23ebb0c2fb890d0ae5059f1b88f93bf4.gif',
  'lunges': 'https://i.pinimg.com/originals/db/13/43/db1343a8c98bb6e15e25e85b0011f5c4.gif',
  'mountain climbers': 'https://i.pinimg.com/originals/98/09/f6/9809f6cc749f3588e94e9987a7d9cf84.gif',
  'high knees': 'https://i.pinimg.com/originals/e3/74/90/e37490faf28e393b0eb0695e633e0969.gif',
  'calf raises': 'https://i.pinimg.com/originals/89/41/19/894119c8006cfbff6ac39c3a22969c21.gif',
  'jump rope': 'https://i.pinimg.com/originals/cc/eb/cc/ccebcc737e5c4d3e3e4b0cc0f3b64b5f.gif',
  'rest': 'https://i.pinimg.com/originals/97/6e/53/976e53b06e379b3da9a81c468c3d14e9.gif',
  'stretch': 'https://i.pinimg.com/originals/81/5c/12/815c124e5f4f4e677a5e1b96f8fc3373.gif',
  'sit-ups': 'https://i.pinimg.com/originals/22/74/e1/2274e197a88cc469cd2eaa1c64c36c2b.gif',
  'bicycle crunches': 'https://i.pinimg.com/originals/f4/b4/22/f4b422c4e3f0a2e5c9ff0e7aa8b4ca8d.gif',
  'side plank': 'https://i.pinimg.com/originals/1d/aa/e2/1daae228b8f91b8f4c90c755d52f01c5.gif',
  'tricep dips': 'https://i.pinimg.com/originals/e6/77/9c/e6779cdc86826e4c7f9edf9f8f1a02a2.gif',
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
