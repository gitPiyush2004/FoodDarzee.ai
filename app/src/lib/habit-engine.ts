export interface HabitScore {
  overall: number; // 0-100
  breakdown: {
    mealConsistency: number;
    junkFoodControl: number;
    lateNightControl: number;
    hydration: number;
    breakfastCompliance: number;
    calorieAdherence: number;
  };
  insights: HabitInsight[];
}

export interface HabitInsight {
  type: 'positive' | 'warning' | 'tip';
  message: string;
  icon: string;
}

export interface DayData {
  date: string;
  meals: { category: string; timestamp: number; calories: number; tags: string[] }[];
  hydration: number; // glasses
  calorieTarget: number;
  calorieActual: number;
}

// ===== Weekly Habit Analysis =====
export function analyzeWeeklyHabits(weekData: DayData[]): HabitScore {
  if (weekData.length === 0) {
    return {
      overall: 50,
      breakdown: { mealConsistency: 50, junkFoodControl: 80, lateNightControl: 80, hydration: 50, breakfastCompliance: 50, calorieAdherence: 50 },
      insights: [{ type: 'tip', message: 'Start logging your meals to get personalized insights!', icon: '📝' }],
    };
  }

  const daysWithData = weekData.filter(d => d.meals.length > 0);
  const totalDays = Math.max(weekData.length, 1);

  // 1. Meal Consistency (logging all 3 main meals)
  let fullMealDays = 0;
  daysWithData.forEach(d => {
    const categories = new Set(d.meals.map(m => m.category));
    if (categories.has('breakfast') && categories.has('lunch') && categories.has('dinner')) {
      fullMealDays++;
    }
  });
  const mealConsistency = Math.round((fullMealDays / totalDays) * 100);

  // 2. Junk Food Control
  let junkDays = 0;
  let totalJunkItems = 0;
  daysWithData.forEach(d => {
    const junkMeals = d.meals.filter(m => m.tags.some(t => ['junk', 'fried', 'processed'].includes(t)));
    if (junkMeals.length > 0) junkDays++;
    totalJunkItems += junkMeals.length;
  });
  const junkFoodControl = Math.max(0, Math.round(100 - (junkDays / totalDays) * 100 - totalJunkItems * 5));

  // 3. Late Night Eating Control
  let lateNightDays = 0;
  daysWithData.forEach(d => {
    const lateMeals = d.meals.filter(m => {
      const hour = new Date(m.timestamp).getHours();
      return hour >= 22 || hour < 5;
    });
    if (lateMeals.length > 0) lateNightDays++;
  });
  const lateNightControl = Math.max(0, Math.round(100 - (lateNightDays / totalDays) * 100));

  // 4. Hydration
  let hydrationGoalDays = 0;
  daysWithData.forEach(d => {
    if (d.hydration >= 8) hydrationGoalDays++;
  });
  const hydration = Math.round((hydrationGoalDays / totalDays) * 100);

  // 5. Breakfast Compliance
  let breakfastDays = 0;
  daysWithData.forEach(d => {
    if (d.meals.some(m => m.category === 'breakfast')) breakfastDays++;
  });
  const breakfastCompliance = Math.round((breakfastDays / totalDays) * 100);

  // 6. Calorie Adherence (within 10% of target)
  let adherentDays = 0;
  daysWithData.forEach(d => {
    const ratio = d.calorieActual / Math.max(d.calorieTarget, 1);
    if (ratio >= 0.85 && ratio <= 1.15) adherentDays++;
  });
  const calorieAdherence = Math.round((adherentDays / totalDays) * 100);

  const breakdown = { mealConsistency, junkFoodControl, lateNightControl, hydration, breakfastCompliance, calorieAdherence };

  // Overall score (weighted average)
  const overall = Math.round(
    mealConsistency * 0.2 +
    junkFoodControl * 0.15 +
    lateNightControl * 0.1 +
    hydration * 0.15 +
    breakfastCompliance * 0.2 +
    calorieAdherence * 0.2
  );

  // Generate insights
  const insights = generateInsights(breakdown, weekData, totalJunkItems, lateNightDays);

  return { overall, breakdown, insights };
}

function generateInsights(
  breakdown: HabitScore['breakdown'],
  weekData: DayData[],
  totalJunkItems: number,
  lateNightDays: number
): HabitInsight[] {
  const insights: HabitInsight[] = [];
  const totalDays = weekData.length;

  // Breakfast insights
  const skippedBreakfasts = totalDays - Math.round(breakdown.breakfastCompliance * totalDays / 100);
  if (skippedBreakfasts >= 3) {
    insights.push({
      type: 'warning',
      message: `You skipped breakfast ${skippedBreakfasts} times this week — this impacts your metabolism and energy levels.`,
      icon: '🌅',
    });
  } else if (breakdown.breakfastCompliance >= 90) {
    insights.push({
      type: 'positive',
      message: 'Great job maintaining breakfast consistency! Your metabolism thanks you.',
      icon: '✅',
    });
  }

  // Junk food insights
  if (totalJunkItems >= 5) {
    insights.push({
      type: 'warning',
      message: `You had junk food ${totalJunkItems} times this week. Try to limit to 2-3 times for better health.`,
      icon: '🍟',
    });
  } else if (totalJunkItems === 0) {
    insights.push({
      type: 'positive',
      message: 'Zero junk food this week! Your body is thanking you. 🎉',
      icon: '🥗',
    });
  }

  // Late night eating
  if (lateNightDays >= 3) {
    insights.push({
      type: 'warning',
      message: `Late-night eating detected on ${lateNightDays} days. This disrupts digestion and sleep quality.`,
      icon: '🌙',
    });
  }

  // Hydration
  if (breakdown.hydration < 50) {
    insights.push({
      type: 'warning',
      message: 'You\'re not hitting your water goal most days. Dehydration causes fatigue and slows metabolism.',
      icon: '💧',
    });
  } else if (breakdown.hydration >= 80) {
    insights.push({
      type: 'positive',
      message: 'Excellent hydration this week! Keep it up! 💧',
      icon: '🌊',
    });
  }

  // Calorie adherence
  if (breakdown.calorieAdherence < 40) {
    insights.push({
      type: 'tip',
      message: 'Your calorie intake varies a lot day-to-day. Try planning meals ahead for consistency.',
      icon: '📊',
    });
  } else if (breakdown.calorieAdherence >= 80) {
    insights.push({
      type: 'positive',
      message: 'Consistent calorie intake this week — your body thrives on routine! 🎯',
      icon: '✨',
    });
  }

  // Meal consistency
  if (breakdown.mealConsistency < 40) {
    insights.push({
      type: 'tip',
      message: 'Try to eat 3 proper meals daily. Skipping meals often leads to overeating later.',
      icon: '🍽️',
    });
  }

  // Overall encouragement
  if (insights.filter(i => i.type === 'positive').length === 0) {
    insights.push({
      type: 'tip',
      message: 'Small improvements each week add up to big results. Focus on one habit at a time!',
      icon: '💡',
    });
  }

  return insights.slice(0, 6);
}
