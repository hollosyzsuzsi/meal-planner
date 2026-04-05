import { type Meal } from '../types/meal';
import { type DayOfWeek } from '../types/plan';
import { type UserPreferences } from '../types/prefs';
import { DAYS } from '../constants/days';
import { getMonday } from '../utils/date';
import { capitalize } from '../utils/capitalize';
import { shuffle } from '../utils/shuffle';

// Lightweight type used only during plan generation (before DB save)
interface PlanDay {
  day: DayOfWeek;
  meal: Meal;
}

type Day = typeof DAYS[number];

export interface GeneratePlanResult {
  weekPlan: { week_start: string; days: PlanDay[] };
  warnings: string[];
}

export function generateWeekPlan(
  meals: Meal[],
  prefs: UserPreferences
): GeneratePlanResult {
  if (meals.length === 0) {
    throw new Error('Add at least one meal before generating a plan.');
  }

  const warnings: string[] = [];

  // --- Build cooking slots based on frequency ---
  // Each slot = array of days that eat the same meal
  const slots = buildSlots(prefs.cooking_frequency);

  const minMealsNeeded = slots.length;
  if (meals.length < minMealsNeeded) {
    warnings.push(
      `You have ${meals.length} meal${meals.length !== 1 ? 's' : ''} but need ${minMealsNeeded} for a full week without repeats. Some meals will repeat.`
    );
  }

  const shuffled = shuffle([...meals]);
  const days: PlanDay[] = [];
  const used = new Map<string, number>();
  let lastCuisine: string | null = null;

  for (const slot of slots) {
    const meal = pickMeal(shuffled, lastCuisine, used, prefs);

    if (prefs.variety_cuisines && meal.cuisine_type === lastCuisine) {
      warnings.push(
        `${capitalize(slot[0])}: couldn't avoid repeating ${meal.cuisine_type} cuisine — not enough variety.`
      );
    }

    used.set(meal.id, (used.get(meal.id) ?? 0) + 1);
    lastCuisine = meal.cuisine_type;

    // Assign same meal to every day in this slot
    for (const day of slot) {
      days.push({ day, meal });
    }
  }

  const weekStart = getMonday(new Date()).toISOString().split('T')[0];

  return {
    weekPlan: { week_start: weekStart, days },
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Slot builder — groups days into cooking sessions
// ---------------------------------------------------------------------------

function buildSlots(frequency: UserPreferences['cooking_frequency']): Day[][] {
  switch (frequency) {
    case 'every2days':
      // Mon+Tue, Wed+Thu, Fri+Sat, Sun alone
      return [
        ['monday', 'tuesday'],
        ['wednesday', 'thursday'],
        ['friday', 'saturday'],
        ['sunday'],
      ];
    case 'every3days':
      // Mon+Tue+Wed, Thu+Fri+Sat, Sun alone
      return [
        ['monday', 'tuesday', 'wednesday'],
        ['thursday', 'friday', 'saturday'],
        ['sunday'],
      ];
    case 'daily':
    default:
      return DAYS.map((d) => [d]);
  }
}

// ---------------------------------------------------------------------------
// Meal picker
// ---------------------------------------------------------------------------

function pickMeal(
  meals: Meal[],
  lastCuisine: string | null,
  used: Map<string, number>,
  prefs: UserPreferences
): Meal {
  const scored = meals.map((meal) => {
    let score = 0;

    // Penalise same cuisine as previous day
    if (prefs.variety_cuisines && meal.cuisine_type === lastCuisine) {
      score += 100;
    }

    // Prefer meals that share ingredients with already-used meals
    // (lower score = more shared ingredients = preferred)
    if (prefs.shared_ingredients) {
      const sharedCount = countSharedIngredients(meal, meals, used);
      score -= sharedCount * 10;
    }

    // Penalise meals that have been used more
    score += (used.get(meal.id) ?? 0) * 50;

    // Add small random jitter so same-score meals vary
    score += Math.random() * 5;

    return { meal, score };
  });

  scored.sort((a, b) => a.score - b.score);
  return scored[0].meal;
}

function countSharedIngredients(
  candidate: Meal,
  allMeals: Meal[],
  used: Map<string, number>
): number {
  const usedMeals = allMeals.filter((m) => (used.get(m.id) ?? 0) > 0);
  if (usedMeals.length === 0) return 0;

  const candidateIngredients = new Set(
    (candidate.meal_ingredients ?? []).map((i) => i.ingredient.name.toLowerCase().trim())
  );

  let shared = 0;
  for (const meal of usedMeals) {
    for (const ing of (meal.meal_ingredients ?? [])) {
      if (candidateIngredients.has(ing.ingredient.name.toLowerCase().trim())) {
        shared++;
      }
    }
  }
  return shared;
}


