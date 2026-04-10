export interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  dietType: 'veg' | 'non-veg' | 'vegan';
  calories: number;
  protein: number; // grams
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  servingSize: string;
  tags: string[];
}

export const foodDatabase: FoodItem[] = [
  // ===== BREAKFAST =====
  { id: 'b1', name: 'Oats Porridge with Milk', category: 'breakfast', dietType: 'veg', calories: 220, protein: 8, carbs: 38, fats: 5, fiber: 4, sugar: 8, servingSize: '1 bowl (200g)', tags: ['high-fiber', 'whole-grain'] },
  { id: 'b2', name: 'Masala Dosa with Chutney', category: 'breakfast', dietType: 'veg', calories: 310, protein: 7, carbs: 45, fats: 12, fiber: 2, sugar: 3, servingSize: '1 dosa + chutney', tags: ['south-indian', 'fermented'] },
  { id: 'b3', name: 'Poha (Flattened Rice)', category: 'breakfast', dietType: 'veg', calories: 250, protein: 5, carbs: 42, fats: 8, fiber: 2, sugar: 2, servingSize: '1 plate (200g)', tags: ['light', 'quick'] },
  { id: 'b4', name: 'Idli with Sambar', category: 'breakfast', dietType: 'veg', calories: 200, protein: 6, carbs: 36, fats: 4, fiber: 3, sugar: 2, servingSize: '3 idlis + sambar', tags: ['south-indian', 'low-fat', 'fermented'] },
  { id: 'b5', name: 'Egg Bhurji with Toast', category: 'breakfast', dietType: 'non-veg', calories: 320, protein: 18, carbs: 28, fats: 15, fiber: 2, sugar: 3, servingSize: '2 eggs + 2 toast', tags: ['high-protein', 'quick'] },
  { id: 'b6', name: 'Moong Dal Chilla', category: 'breakfast', dietType: 'veg', calories: 180, protein: 12, carbs: 24, fats: 4, fiber: 4, sugar: 2, servingSize: '2 chillas', tags: ['high-protein', 'low-fat'] },
  { id: 'b7', name: 'Greek Yogurt with Granola', category: 'breakfast', dietType: 'veg', calories: 280, protein: 15, carbs: 35, fats: 8, fiber: 3, sugar: 14, servingSize: '1 bowl (250g)', tags: ['high-protein', 'probiotics'] },
  { id: 'b8', name: 'Upma', category: 'breakfast', dietType: 'veg', calories: 230, protein: 6, carbs: 38, fats: 7, fiber: 3, sugar: 2, servingSize: '1 bowl (200g)', tags: ['south-indian', 'semolina'] },
  { id: 'b9', name: 'Banana Smoothie', category: 'breakfast', dietType: 'vegan', calories: 200, protein: 4, carbs: 42, fats: 3, fiber: 3, sugar: 24, servingSize: '1 glass (300ml)', tags: ['quick', 'energy'] },
  { id: 'b10', name: 'Paratha with Curd', category: 'breakfast', dietType: 'veg', calories: 350, protein: 9, carbs: 42, fats: 16, fiber: 2, sugar: 4, servingSize: '2 parathas + curd', tags: ['north-indian', 'filling'] },
  { id: 'b11', name: 'Besan Chilla', category: 'breakfast', dietType: 'veg', calories: 190, protein: 10, carbs: 22, fats: 7, fiber: 4, sugar: 2, servingSize: '2 chillas', tags: ['high-protein', 'gluten-free'] },
  { id: 'b12', name: 'Avocado Toast', category: 'breakfast', dietType: 'vegan', calories: 260, protein: 6, carbs: 28, fats: 15, fiber: 7, sugar: 2, servingSize: '2 slices', tags: ['healthy-fat', 'trendy'] },
  { id: 'b13', name: 'Boiled Eggs', category: 'breakfast', dietType: 'non-veg', calories: 155, protein: 13, carbs: 1, fats: 11, fiber: 0, sugar: 1, servingSize: '2 eggs', tags: ['high-protein', 'simple'] },
  { id: 'b14', name: 'Chia Seed Pudding', category: 'breakfast', dietType: 'vegan', calories: 210, protein: 6, carbs: 28, fats: 9, fiber: 10, sugar: 8, servingSize: '1 bowl (200g)', tags: ['high-fiber', 'superfood'] },
  { id: 'b15', name: 'Sprouts Salad', category: 'breakfast', dietType: 'vegan', calories: 120, protein: 8, carbs: 18, fats: 2, fiber: 6, sugar: 3, servingSize: '1 bowl (150g)', tags: ['high-protein', 'low-calorie'] },

  // ===== LUNCH =====
  { id: 'l1', name: 'Dal Rice with Sabzi', category: 'lunch', dietType: 'veg', calories: 450, protein: 15, carbs: 68, fats: 12, fiber: 8, sugar: 4, servingSize: '1 plate', tags: ['balanced', 'indian'] },
  { id: 'l2', name: 'Chicken Curry with Roti', category: 'lunch', dietType: 'non-veg', calories: 520, protein: 32, carbs: 45, fats: 18, fiber: 4, sugar: 3, servingSize: '2 roti + curry', tags: ['high-protein', 'indian'] },
  { id: 'l3', name: 'Rajma Chawal', category: 'lunch', dietType: 'veg', calories: 420, protein: 16, carbs: 65, fats: 10, fiber: 12, sugar: 4, servingSize: '1 plate', tags: ['high-fiber', 'north-indian'] },
  { id: 'l4', name: 'Grilled Chicken Salad', category: 'lunch', dietType: 'non-veg', calories: 350, protein: 35, carbs: 15, fats: 16, fiber: 5, sugar: 4, servingSize: '1 large bowl', tags: ['high-protein', 'low-carb'] },
  { id: 'l5', name: 'Chole Bhature', category: 'lunch', dietType: 'veg', calories: 580, protein: 14, carbs: 72, fats: 26, fiber: 8, sugar: 5, servingSize: '2 bhature + chole', tags: ['north-indian', 'heavy'] },
  { id: 'l6', name: 'Paneer Butter Masala with Naan', category: 'lunch', dietType: 'veg', calories: 550, protein: 20, carbs: 52, fats: 28, fiber: 3, sugar: 6, servingSize: '2 naan + paneer', tags: ['high-protein', 'rich'] },
  { id: 'l7', name: 'Fish Curry with Rice', category: 'lunch', dietType: 'non-veg', calories: 440, protein: 28, carbs: 55, fats: 12, fiber: 3, sugar: 3, servingSize: '1 plate', tags: ['omega-3', 'coastal'] },
  { id: 'l8', name: 'Vegetable Biryani', category: 'lunch', dietType: 'veg', calories: 400, protein: 10, carbs: 62, fats: 14, fiber: 5, sugar: 3, servingSize: '1 plate', tags: ['rice', 'flavorful'] },
  { id: 'l9', name: 'Quinoa Bowl with Veggies', category: 'lunch', dietType: 'vegan', calories: 380, protein: 14, carbs: 52, fats: 12, fiber: 8, sugar: 5, servingSize: '1 bowl', tags: ['superfood', 'complete-protein'] },
  { id: 'l10', name: 'Egg Fried Rice', category: 'lunch', dietType: 'non-veg', calories: 420, protein: 16, carbs: 58, fats: 14, fiber: 3, sugar: 4, servingSize: '1 plate', tags: ['quick', 'indo-chinese'] },
  { id: 'l11', name: 'Sambar Rice', category: 'lunch', dietType: 'veg', calories: 380, protein: 12, carbs: 62, fats: 8, fiber: 7, sugar: 4, servingSize: '1 plate', tags: ['south-indian', 'balanced'] },
  { id: 'l12', name: 'Palak Paneer with Roti', category: 'lunch', dietType: 'veg', calories: 420, protein: 22, carbs: 38, fats: 20, fiber: 5, sugar: 3, servingSize: '2 roti + paneer', tags: ['iron-rich', 'north-indian'] },
  { id: 'l13', name: 'Chicken Biryani', category: 'lunch', dietType: 'non-veg', calories: 550, protein: 28, carbs: 65, fats: 18, fiber: 3, sugar: 3, servingSize: '1 plate', tags: ['high-protein', 'rice'] },
  { id: 'l14', name: 'Tofu Stir Fry with Brown Rice', category: 'lunch', dietType: 'vegan', calories: 360, protein: 18, carbs: 48, fats: 12, fiber: 6, sugar: 4, servingSize: '1 plate', tags: ['high-protein', 'vegan'] },
  { id: 'l15', name: 'Mixed Vegetable Curry with Chapati', category: 'lunch', dietType: 'veg', calories: 380, protein: 10, carbs: 52, fats: 14, fiber: 8, sugar: 5, servingSize: '2 chapati + sabzi', tags: ['balanced', 'homestyle'] },

  // ===== DINNER =====
  { id: 'd1', name: 'Khichdi with Ghee', category: 'dinner', dietType: 'veg', calories: 320, protein: 12, carbs: 50, fats: 8, fiber: 6, sugar: 2, servingSize: '1 bowl', tags: ['light', 'comfort'] },
  { id: 'd2', name: 'Grilled Fish with Salad', category: 'dinner', dietType: 'non-veg', calories: 300, protein: 32, carbs: 10, fats: 14, fiber: 4, sugar: 3, servingSize: '1 fillet + salad', tags: ['high-protein', 'low-carb', 'omega-3'] },
  { id: 'd3', name: 'Dal Tadka with Jeera Rice', category: 'dinner', dietType: 'veg', calories: 400, protein: 14, carbs: 60, fats: 12, fiber: 7, sugar: 3, servingSize: '1 plate', tags: ['comfort', 'balanced'] },
  { id: 'd4', name: 'Soup with Multigrain Bread', category: 'dinner', dietType: 'veg', calories: 220, protein: 8, carbs: 32, fats: 6, fiber: 5, sugar: 5, servingSize: '1 bowl + 2 slices', tags: ['light', 'low-calorie'] },
  { id: 'd5', name: 'Tandoori Chicken with Roti', category: 'dinner', dietType: 'non-veg', calories: 420, protein: 35, carbs: 35, fats: 14, fiber: 3, sugar: 2, servingSize: '2 pieces + 2 roti', tags: ['high-protein', 'tandoor'] },
  { id: 'd6', name: 'Paneer Tikka with Salad', category: 'dinner', dietType: 'veg', calories: 350, protein: 22, carbs: 15, fats: 22, fiber: 4, sugar: 3, servingSize: '200g + salad', tags: ['high-protein', 'low-carb'] },
  { id: 'd7', name: 'Vegetable Soup', category: 'dinner', dietType: 'vegan', calories: 120, protein: 4, carbs: 18, fats: 4, fiber: 5, sugar: 6, servingSize: '1 large bowl', tags: ['light', 'low-calorie'] },
  { id: 'd8', name: 'Egg Curry with Chapati', category: 'dinner', dietType: 'non-veg', calories: 380, protein: 18, carbs: 38, fats: 16, fiber: 3, sugar: 3, servingSize: '2 eggs + 2 chapati', tags: ['balanced', 'homestyle'] },
  { id: 'd9', name: 'Moong Dal Soup', category: 'dinner', dietType: 'vegan', calories: 150, protein: 10, carbs: 22, fats: 2, fiber: 5, sugar: 2, servingSize: '1 bowl', tags: ['light', 'high-protein'] },
  { id: 'd10', name: 'Mushroom Curry with Rice', category: 'dinner', dietType: 'vegan', calories: 350, protein: 10, carbs: 52, fats: 10, fiber: 5, sugar: 4, servingSize: '1 plate', tags: ['umami', 'vegan'] },
  { id: 'd11', name: 'Grilled Paneer Wrap', category: 'dinner', dietType: 'veg', calories: 380, protein: 20, carbs: 35, fats: 18, fiber: 3, sugar: 3, servingSize: '1 wrap', tags: ['quick', 'high-protein'] },
  { id: 'd12', name: 'Lentil Salad Bowl', category: 'dinner', dietType: 'vegan', calories: 280, protein: 15, carbs: 40, fats: 6, fiber: 10, sugar: 4, servingSize: '1 bowl', tags: ['high-fiber', 'vegan'] },

  // ===== SNACKS =====
  { id: 's1', name: 'Mixed Nuts (Almonds, Walnuts)', category: 'snack', dietType: 'vegan', calories: 180, protein: 6, carbs: 8, fats: 16, fiber: 3, sugar: 2, servingSize: '30g handful', tags: ['healthy-fat', 'energy'] },
  { id: 's2', name: 'Fruit Chaat', category: 'snack', dietType: 'vegan', calories: 120, protein: 2, carbs: 28, fats: 1, fiber: 4, sugar: 20, servingSize: '1 bowl (200g)', tags: ['vitamins', 'refreshing'] },
  { id: 's3', name: 'Roasted Chana', category: 'snack', dietType: 'vegan', calories: 140, protein: 8, carbs: 22, fats: 3, fiber: 6, sugar: 2, servingSize: '50g', tags: ['high-fiber', 'crunchy'] },
  { id: 's4', name: 'Peanut Butter Toast', category: 'snack', dietType: 'vegan', calories: 220, protein: 8, carbs: 22, fats: 12, fiber: 3, sugar: 4, servingSize: '2 slices', tags: ['energy', 'protein'] },
  { id: 's5', name: 'Makhana (Fox Nuts)', category: 'snack', dietType: 'vegan', calories: 100, protein: 4, carbs: 18, fats: 1, fiber: 2, sugar: 1, servingSize: '1 bowl (30g)', tags: ['low-calorie', 'healthy'] },
  { id: 's6', name: 'Protein Bar', category: 'snack', dietType: 'veg', calories: 200, protein: 20, carbs: 22, fats: 6, fiber: 3, sugar: 8, servingSize: '1 bar (60g)', tags: ['high-protein', 'convenient'] },
  { id: 's7', name: 'Dark Chocolate (70%)', category: 'snack', dietType: 'vegan', calories: 170, protein: 3, carbs: 18, fats: 12, fiber: 3, sugar: 10, servingSize: '30g (3 squares)', tags: ['antioxidants', 'mood'] },
  { id: 's8', name: 'Dhokla', category: 'snack', dietType: 'veg', calories: 160, protein: 6, carbs: 26, fats: 4, fiber: 2, sugar: 4, servingSize: '3 pieces', tags: ['fermented', 'gujarati'] },
  { id: 's9', name: 'Apple with Peanut Butter', category: 'snack', dietType: 'vegan', calories: 200, protein: 5, carbs: 28, fats: 10, fiber: 5, sugar: 18, servingSize: '1 apple + 1 tbsp PB', tags: ['fiber', 'healthy-fat'] },
  { id: 's10', name: 'Samosa (2 pieces)', category: 'snack', dietType: 'veg', calories: 320, protein: 5, carbs: 38, fats: 16, fiber: 3, sugar: 2, servingSize: '2 pieces', tags: ['fried', 'junk'] },
  { id: 's11', name: 'Bhel Puri', category: 'snack', dietType: 'veg', calories: 180, protein: 4, carbs: 30, fats: 6, fiber: 3, sugar: 4, servingSize: '1 plate', tags: ['chaat', 'street-food'] },
  { id: 's12', name: 'Trail Mix', category: 'snack', dietType: 'vegan', calories: 160, protein: 5, carbs: 20, fats: 8, fiber: 3, sugar: 10, servingSize: '40g', tags: ['energy', 'hiking'] },
  { id: 's13', name: 'Paneer Tikka Bites', category: 'snack', dietType: 'veg', calories: 200, protein: 14, carbs: 6, fats: 14, fiber: 1, sugar: 2, servingSize: '100g', tags: ['high-protein', 'low-carb'] },
  { id: 's14', name: 'Banana', category: 'snack', dietType: 'vegan', calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3, sugar: 14, servingSize: '1 medium', tags: ['potassium', 'energy', 'quick'] },
  { id: 's15', name: 'Chips / Namkeen', category: 'snack', dietType: 'veg', calories: 250, protein: 3, carbs: 32, fats: 14, fiber: 1, sugar: 1, servingSize: '50g pack', tags: ['junk', 'processed'] },

  // ===== BEVERAGES =====
  { id: 'bv1', name: 'Green Tea', category: 'beverage', dietType: 'vegan', calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, sugar: 0, servingSize: '1 cup (240ml)', tags: ['antioxidants', 'metabolism'] },
  { id: 'bv2', name: 'Masala Chai', category: 'beverage', dietType: 'veg', calories: 80, protein: 2, carbs: 12, fats: 3, fiber: 0, sugar: 10, servingSize: '1 cup (200ml)', tags: ['indian', 'warm'] },
  { id: 'bv3', name: 'Fresh Orange Juice', category: 'beverage', dietType: 'vegan', calories: 110, protein: 2, carbs: 26, fats: 0, fiber: 1, sugar: 22, servingSize: '1 glass (250ml)', tags: ['vitamin-c', 'fresh'] },
  { id: 'bv4', name: 'Buttermilk / Chaas', category: 'beverage', dietType: 'veg', calories: 40, protein: 2, carbs: 5, fats: 1, fiber: 0, sugar: 4, servingSize: '1 glass (250ml)', tags: ['digestive', 'probiotics'] },
  { id: 'bv5', name: 'Protein Shake', category: 'beverage', dietType: 'veg', calories: 200, protein: 25, carbs: 15, fats: 5, fiber: 1, sugar: 6, servingSize: '1 shake (300ml)', tags: ['high-protein', 'post-workout'] },
  { id: 'bv6', name: 'Coconut Water', category: 'beverage', dietType: 'vegan', calories: 45, protein: 1, carbs: 10, fats: 0, fiber: 0, sugar: 8, servingSize: '1 glass (250ml)', tags: ['hydration', 'electrolytes'] },
  { id: 'bv7', name: 'Lassi (Sweet)', category: 'beverage', dietType: 'veg', calories: 150, protein: 5, carbs: 24, fats: 4, fiber: 0, sugar: 20, servingSize: '1 glass (250ml)', tags: ['probiotics', 'punjabi'] },
  { id: 'bv8', name: 'Black Coffee', category: 'beverage', dietType: 'vegan', calories: 5, protein: 0, carbs: 1, fats: 0, fiber: 0, sugar: 0, servingSize: '1 cup (240ml)', tags: ['caffeine', 'metabolism'] },
  { id: 'bv9', name: 'Cold Drink / Soda', category: 'beverage', dietType: 'vegan', calories: 140, protein: 0, carbs: 38, fats: 0, fiber: 0, sugar: 38, servingSize: '1 can (330ml)', tags: ['junk', 'sugar', 'avoid'] },
  { id: 'bv10', name: 'Lemon Water', category: 'beverage', dietType: 'vegan', calories: 10, protein: 0, carbs: 3, fats: 0, fiber: 0, sugar: 1, servingSize: '1 glass (250ml)', tags: ['detox', 'hydration'] },

  // ===== MORE LUNCH/DINNER OPTIONS =====
  { id: 'l16', name: 'Butter Chicken with Rice', category: 'lunch', dietType: 'non-veg', calories: 620, protein: 30, carbs: 58, fats: 28, fiber: 3, sugar: 5, servingSize: '1 plate', tags: ['rich', 'north-indian'] },
  { id: 'l17', name: 'Aloo Gobi with Roti', category: 'lunch', dietType: 'veg', calories: 340, protein: 8, carbs: 48, fats: 14, fiber: 5, sugar: 4, servingSize: '2 roti + sabzi', tags: ['homestyle', 'north-indian'] },
  { id: 'l18', name: 'Wrap with Hummus & Veggies', category: 'lunch', dietType: 'vegan', calories: 320, protein: 10, carbs: 42, fats: 14, fiber: 7, sugar: 4, servingSize: '1 wrap', tags: ['mediterranean', 'healthy'] },
  { id: 'd13', name: 'Roti with Curd & Pickle', category: 'dinner', dietType: 'veg', calories: 280, protein: 8, carbs: 42, fats: 8, fiber: 2, sugar: 4, servingSize: '2 roti + curd', tags: ['light', 'simple'] },
  { id: 'd14', name: 'Steamed Fish with Veggies', category: 'dinner', dietType: 'non-veg', calories: 250, protein: 30, carbs: 12, fats: 8, fiber: 4, sugar: 3, servingSize: '1 fillet + veggies', tags: ['low-calorie', 'omega-3'] },
  { id: 'd15', name: 'Stuffed Capsicum', category: 'dinner', dietType: 'veg', calories: 220, protein: 8, carbs: 28, fats: 10, fiber: 5, sugar: 5, servingSize: '2 capsicums', tags: ['creative', 'low-calorie'] },

  // ===== JUNK FOOD (for tracking) =====
  { id: 'j1', name: 'Pizza Slice (Cheese)', category: 'snack', dietType: 'veg', calories: 280, protein: 12, carbs: 36, fats: 10, fiber: 2, sugar: 4, servingSize: '1 large slice', tags: ['junk', 'processed'] },
  { id: 'j2', name: 'Burger (Veg)', category: 'lunch', dietType: 'veg', calories: 350, protein: 12, carbs: 42, fats: 15, fiber: 3, sugar: 6, servingSize: '1 burger', tags: ['junk', 'fast-food'] },
  { id: 'j3', name: 'French Fries', category: 'snack', dietType: 'vegan', calories: 310, protein: 4, carbs: 42, fats: 15, fiber: 3, sugar: 1, servingSize: '1 medium portion', tags: ['junk', 'fried'] },
  { id: 'j4', name: 'Ice Cream', category: 'snack', dietType: 'veg', calories: 270, protein: 4, carbs: 32, fats: 14, fiber: 0, sugar: 28, servingSize: '1 scoop (100g)', tags: ['junk', 'sugar', 'dessert'] },
  { id: 'j5', name: 'Fried Chicken (2 pcs)', category: 'snack', dietType: 'non-veg', calories: 400, protein: 28, carbs: 18, fats: 24, fiber: 1, sugar: 1, servingSize: '2 pieces', tags: ['junk', 'fried'] },
  { id: 'j6', name: 'Instant Noodles (Maggi)', category: 'snack', dietType: 'veg', calories: 310, protein: 7, carbs: 44, fats: 12, fiber: 2, sugar: 2, servingSize: '1 pack', tags: ['junk', 'processed', 'sodium'] },
  { id: 'j7', name: 'Pav Bhaji', category: 'dinner', dietType: 'veg', calories: 400, protein: 10, carbs: 52, fats: 18, fiber: 5, sugar: 6, servingSize: '2 pav + bhaji', tags: ['street-food', 'butter'] },
  { id: 'j8', name: 'Chocolate Cake Slice', category: 'snack', dietType: 'veg', calories: 350, protein: 4, carbs: 48, fats: 16, fiber: 2, sugar: 32, servingSize: '1 slice', tags: ['junk', 'sugar', 'dessert'] },
];

export function searchFoods(query: string, filters?: {
  category?: string;
  dietType?: string;
}): FoodItem[] {
  let results = foodDatabase;
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.tags.some(t => t.includes(q)) ||
      f.category.includes(q)
    );
  }
  
  if (filters?.category) {
    results = results.filter(f => f.category === filters.category);
  }
  
  if (filters?.dietType) {
    results = results.filter(f => {
      if (filters.dietType === 'vegan') return f.dietType === 'vegan';
      if (filters.dietType === 'veg') return f.dietType === 'veg' || f.dietType === 'vegan';
      return true; // non-veg can eat everything
    });
  }
  
  return results;
}

export function getFoodsByCategory(category: string, dietType?: string): FoodItem[] {
  return searchFoods('', { category, dietType });
}

export function getJunkFoods(): FoodItem[] {
  return foodDatabase.filter(f => f.tags.includes('junk'));
}

export function getHighProteinFoods(dietType?: string): FoodItem[] {
  return searchFoods('', { dietType }).filter(f => f.tags.includes('high-protein') || f.protein >= 15);
}

export function getLowCalorieFoods(dietType?: string): FoodItem[] {
  return searchFoods('', { dietType }).filter(f => f.calories <= 200);
}
