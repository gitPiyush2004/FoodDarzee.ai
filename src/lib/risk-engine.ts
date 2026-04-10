import { UserProfile, NutrientTotals, MacroTargets, calculateBMI } from '@/lib/calculations';

export interface HealthRisk {
  id: string;
  name: string;
  level: 'low' | 'medium' | 'high';
  score: number; // 0-100
  icon: string;
  color: string;
  description: string;
  suggestions: string[];
}

// ===== Health Risk Prediction Engine =====
export function predictHealthRisks(
  profile: UserProfile,
  weeklyAvgTotals: NutrientTotals,
  targets: MacroTargets
): HealthRisk[] {
  const risks: HealthRisk[] = [];
  const bmi = calculateBMI(profile.weight, profile.height);

  // 1. Obesity Risk
  const obesityScore = calculateObesityRisk(bmi, weeklyAvgTotals, targets, profile);
  risks.push({
    id: 'obesity',
    name: 'Obesity Risk',
    level: getLevel(obesityScore),
    score: obesityScore,
    icon: '⚖️',
    color: getRiskColor(obesityScore),
    description: getObesityDescription(obesityScore, bmi),
    suggestions: getObesitySuggestions(obesityScore, bmi, profile),
  });

  // 2. Diabetes Risk
  const diabetesScore = calculateDiabetesRisk(bmi, weeklyAvgTotals, profile);
  risks.push({
    id: 'diabetes',
    name: 'Diabetes Risk',
    level: getLevel(diabetesScore),
    score: diabetesScore,
    icon: '🩸',
    color: getRiskColor(diabetesScore),
    description: getDiabetesDescription(diabetesScore),
    suggestions: getDiabetesSuggestions(diabetesScore, weeklyAvgTotals),
  });

  // 3. Heart Disease Risk
  const heartScore = calculateHeartRisk(bmi, weeklyAvgTotals, profile);
  risks.push({
    id: 'heart',
    name: 'Heart Disease Risk',
    level: getLevel(heartScore),
    score: heartScore,
    icon: '❤️',
    color: getRiskColor(heartScore),
    description: getHeartDescription(heartScore),
    suggestions: getHeartSuggestions(heartScore, weeklyAvgTotals),
  });

  // 4. Muscle Loss Risk
  const muscleLossScore = calculateMuscleLossRisk(weeklyAvgTotals, targets, profile);
  risks.push({
    id: 'muscle_loss',
    name: 'Muscle Loss Risk',
    level: getLevel(muscleLossScore),
    score: muscleLossScore,
    icon: '💪',
    color: getRiskColor(muscleLossScore),
    description: getMuscleLossDescription(muscleLossScore),
    suggestions: getMuscleLossSuggestions(muscleLossScore, weeklyAvgTotals, targets),
  });

  // 5. Fatigue Risk
  const fatigueScore = calculateFatigueRisk(weeklyAvgTotals, targets, profile);
  risks.push({
    id: 'fatigue',
    name: 'Fatigue Risk',
    level: getLevel(fatigueScore),
    score: fatigueScore,
    icon: '😴',
    color: getRiskColor(fatigueScore),
    description: getFatigueDescription(fatigueScore),
    suggestions: getFatigueSuggestions(fatigueScore, profile),
  });

  return risks.sort((a, b) => b.score - a.score);
}

// ===== Risk Calculators =====

function calculateObesityRisk(bmi: number, totals: NutrientTotals, targets: MacroTargets, profile: UserProfile): number {
  let score = 0;
  
  // BMI contribution (0-40 points)
  if (bmi > 30) score += 40;
  else if (bmi > 27) score += 30;
  else if (bmi > 25) score += 20;
  else if (bmi > 23) score += 10;

  // Calorie surplus contribution (0-30 points)
  const calorieSurplus = totals.calories - targets.calories;
  if (calorieSurplus > 500) score += 30;
  else if (calorieSurplus > 300) score += 20;
  else if (calorieSurplus > 100) score += 10;

  // Activity level (0-20 points)
  if (profile.activityLevel === 'sedentary') score += 20;
  else if (profile.activityLevel === 'light') score += 10;

  // High fat diet (0-10 points)
  const fatPct = (totals.fats * 9) / Math.max(totals.calories, 1);
  if (fatPct > 0.35) score += 10;

  return Math.min(100, score);
}

