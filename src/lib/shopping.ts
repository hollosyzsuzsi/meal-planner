import { type WeekPlan, type ShoppingItem, type ShoppingList, type ShoppingGroup, type IngredientCategory } from '../types/plan';

// ---------------------------------------------------------------------------
// Category classifier — maps ingredient names to categories
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: Record<IngredientCategory, string[]> = {
  'produce': [
    'tomato', 'onion', 'garlic', 'pepper', 'carrot', 'potato', 'lettuce',
    'spinach', 'broccoli', 'cucumber', 'zucchini', 'courgette', 'mushroom',
    'lemon', 'lime', 'orange', 'apple', 'banana', 'avocado', 'ginger',
    'celery', 'leek', 'cabbage', 'kale', 'pea', 'corn', 'bean sprout',
    'spring onion', 'scallion', 'shallot', 'herb', 'basil', 'parsley',
    'coriander', 'cilantro', 'mint', 'thyme', 'rosemary', 'dill',
  ],
  'meat & fish': [
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'ham',
    'sausage', 'mince', 'ground', 'steak', 'fillet', 'breast', 'thigh',
    'salmon', 'tuna', 'cod', 'shrimp', 'prawn', 'fish', 'seafood', 'anchovy',
  ],
  'dairy & eggs': [
    'milk', 'cream', 'butter', 'cheese', 'yogurt', 'yoghurt', 'egg',
    'parmesan', 'mozzarella', 'cheddar', 'feta', 'ricotta', 'mascarpone',
    'sour cream', 'crème fraîche', 'half and half',
  ],
  'grains & pasta': [
    'pasta', 'spaghetti', 'rice', 'bread', 'flour', 'oat', 'noodle',
    'quinoa', 'couscous', 'tortilla', 'wrap', 'pita', 'bagel', 'cereal',
    'barley', 'lentil', 'chickpea', 'lentils', 'chickpeas',
  ],
  'canned & dry': [
    'tomato can', 'canned', 'tinned', 'stock', 'broth', 'coconut milk',
    'bean', 'beans', 'lentil', 'chickpea', 'kidney', 'black bean',
    'tomato paste', 'passata', 'sauce', 'soup',
  ],
  'condiments & spices': [
    'oil', 'olive oil', 'salt', 'pepper', 'sugar', 'honey', 'vinegar',
    'soy sauce', 'worcestershire', 'mustard', 'ketchup', 'mayonnaise',
    'cumin', 'paprika', 'turmeric', 'cinnamon', 'oregano', 'chili',
    'chilli', 'curry', 'spice', 'seasoning', 'sauce', 'paste',
  ],
  'other': [],
};

const CATEGORY_ORDER: IngredientCategory[] = [
  'produce',
  'meat & fish',
  'dairy & eggs',
  'grains & pasta',
  'canned & dry',
  'condiments & spices',
  'other',
];

function classifyIngredient(name: string): IngredientCategory {
  const lower = name.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [IngredientCategory, string[]][]) {
    if (category === 'other') continue;
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'other';
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function buildShoppingList(weekPlan: WeekPlan): ShoppingList {
  // Merge ingredients across all meals, combining same name+unit
  const merged = new Map<string, ShoppingItem>();

  for (const dayPlan of weekPlan.days) {
    const { meal } = dayPlan;
    for (const ing of meal.ingredients) {
      const key = `${ing.name.toLowerCase().trim()}__${ing.unit}`;
      const existing = merged.get(key);

      if (existing) {
        existing.quantity += ing.quantity;
        if (!existing.meals.includes(meal.name)) {
          existing.meals.push(meal.name);
        }
      } else {
        merged.set(key, {
          name: ing.name.trim(),
          quantity: ing.quantity,
          unit: ing.unit,
          category: classifyIngredient(ing.name),
          meals: [meal.name],
          checked: false,
        });
      }
    }
  }

  // Group by category in defined order
  const byCat = new Map<IngredientCategory, ShoppingItem[]>();
  for (const item of merged.values()) {
    const existing = byCat.get(item.category) ?? [];
    existing.push(item);
    byCat.set(item.category, existing);
  }

  const groups: ShoppingGroup[] = CATEGORY_ORDER
    .filter((cat) => byCat.has(cat))
    .map((cat) => ({
      category: cat,
      items: (byCat.get(cat) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    }));

  return {
    week_plan_id: weekPlan.id,
    week_start: weekPlan.week_start,
    groups,
  };
}

export { CATEGORY_ORDER };