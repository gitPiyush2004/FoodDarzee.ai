import { NutrientTotals, MacroTargets, UserProfile } from '@/lib/calculations';
import { getCurrentMealType } from '@/lib/ai-engine';
import { foodDatabase } from '@/data/foods';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatContext {
  profile: UserProfile | null;
  todayTotals: NutrientTotals;
  targets: MacroTargets | null;
  todayMealCount: number;
  streak: number;
  habitScore: number;
}

export function generateChatResponse(userMessage: string, context: ChatContext): string {
  const msg = userMessage.toLowerCase().trim();

  // Greeting
  if (msg.match(/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening))/)) {
    const timeGreeting = getTimeGreeting();
    return `${timeGreeting}! 😊 I'm your FoodDarzee AI assistant. I can help you with:\n\n🍽️ **Meal suggestions** — "What should I eat?"\n📊 **Progress check** — "How am I doing today?"\n💡 **Health tips** — "Give me a health tip"\n🎯 **Goal advice** — "Help me with my goals"\n\nWhat would you like to know?`;
  }

  // What should I eat?
  if (msg.match(/(what|suggest|recommend).*(eat|meal|food|have)/)) {
    return generateMealSuggestion(context);
  }

  // How am I doing / progress
  if (msg.match(/(how|progress|doing|status|today|summary)/)) {
    return generateProgressSummary(context);
  }

  // Health tips
  if (msg.match(/(tip|advice|healthy|improve|better)/)) {
    return getHealthTip(context);
  }

  // Calorie / nutrition info
  if (msg.match(/(calorie|calories|protein|carb|fat|macro|nutrition)/)) {
    return getNutritionInfo(context);
  }

  // Streak / gamification
  if (msg.match(/(streak|badge|achievement|points|level|score)/)) {
    return getStreakInfo(context);
  }

  // Weight / BMI
  if (msg.match(/(weight|bmi|body|lose|gain|thin|fat)/)) {
    return getWeightAdvice(context);
  }

  // Water / hydration
  if (msg.match(/(water|hydrat|drink|thirst)/)) {
    return '💧 **Hydration is key!**\n\nAim for 8-10 glasses of water daily. Here are some tips:\n\n• Start your day with a glass of warm water + lemon\n• Keep a bottle at your desk\n• Set hourly reminders\n• Count herbal teas and coconut water too\n• Drink a glass before each meal — it helps with portion control!';
  }

  // Sleep
  if (msg.match(/(sleep|tired|fatigue|energy|rest)/)) {
    return getSleepAdvice(context);
  }

  // Thanks
  if (msg.match(/(thank|thanks|thx)/)) {
    return 'You\'re welcome! 😊 Remember — every healthy choice today prevents a health issue tomorrow. I\'m here whenever you need guidance! 💪';
  }

  // Default
  return `I'd love to help! Here are some things you can ask me:\n\n🍽️ "What should I eat now?"\n📊 "How am I doing today?"\n💡 "Give me a health tip"\n🔢 "Show my nutrition info"\n💧 "How much water should I drink?"\n🏆 "Show my streak"\n\nTry one of these! 😊`;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function generateMealSuggestion(context: ChatContext): string {
  const mealType = getCurrentMealType();
  const dietType = context.profile?.dietaryPref || 'veg';
  
  const foods = foodDatabase
    .filter(f => f.category === mealType)
    .filter(f => {
      if (dietType === 'vegan') return f.dietType === 'vegan';
      if (dietType === 'veg') return f.dietType !== 'non-veg';
      return true;
    })
    .filter(f => !f.tags.includes('junk'));

  const shuffled = foods.sort(() => Math.random() - 0.5).slice(0, 3);

  let response = `🍽️ **${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Suggestions:**\n\n`;

  if (context.targets && context.todayTotals.calories > 0) {
    const remaining = context.targets.calories - context.todayTotals.calories;
    response += `📊 You have ~${Math.max(0, remaining)} calories remaining today.\n\n`;
  }

  shuffled.forEach((food, i) => {
    response += `${i + 1}. **${food.name}** — ${food.calories} cal | P:${food.protein}g C:${food.carbs}g F:${food.fats}g\n   _${food.servingSize}_\n\n`;
  });

  if (context.todayTotals.protein < (context.targets?.protein || 50) * 0.5) {
    response += `💪 _Tip: Your protein is low today, prioritize the highest protein option!_`;
  }

  return response;
}

function generateProgressSummary(context: ChatContext): string {
  if (!context.targets) {
    return '📊 Complete your onboarding profile first so I can track your personalized progress! Head to the **Dashboard** to get started.';
  }

  const { todayTotals: t, targets } = context;
  const calPct = Math.round((t.calories / targets.calories) * 100);
  const proPct = Math.round((t.protein / targets.protein) * 100);

  let response = `📊 **Today's Progress:**\n\n`;
  response += `🔥 Calories: **${t.calories}** / ${targets.calories} (${calPct}%)\n`;
  response += `💪 Protein: **${t.protein}g** / ${targets.protein}g (${proPct}%)\n`;
  response += `🍞 Carbs: **${t.carbs}g** / ${targets.carbs}g\n`;
  response += `🧈 Fats: **${t.fats}g** / ${targets.fats}g\n`;
  response += `📝 Meals logged: **${context.todayMealCount}**\n\n`;

  if (calPct < 50) response += '⚠️ _You\'re under-eating today. Make sure to have your remaining meals!_\n';
  else if (calPct > 110) response += '⚠️ _You\'re over your calorie target. Choose lighter options for remaining meals._\n';
  else response += '✅ _You\'re on track! Keep it up!_\n';

  if (context.streak > 0) {
    response += `\n🔥 Current streak: **${context.streak} days** — don't break it!`;
  }

  return response;
}

