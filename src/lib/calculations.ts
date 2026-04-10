// ===== Types =====
export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'weight_gain' | 'maintain' | 'fitness' | 'medical';
  dietaryPref: 'veg' | 'non-veg' | 'vegan';
  sleepHours: number;
  conditions: string[];
}

export interface MacroTargets {
  calories: number;
  protein: number; // grams
  carbs: number;
  fats: number;
  fiber: number;
  water: number; // glasses
}

// ===== BMI Calculation =====
export function calculateBMI(weight: number, height: number): number {
  // height in cm, weight in kg
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function getBMICategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { category: 'Normal', color: '#10b981' };
  if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
  return { category: 'Obese', color: '#ef4444' };
}

// ===== BMR Calculation (Mifflin-St Jeor) =====
export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

// ===== TDEE (Total Daily Energy Expenditure) =====
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

// ===== Calorie Target based on Goal =====
export function calculateCalorieTarget(tdee: number, goal: string): number {
  switch (goal) {
    case 'weight_loss': return Math.round(tdee - 500); // ~0.5kg/week loss
    case 'weight_gain': return Math.round(tdee + 400); // lean gain
    case 'fitness': return Math.round(tdee + 200); // slight surplus for muscle
    case 'medical': return Math.round(tdee - 200); // gentle deficit
    case 'maintain':
    default: return tdee;
  }
}

// ===== Macro Targets =====
export function calculateMacroTargets(profile: UserProfile): MacroTargets {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calories = calculateCalorieTarget(tdee, profile.goal);

  let proteinRatio = 0.25; // 25% of calories from protein
  let carbRatio = 0.50; // 50% from carbs
  let fatRatio = 0.25; // 25% from fats

  // Adjust based on goal
  switch (profile.goal) {
    case 'weight_loss':
      proteinRatio = 0.30;
      carbRatio = 0.40;
      fatRatio = 0.30;
      break;
    case 'weight_gain':
      proteinRatio = 0.25;
      carbRatio = 0.50;
      fatRatio = 0.25;
      break;
    case 'fitness':
      proteinRatio = 0.35;
      carbRatio = 0.40;
      fatRatio = 0.25;
      break;
    case 'medical':
      proteinRatio = 0.25;
      carbRatio = 0.45;
      fatRatio = 0.30;
      break;
  }

  // Protein: 4 cal/g, Carbs: 4 cal/g, Fats: 9 cal/g
  const protein = Math.round((calories * proteinRatio) / 4);
  const carbs = Math.round((calories * carbRatio) / 4);
  const fats = Math.round((calories * fatRatio) / 9);
  const fiber = profile.gender === 'male' ? 38 : 25;
  const water = Math.max(8, Math.round(profile.weight * 0.033 * 4)); // glasses (~250ml each)

  return { calories, protein, carbs, fats, fiber, water };
}

// ===== Nutrient Totals =====
export interface NutrientTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
}

export function calculateNutrientTotals(meals: { calories: number; protein: number; carbs: number; fats: number; fiber: number; sugar: number }[]): NutrientTotals {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats,
      fiber: totals.fiber + meal.fiber,
      sugar: totals.sugar + meal.sugar,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0 }
  );
}

// ===== Percentage helpers =====
export function getPercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
}

export function getCalorieStatus(current: number, target: number): { status: string; color: string } {
  const pct = (current / target) * 100;
  if (pct < 50) return { status: 'Under target', color: '#3b82f6' };
  if (pct < 85) return { status: 'On track', color: '#10b981' };
  if (pct <= 110) return { status: 'Near target', color: '#f59e0b' };
  return { status: 'Over target', color: '#ef4444' };
}

// ===== Date helpers =====
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDayOfWeek(date: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(date).getDay()];
}

export function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}
