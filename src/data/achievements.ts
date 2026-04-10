export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'nutrition' | 'hydration' | 'tracking' | 'special';
  condition: string;
  points: number;
}

export const achievements: Achievement[] = [
  // Streak badges
  { id: 'streak_3', name: 'Getting Started', description: 'Log meals for 3 days in a row', icon: '🌱', category: 'streak', condition: 'streak >= 3', points: 50 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day logging streak', icon: '🔥', category: 'streak', condition: 'streak >= 7', points: 100 },
  { id: 'streak_14', name: 'Fortnight Fighter', description: '14-day logging streak', icon: '⚡', category: 'streak', condition: 'streak >= 14', points: 200 },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day logging streak!', icon: '🏆', category: 'streak', condition: 'streak >= 30', points: 500 },

  // Nutrition badges
  { id: 'balanced_day', name: 'Balanced Eater', description: 'Hit all macro targets in a single day', icon: '⚖️', category: 'nutrition', condition: 'allMacrosInRange', points: 75 },
  { id: 'protein_king', name: 'Protein Champion', description: 'Meet protein goal 5 days in a row', icon: '💪', category: 'nutrition', condition: 'proteinGoal5Days', points: 150 },
  { id: 'fiber_fan', name: 'Fiber Enthusiast', description: 'Eat 25g+ fiber in a day', icon: '🥦', category: 'nutrition', condition: 'fiberAbove25', points: 75 },
  { id: 'no_junk_week', name: 'Clean Eater', description: 'Go a full week without junk food', icon: '🥗', category: 'nutrition', condition: 'noJunk7Days', points: 200 },
  { id: 'calorie_champ', name: 'Calorie Champion', description: 'Stay within calorie goal for 7 days', icon: '🎯', category: 'nutrition', condition: 'calorieGoal7Days', points: 150 },

  // Hydration badges
  { id: 'hydrated', name: 'Hydration Hero', description: 'Drink 8+ glasses of water for 5 days', icon: '💧', category: 'hydration', condition: 'hydrationGoal5Days', points: 100 },
  { id: 'hydration_master', name: 'Water Master', description: 'Perfect hydration for 14 days', icon: '🌊', category: 'hydration', condition: 'hydrationGoal14Days', points: 250 },

  // Tracking badges
  { id: 'first_meal', name: 'First Step', description: 'Log your very first meal', icon: '👣', category: 'tracking', condition: 'firstMealLogged', points: 25 },
  { id: 'early_riser', name: 'Early Riser', description: 'Log breakfast before 9 AM, 5 days', icon: '🌅', category: 'tracking', condition: 'earlyBreakfast5Days', points: 100 },
  { id: 'meal_planner', name: 'Meal Planner', description: 'Log all 3 main meals in a day', icon: '📋', category: 'tracking', condition: 'allMealsLogged', points: 50 },
  { id: 'data_driven', name: 'Data Driven', description: 'Log 100 total meals', icon: '📊', category: 'tracking', condition: 'totalMeals100', points: 300 },

  // Special badges
  { id: 'night_owl_reform', name: 'Night Owl Reformed', description: 'No late-night eating for a week', icon: '🦉', category: 'special', condition: 'noLateEating7Days', points: 150 },
  { id: 'health_improver', name: 'Health Improver', description: 'Reduce health risk score by 10 points', icon: '📈', category: 'special', condition: 'riskReduced10', points: 200 },
  { id: 'week_champion', name: 'Week Champion', description: 'Perfect habit score (80+) for a week', icon: '👑', category: 'special', condition: 'habitScore80Week', points: 300 },
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(a => a.id === id);
}

export function getAchievementsByCategory(category: string): Achievement[] {
  return achievements.filter(a => a.category === category);
}

export function getTotalPoints(unlockedIds: string[]): number {
  return unlockedIds.reduce((total, id) => {
    const achievement = getAchievementById(id);
    return total + (achievement?.points || 0);
  }, 0);
}

export function getLevel(points: number): { level: number; title: string; nextLevelPoints: number; progress: number } {
  const levels = [
    { level: 1, title: 'Beginner', threshold: 0 },
    { level: 2, title: 'Health Enthusiast', threshold: 100 },
    { level: 3, title: 'Nutrition Learner', threshold: 300 },
    { level: 4, title: 'Wellness Warrior', threshold: 600 },
    { level: 5, title: 'Health Champion', threshold: 1000 },
    { level: 6, title: 'Nutrition Master', threshold: 1500 },
    { level: 7, title: 'Wellness Legend', threshold: 2500 },
  ];

  let current = levels[0];
  let next = levels[1];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].threshold) {
      current = levels[i];
      next = levels[i + 1] || { ...levels[i], threshold: levels[i].threshold + 1000 };
      break;
    }
  }

  const progress = ((points - current.threshold) / (next.threshold - current.threshold)) * 100;

  return {
    level: current.level,
    title: current.title,
    nextLevelPoints: next.threshold,
    progress: Math.min(progress, 100),
  };
}
