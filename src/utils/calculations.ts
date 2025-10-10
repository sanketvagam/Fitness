import { UserProfile, BMIData, CalorieData } from "@/types/fitness";

export function calculateBMI(weight: number, height: number): BMIData {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = "";
  let healthStatus = "";
  
  if (bmi < 18.5) {
    category = "Underweight";
    healthStatus = "You may need to gain weight. Consult a healthcare provider.";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal Weight";
    healthStatus = "You're at a healthy weight! Keep it up!";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    healthStatus = "Consider a balanced diet and regular exercise.";
  } else {
    category = "Obese";
    healthStatus = "Consult a healthcare provider for a personalized plan.";
  }
  
  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    healthStatus,
  };
}

export function calculateCalories(profile: UserProfile): CalorieData {
  const { weight, height, age, gender, activityLevel, fitnessGoal } = profile;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very-active": 1.9,
  };
  
  const tdee = bmr * activityMultipliers[activityLevel];
  
  // Adjust for fitness goal
  let targetCalories: number;
  if (fitnessGoal === "lose-weight") {
    targetCalories = tdee - 500; // 500 calorie deficit
  } else if (fitnessGoal === "gain-muscle") {
    targetCalories = tdee + 300; // 300 calorie surplus
  } else {
    targetCalories = tdee;
  }
  
  // Macronutrient breakdown
  const protein = (targetCalories * 0.30) / 4; // 30% protein, 4 cal/g
  const carbs = (targetCalories * 0.40) / 4; // 40% carbs, 4 cal/g
  const fats = (targetCalories * 0.30) / 9; // 30% fats, 9 cal/g
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
  };
}
