import { WorkoutPlan } from "@/types/fitness";

export const workoutPlans: WorkoutPlan[] = [
  {
    id: "beginner-full-body",
    name: "Beginner Full Body",
    description: "Perfect for beginners starting their fitness journey",
    difficulty: "beginner",
    duration: "30-40 minutes",
    exercises: [
      {
        name: "Bodyweight Squats",
        sets: 3,
        reps: "12-15",
        rest: "60s",
        description: "Stand with feet shoulder-width apart, lower your body by bending knees"
      },
      {
        name: "Push-ups (Modified if needed)",
        sets: 3,
        reps: "8-12",
        rest: "60s",
        description: "Start in plank position, lower chest to ground, push back up"
      },
      {
        name: "Walking Lunges",
        sets: 3,
        reps: "10 each leg",
        rest: "60s",
        description: "Step forward, lower back knee toward ground, alternate legs"
      },
      {
        name: "Plank Hold",
        sets: 3,
        reps: "20-30s",
        rest: "60s",
        description: "Hold forearm plank position, keep body straight"
      },
      {
        name: "Standing Calf Raises",
        sets: 3,
        reps: "15-20",
        rest: "45s",
        description: "Stand on toes, raise heels up and down"
      }
    ]
  },
  {
    id: "weight-loss-cardio",
    name: "Weight Loss Cardio",
    description: "High-intensity cardio focused on burning calories",
    difficulty: "intermediate",
    duration: "30-45 minutes",
    exercises: [
      {
        name: "Jump Rope",
        sets: 4,
        reps: "1 minute",
        rest: "30s",
        description: "Skip rope continuously, maintain steady rhythm"
      },
      {
        name: "Burpees",
        sets: 4,
        reps: "10-15",
        rest: "45s",
        description: "Squat, jump back to plank, do push-up, jump forward, leap up"
      },
      {
        name: "Mountain Climbers",
        sets: 4,
        reps: "30s",
        rest: "30s",
        description: "In plank position, alternately bring knees to chest quickly"
      },
      {
        name: "High Knees",
        sets: 4,
        reps: "45s",
        rest: "30s",
        description: "Run in place, bring knees up to hip level"
      },
      {
        name: "Jumping Jacks",
        sets: 4,
        reps: "30s",
        rest: "30s",
        description: "Jump while spreading legs and raising arms overhead"
      }
    ]
  },
  {
    id: "muscle-building",
    name: "Muscle Building",
    description: "Strength training to build lean muscle mass",
    difficulty: "intermediate",
    duration: "45-60 minutes",
    exercises: [
      {
        name: "Dumbbell Bench Press",
        sets: 4,
        reps: "8-12",
        rest: "90s",
        description: "Lie on bench, press dumbbells up from chest"
      },
      {
        name: "Barbell Squats",
        sets: 4,
        reps: "8-12",
        rest: "2min",
        description: "Bar on shoulders, squat down keeping back straight"
      },
      {
        name: "Bent Over Rows",
        sets: 4,
        reps: "10-12",
        rest: "90s",
        description: "Bend forward, pull weight to lower chest"
      },
      {
        name: "Overhead Press",
        sets: 4,
        reps: "8-10",
        rest: "90s",
        description: "Press weights from shoulders to overhead"
      },
      {
        name: "Deadlifts",
        sets: 4,
        reps: "6-8",
        rest: "2min",
        description: "Lift barbell from ground to standing position"
      }
    ]
  },
  {
    id: "advanced-hiit",
    name: "Advanced HIIT",
    description: "High-intensity interval training for maximum results",
    difficulty: "advanced",
    duration: "30-40 minutes",
    exercises: [
      {
        name: "Box Jumps",
        sets: 5,
        reps: "12-15",
        rest: "60s",
        description: "Jump onto elevated platform, step down"
      },
      {
        name: "Turkish Get-ups",
        sets: 4,
        reps: "5 each side",
        rest: "90s",
        description: "From lying to standing while holding weight overhead"
      },
      {
        name: "Kettlebell Swings",
        sets: 5,
        reps: "20",
        rest: "60s",
        description: "Swing kettlebell between legs and up to chest level"
      },
      {
        name: "Battle Ropes",
        sets: 5,
        reps: "30s",
        rest: "45s",
        description: "Create waves with heavy ropes alternating arms"
      },
      {
        name: "Pistol Squats",
        sets: 4,
        reps: "8 each leg",
        rest: "90s",
        description: "Single-leg squat with other leg extended forward"
      }
    ]
  },
  {
    id: "yoga-flexibility",
    name: "Yoga & Flexibility",
    description: "Improve flexibility and reduce stress",
    difficulty: "beginner",
    duration: "30-45 minutes",
    exercises: [
      {
        name: "Sun Salutation",
        sets: 3,
        reps: "5 rounds",
        rest: "30s",
        description: "Flow through 12 yoga poses in sequence"
      },
      {
        name: "Downward Dog",
        sets: 3,
        reps: "60s hold",
        rest: "30s",
        description: "Inverted V position, hands and feet on ground"
      },
      {
        name: "Warrior II",
        sets: 3,
        reps: "45s each side",
        rest: "30s",
        description: "Lunge position with arms extended"
      },
      {
        name: "Child's Pose",
        sets: 3,
        reps: "60s hold",
        rest: "0s",
        description: "Kneel and reach arms forward, forehead to ground"
      },
      {
        name: "Seated Forward Bend",
        sets: 3,
        reps: "60s hold",
        rest: "30s",
        description: "Sit with legs extended, reach for toes"
      }
    ]
  }
];