function calculateDiabetesRisk(bmi: number, totals: NutrientTotals, profile: UserProfile): number {
  let score = 0;

  // Sugar intake (0-35 points)
  if (totals.sugar > 60) score += 35;
  else if (totals.sugar > 40) score += 25;
  else if (totals.sugar > 25) score += 15;

  // BMI (0-25 points)
  if (bmi > 30) score += 25;
  else if (bmi > 27) score += 15;
  else if (bmi > 25) score += 10;

  // Low fiber (0-15 points)
  if (totals.fiber < 15) score += 15;
  else if (totals.fiber < 20) score += 8;

  // Existing conditions (0-15 points)
  if (profile.conditions.includes('diabetes')) score += 15;
  if (profile.conditions.includes('pre-diabetes')) score += 10;

  // Activity level (0-10 points)
  if (profile.activityLevel === 'sedentary') score += 10;

  return Math.min(100, score);
}

function calculateHeartRisk(bmi: number, totals: NutrientTotals, profile: UserProfile): number {
  let score = 0;

  // High fat intake (0-30 points)
  const fatPct = (totals.fats * 9) / Math.max(totals.calories, 1);
  if (fatPct > 0.40) score += 30;
  else if (fatPct > 0.35) score += 20;
  else if (fatPct > 0.30) score += 10;

  // Low fiber (0-20 points)
  if (totals.fiber < 15) score += 20;
  else if (totals.fiber < 20) score += 10;

  // BMI (0-20 points)
  if (bmi > 30) score += 20;
  else if (bmi > 27) score += 12;

  // Existing conditions (0-15 points)
  if (profile.conditions.includes('bp') || profile.conditions.includes('hypertension')) score += 15;
  if (profile.conditions.includes('cholesterol')) score += 10;

  // Sedentary (0-15 points)
  if (profile.activityLevel === 'sedentary') score += 15;
  else if (profile.activityLevel === 'light') score += 8;

  return Math.min(100, score);
}

function calculateMuscleLossRisk(totals: NutrientTotals, targets: MacroTargets, profile: UserProfile): number {
  let score = 0;

  // Low protein (0-40 points)
  const proteinPct = totals.protein / Math.max(targets.protein, 1);
  if (proteinPct < 0.5) score += 40;
  else if (proteinPct < 0.7) score += 25;
  else if (proteinPct < 0.85) score += 12;

  // High calorie deficit (0-30 points)
  const deficit = targets.calories - totals.calories;
  if (deficit > 700) score += 30;
  else if (deficit > 500) score += 20;
  else if (deficit > 300) score += 10;

  // Activity without protein (0-20 points)
  if ((profile.activityLevel === 'active' || profile.activityLevel === 'very_active') && proteinPct < 0.7) {
    score += 20;
  }

  // Age >40 increases risk (0-10 points)
  if (profile.age > 50) score += 10;
  else if (profile.age > 40) score += 5;

  return Math.min(100, score);
}

function calculateFatigueRisk(totals: NutrientTotals, targets: MacroTargets, profile: UserProfile): number {
  let score = 0;

  // Low calorie intake (0-30 points)
  const caloriePct = totals.calories / Math.max(targets.calories, 1);
  if (caloriePct < 0.5) score += 30;
  else if (caloriePct < 0.7) score += 20;
  else if (caloriePct < 0.85) score += 10;

  // Poor sleep (0-30 points)
  if (profile.sleepHours < 5) score += 30;
  else if (profile.sleepHours < 6) score += 20;
  else if (profile.sleepHours < 7) score += 10;

  // Low carbs (energy source) (0-20 points)
  const carbPct = totals.carbs / Math.max(targets.carbs, 1);
  if (carbPct < 0.5) score += 20;
  else if (carbPct < 0.7) score += 10;

  // High sugar crash (0-20 points)
  if (totals.sugar > 50 && totals.fiber < 15) score += 20;
  else if (totals.sugar > 35) score += 10;

  return Math.min(100, score);
}

// ===== Helpers =====

function getLevel(score: number): 'low' | 'medium' | 'high' {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  return 'high';
}

function getRiskColor(score: number): string {
  if (score < 30) return '#10b981';
  if (score < 60) return '#f59e0b';
  return '#ef4444';
}

function getObesityDescription(score: number, bmi: number): string {
  if (score < 30) return `Your BMI (${bmi}) and eating habits indicate low obesity risk. Keep it up!`;
  if (score < 60) return `Your BMI (${bmi}) combined with calorie patterns show moderate risk. Small changes can help.`;
  return `Your BMI (${bmi}) and consistent calorie surplus indicate elevated obesity risk. Action recommended.`;
}