function getHealthTip(context: ChatContext): string {
  const tips = [
    '🥗 **Eat the rainbow** — Different colored fruits and vegetables provide different nutrients. Aim for 5 colors daily!',
    '⏰ **Meal timing matters** — Eat breakfast within 1 hour of waking. This kickstarts your metabolism for the day.',
    '💧 **Pre-meal water** — Drink a glass of water 30 minutes before meals. It aids digestion and prevents overeating.',
    '🍎 **Fiber first** — Start meals with fiber-rich foods (salad, veggies) before carbs. This reduces blood sugar spikes.',
    '🌙 **Kitchen closes at 8 PM** — Try to finish dinner by 8 PM. Late eating disrupts sleep and digestion.',
    '🥜 **Healthy snacking** — Keep nuts, fruits, and roasted chana handy to avoid reaching for chips and biscuits.',
    '🍚 **Portion control** — Use smaller plates. Studies show we eat 22% less with smaller plates!',
    '🧘 **Mindful eating** — Put down your phone during meals. Eat slowly, chew well. It takes 20 minutes to feel full.',
    '☕ **Coffee timing** — Avoid coffee after 2 PM if you have sleep issues. Morning coffee with breakfast is ideal.',
    '🏃 **Move after meals** — A 10-minute walk after lunch or dinner significantly helps blood sugar control.',
  ];

  const tip = tips[Math.floor(Math.random() * tips.length)];

  if (context.profile?.goal === 'weight_loss') {
    return tip + '\n\n🎯 _Since your goal is weight loss: Focus on protein-rich meals that keep you full longer!_';
  }
  return tip;
}

function getNutritionInfo(context: ChatContext): string {
  if (!context.targets) {
    return '📊 Set up your profile first to see personalized nutrition targets!';
  }

  const { targets } = context;
  return `📊 **Your Daily Nutrition Targets:**\n\n` +
    `🔥 Calories: **${targets.calories} kcal**\n` +
    `💪 Protein: **${targets.protein}g** (builds & repairs muscles)\n` +
    `🍞 Carbs: **${targets.carbs}g** (primary energy source)\n` +
    `🧈 Fats: **${targets.fats}g** (hormones & brain health)\n` +
    `🥦 Fiber: **${targets.fiber}g** (digestion & satiety)\n` +
    `💧 Water: **${targets.water} glasses**\n\n` +
    `_These targets are calculated based on your profile, activity level, and health goals._`;
}

function getStreakInfo(context: ChatContext): string {
  if (context.streak > 7) {
    return `🔥 **Amazing! ${context.streak}-day streak!**\n\nYou're building an incredible habit. Keep logging your meals daily to maintain it!\n\n🏆 Your dedication puts you in the top tier of health-conscious individuals. Every day counts!`;
  }
  if (context.streak > 0) {
    return `🔥 **${context.streak}-day streak!**\n\nGreat start! Keep logging meals daily. The magic happens after 21 days — that's when healthy eating becomes a habit!\n\n💡 _Tip: Set a daily reminder to log meals and never break the chain!_`;
  }
  return `🔥 **No active streak yet.**\n\nStart logging your meals daily to build a streak! Consistency is the key to long-term health.\n\n💡 _Tip: Start with just logging breakfast. Small steps lead to big changes!_`;
}

function getWeightAdvice(context: ChatContext): string {
  if (!context.profile) {
    return '⚖️ Complete your profile with height and weight to get personalized weight advice!';
  }

  const bmi = context.profile.weight / Math.pow(context.profile.height / 100, 2);
  let category = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi >= 25) category = 'overweight';
  else if (bmi >= 30) category = 'obese';

  let response = `⚖️ **Your BMI: ${bmi.toFixed(1)}** (${category})\n\n`;

  if (category === 'underweight') {
    response += 'Focus on:\n• Calorie-surplus with nutrient-dense foods\n• More protein (eggs, paneer, dal, chicken)\n• Healthy fats (nuts, ghee, avocado)\n• Strength training to build muscle mass';
  } else if (category === 'overweight' || category === 'obese') {
    response += 'Focus on:\n• Moderate calorie deficit (500 cal/day)\n• High protein to preserve muscle\n• High fiber for satiety (25-38g daily)\n• 30 min activity daily\n• Avoid sugary drinks and processed foods';
  } else {
    response += 'You\'re in a healthy range! 🎉\n\nFocus on:\n• Maintaining consistent eating habits\n• Balanced macros across meals\n• Regular physical activity\n• Quality sleep (7-8 hours)';
  }

  return response;
}

function getSleepAdvice(context: ChatContext): string {
  const sleep = context.profile?.sleepHours || 7;
  let response = `😴 **Sleep & Nutrition Connection:**\n\n`;

  if (sleep < 6) {
    response += `⚠️ You're sleeping only ${sleep} hours. This can:\n• Increase hunger hormones (ghrelin) by 28%\n• Reduce fat-burning efficiency\n• Cause sugar cravings\n\n`;
  }

  response += `**Tips for better sleep:**\n`;
  response += `• Finish dinner 2-3 hours before bed\n`;
  response += `• Avoid caffeine after 2 PM\n`;
  response += `• Include magnesium-rich foods: bananas, nuts, dark chocolate\n`;
  response += `• Try warm milk or chamomile tea before bed\n`;
  response += `• Aim for 7-8 hours — it's when your body repairs itself!`;

  return response;
}
