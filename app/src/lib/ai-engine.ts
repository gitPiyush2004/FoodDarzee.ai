import { FoodItem, foodDatabase, getHighProteinFoods, getLowCalorieFoods, getFoodsByCategory } from '@/data/foods';
import { UserProfile, NutrientTotals, MacroTargets } from '@/lib/calculations';

export interface MealRecommendation {
  food: FoodItem;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// ===== Get Current Meal Type Based on Time =====
export function getCurrentMealType(): 'breakfast' | 'lunch' | 'snack' | 'dinner' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'snack';
  return 'dinner';
}

// ===== AI Recommendation Engine =====
export function getSmartRecommendations(
  profile: UserProfile,
  todayTotals: NutrientTotals,
  targets: MacroTargets,
  todayMealCategories: string[],
  recentFoodIds: string[]
): MealRecommendation[] {
  const recommendations: MealRecommendation[] = [];
  const mealType = getCurrentMealType();
  const dietType = profile.dietaryPref;

  // Filter foods by diet preference and current meal type
  const availableFoods = getFoodsByCategory(mealType, dietType)
    .filter(f => !recentFoodIds.includes(f.id)); // Avoid recently eaten foods

  const remainingCalories = targets.calories - todayTotals.calories;
  const remainingProtein = targets.protein - todayTotals.protein;
  const remainingCarbs = targets.carbs - todayTotals.carbs;
  const remainingFats = targets.fats - todayTotals.fats;

  // Rule 1: If user skipped a meal, suggest quick options
  if (mealType === 'lunch' && !todayMealCategories.includes('breakfast')) {
    const quickBreakfastFoods = foodDatabase.filter(
      f => f.category === 'breakfast' && f.tags.includes('quick') &&
      (dietType === 'non-veg' || f.dietType !== 'non-veg') &&
      (dietType !== 'vegan' || f.dietType === 'vegan')
    );
    quickBreakfastFoods.slice(0, 2).forEach(food => {
      recommendations.push({
        food,
        reason: '⚠️ You skipped breakfast! Here\'s a quick option to boost your energy.',
        priority: 'high',
      });
    });
  }

  // Rule 2: If protein is low, suggest high-protein meals
  if (remainingProtein > targets.protein * 0.4) {
    const proteinFoods = getHighProteinFoods(dietType)
      .filter(f => f.category === mealType || f.category === 'snack')
      .filter(f => !recentFoodIds.includes(f.id))
      .sort((a, b) => b.protein - a.protein)
      .slice(0, 3);

    proteinFoods.forEach(food => {
      recommendations.push({
        food,
        reason: `💪 Your protein intake is low today (${todayTotals.protein}g/${targets.protein}g). This will help!`,
        priority: 'high',
      });
    });
  }

  // Rule 3: If sugar intake is high, recommend low-sugar options
  if (todayTotals.sugar > 40) {
    const lowSugarFoods = availableFoods
      .filter(f => f.sugar <= 5 && !f.tags.includes('junk'))
      .slice(0, 2);

    lowSugarFoods.forEach(food => {
      recommendations.push({
        food,
        reason: `🔻 Your sugar intake is high today (${todayTotals.sugar}g). Here\'s a low-sugar option.`,
        priority: 'high',
      });
    });
  }

  // Rule 4: If remaining calories are low, suggest light options
  if (remainingCalories < 300 && remainingCalories > 0) {
    const lightFoods = getLowCalorieFoods(dietType)
      .filter(f => f.category === mealType || f.category === 'snack')
      .slice(0, 2);

    lightFoods.forEach(food => {
      recommendations.push({
        food,
        reason: `📊 Only ${remainingCalories} calories left for today. Here\'s a light option.`,
        priority: 'medium',
      });
    });
  }

  // Rule 5: If over calorie target, suggest very light or skip
  if (remainingCalories <= 0) {
    const lightestFoods = availableFoods
      .filter(f => f.calories < 150)
      .sort((a, b) => a.calories - b.calories)
      .slice(0, 2);

    lightestFoods.forEach(food => {
      recommendations.push({
        food,
        reason: `⚡ You've hit your calorie target. If still hungry, try this very light option.`,
        priority: 'low',
      });
    });
  }

  // Rule 6: Weight loss specific - avoid high-fat, suggest fiber
  if (profile.goal === 'weight_loss') {
    const fiberFoods = availableFoods
      .filter(f => f.fiber >= 5 && f.calories < 300)
      .slice(0, 2);

    fiberFoods.forEach(food => {
      if (!recommendations.find(r => r.food.id === food.id)) {
        recommendations.push({
          food,
          reason: '🥗 High in fiber — keeps you full longer, great for your weight loss goal!',
          priority: 'medium',
        });
      }
    });
  }

  // Rule 7: Fitness goal - more protein
  if (profile.goal === 'fitness' && remainingProtein > 20) {
    const fitnessFoods = availableFoods
      .filter(f => f.protein >= 15)
      .sort((a, b) => b.protein / b.calories - a.protein / a.calories)
      .slice(0, 2);

    fitnessFoods.forEach(food => {
      if (!recommendations.find(r => r.food.id === food.id)) {
        recommendations.push({
          food,
          reason: '🏋️ High protein-to-calorie ratio — perfect for your fitness goals!',
          priority: 'medium',
        });
      }
    });
  }

  // Rule 8: If fat intake is high, suggest low-fat meals
  if (todayTotals.fats > targets.fats * 0.8 && remainingCalories > 200) {
    const lowFatFoods = availableFoods
      .filter(f => f.fats <= 5)
      .slice(0, 2);

    lowFatFoods.forEach(food => {
      if (!recommendations.find(r => r.food.id === food.id)) {
        recommendations.push({
          food,
          reason: `🔻 Fat intake is high (${todayTotals.fats}g/${targets.fats}g). Try this low-fat option.`,
          priority: 'medium',
        });
      }
    });
  }

  // Fallback: General recommendations for the meal type
  if (recommendations.length < 3) {
    const generalFoods = availableFoods
      .filter(f => !recommendations.find(r => r.food.id === f.id))
      .filter(f => !f.tags.includes('junk'))
      .sort((a, b) => {
        // Score based on how well it fits remaining macros
        const aScore = Math.abs(a.protein - remainingProtein * 0.3) + Math.abs(a.calories - remainingCalories * 0.3);
        const bScore = Math.abs(b.protein - remainingProtein * 0.3) + Math.abs(b.calories - remainingCalories * 0.3);
        return aScore - bScore;
      })
      .slice(0, 4 - recommendations.length);

    generalFoods.forEach(food => {
      recommendations.push({
        food,
        reason: `🍽️ A balanced ${mealType} option that fits your daily plan.`,
        priority: 'low',
      });
    });
  }

  // Deduplicate by food id
  const seen = new Set<string>();
  return recommendations.filter(r => {
    if (seen.has(r.food.id)) return false;
    seen.add(r.food.id);
    return true;
  }).slice(0, 6);
}

// ===== Meal Time Analysis =====
export function analyzeMealTiming(meals: { category: string; timestamp: number }[]): string[] {
  const insights: string[] = [];
  const hasBreakfast = meals.some(m => m.category === 'breakfast');
  const lateNightMeals = meals.filter(m => {
    const hour = new Date(m.timestamp).getHours();
    return hour >= 22 || hour < 5;
  });

  if (!hasBreakfast) {
    insights.push('You haven\'t had breakfast today. Breakfast kickstarts your metabolism!');
  }

  if (lateNightMeals.length > 0) {
    insights.push('Late-night eating detected. Try finishing dinner by 8 PM for better digestion.');
  }

  return insights;
}