function getObesitySuggestions(score: number, bmi: number, profile: UserProfile): string[] {
  const suggestions: string[] = [];
  if (score >= 30) {
    suggestions.push('Reduce daily calorie intake by 300-500 calories');
    if (profile.activityLevel === 'sedentary') suggestions.push('Add 30 minutes of walking daily');
    if (bmi > 25) suggestions.push('Focus on high-fiber, low-calorie foods like salads and soups');
    suggestions.push('Avoid sugary beverages and processed snacks');
  }
  if (suggestions.length === 0) suggestions.push('Maintain your current healthy habits! 🎉');
  return suggestions;
}

function getDiabetesDescription(score: number): string {
  if (score < 30) return 'Your sugar intake and health indicators show low diabetes risk.';
  if (score < 60) return 'Moderate sugar intake detected. Monitor your blood sugar patterns.';
  return 'High sugar consumption combined with other factors increases diabetes risk significantly.';
}

function getDiabetesSuggestions(score: number, totals: NutrientTotals): string[] {
  const suggestions: string[] = [];
  if (score >= 30) {
    if (totals.sugar > 30) suggestions.push(`Reduce sugar intake from ${totals.sugar}g to under 25g daily`);
    suggestions.push('Choose whole grains over refined carbs');
    suggestions.push('Increase fiber intake to slow glucose absorption');
    if (totals.fiber < 20) suggestions.push('Add more vegetables, legumes, and whole grains for fiber');
  }
  if (suggestions.length === 0) suggestions.push('Your dietary patterns support healthy blood sugar levels! 🎉');
  return suggestions;
}

function getHeartDescription(score: number): string {
  if (score < 30) return 'Your diet supports good cardiovascular health.';
  if (score < 60) return 'Some dietary factors may affect heart health over time.';
  return 'Multiple risk factors for cardiovascular disease detected. Diet modification recommended.';
}

function getHeartSuggestions(score: number, totals: NutrientTotals): string[] {
  const suggestions: string[] = [];
  if (score >= 30) {
    suggestions.push('Reduce saturated fat intake — choose grilled over fried');
    if (totals.fiber < 20) suggestions.push('Increase fiber to 25-38g daily for heart health');
    suggestions.push('Add omega-3 rich foods like fish, flaxseeds, or walnuts');
    suggestions.push('Limit sodium by avoiding processed/packaged foods');
  }
  if (suggestions.length === 0) suggestions.push('Your heart-healthy diet is on track! 🎉');
  return suggestions;
}

function getMuscleLossDescription(score: number): string {
  if (score < 30) return 'Adequate protein intake is supporting your muscle health.';
  if (score < 60) return 'Protein intake may be insufficient for muscle maintenance.';
  return 'Low protein combined with calorie deficit significantly increases muscle loss risk.';
}

function getMuscleLossSuggestions(score: number, totals: NutrientTotals, targets: MacroTargets): string[] {
  const suggestions: string[] = [];
  if (score >= 30) {
    suggestions.push(`Increase protein from ${totals.protein}g to ${targets.protein}g daily`);
    suggestions.push('Add protein-rich snacks: eggs, paneer, nuts, yogurt');
    suggestions.push('Space protein intake across all meals evenly');
    if (targets.calories - totals.calories > 500) suggestions.push('Don\'t cut calories too aggressively — moderate deficit is safer');
  }
  if (suggestions.length === 0) suggestions.push('Great protein intake! Your muscles are well-supported. 💪');
  return suggestions;
}

function getFatigueDescription(score: number): string {
  if (score < 30) return 'Your energy levels should be well-supported by your diet and sleep.';
  if (score < 60) return 'Some factors may be contributing to energy dips throughout the day.';
  return 'Multiple factors suggest high fatigue risk. Consider diet and sleep adjustments.';
}

function getFatigueSuggestions(score: number, profile: UserProfile): string[] {
  const suggestions: string[] = [];
  if (score >= 30) {
    if (profile.sleepHours < 7) suggestions.push(`Aim for 7-8 hours of sleep (currently ${profile.sleepHours}h)`);
    suggestions.push('Don\'t skip meals — eat every 3-4 hours for sustained energy');
    suggestions.push('Include complex carbs (oats, brown rice) for steady energy');
    suggestions.push('Stay hydrated — dehydration causes fatigue');
  }
  if (suggestions.length === 0) suggestions.push('Your energy management looks great! ⚡');
  return suggestions;
}

// ===== Overall Health Score =====
export function calculateOverallHealthScore(risks: HealthRisk[]): number {
  if (risks.length === 0) return 85;
  const avgRisk = risks.reduce((sum, r) => sum + r.score, 0) / risks.length;
  return Math.max(0, Math.round(100 - avgRisk));
}
