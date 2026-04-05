import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Reference data ───────────────────────────────────────────────────────────

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('ingredient_categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function fetchUnits() {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

// ─── Ingredients ──────────────────────────────────────────────────────────────

export async function fetchIngredients() {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*, category:ingredient_categories(id, name)')
    .order('name');
  if (error) throw error;
  return data;
}

export async function createIngredient(name: string, category_id: string) {
  const { data, error } = await supabase
    .from('ingredients')
    .insert({ name: name.trim(), category_id })
    .select('*, category:ingredient_categories(id, name)')
    .single();
  if (error) throw error;
  return data;
}

// ─── Meals ────────────────────────────────────────────────────────────────────

const MEAL_SELECT = `
  *,
  meal_ingredients!fk_meal_ingredient_meal (
    id, quantity, meal_id, unit_id, ingredient_id,
    ingredient:ingredients!fk_meal_ingredient_ingredient (
      id, name, category_id,
      category:ingredient_categories!fk_ingredient_category (id, name)
    ),
    unit:units!fk_meal_ingredient_unit (id, name)
  )
`;

export async function fetchMeals() {
  const { data, error } = await supabase
    .from('meals')
    .select(MEAL_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createMeal(
  meal: { name: string; description: string; cuisine_type: string; prep_time: number; dietary_tags: string[] },
  ingredients: { ingredient_id: string; quantity: number; unit_id: string }[]
) {
  const { data: newMeal, error: mealError } = await supabase
    .from('meals')
    .insert(meal)
    .select()
    .single();
  if (mealError) throw mealError;

  if (ingredients.length > 0) {
    const { error: ingError } = await supabase
      .from('meal_ingredients')
      .insert(ingredients.map((i) => ({ ...i, meal_id: newMeal.id })));
    if (ingError) throw ingError;
  }

  const { data, error } = await supabase
    .from('meals')
    .select(MEAL_SELECT)
    .eq('id', newMeal.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateMeal(
  id: string,
  meal: { name: string; description: string; cuisine_type: string; prep_time: number; dietary_tags: string[] },
  ingredients: { ingredient_id: string; quantity: number; unit_id: string }[]
) {
  const { error: mealError } = await supabase
    .from('meals')
    .update(meal)
    .eq('id', id);
  if (mealError) throw mealError;

  // Replace all meal_ingredients
  await supabase.from('meal_ingredients').delete().eq('meal_id', id);

  if (ingredients.length > 0) {
    const { error: ingError } = await supabase
      .from('meal_ingredients')
      .insert(ingredients.map((i) => ({ ...i, meal_id: id })));
    if (ingError) throw ingError;
  }

  const { data, error } = await supabase
    .from('meals')
    .select(MEAL_SELECT)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMeal(id: string) {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
}

// ─── Week plans ───────────────────────────────────────────────────────────────

const PLAN_SELECT = `
  *,
  days:week_plan_days!fk_week_plan_day_plan (
    id, day, meal_id,
    meal:meals!fk_week_plan_day_meal (
      *,
      meal_ingredients!fk_meal_ingredient_meal (
        id, quantity, meal_id, unit_id, ingredient_id,
        ingredient:ingredients!fk_meal_ingredient_ingredient (
          id, name, category_id,
          category:ingredient_categories!fk_ingredient_category (id, name)
        ),
        unit:units!fk_meal_ingredient_unit (id, name)
      )
    )
  )
`;

export async function fetchWeekPlans() {
  const { data, error } = await supabase
    .from('week_plans')
    .select(PLAN_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createWeekPlan(
  week_start: string,
  name: string,
  days: { day: string; meal_id: string }[]
) {
  const { data: plan, error: planError } = await supabase
    .from('week_plans')
    .insert({ week_start, name })
    .select()
    .single();
  if (planError) throw planError;

  const { error: daysError } = await supabase
    .from('week_plan_days')
    .insert(days.map((d) => ({ ...d, week_plan_id: plan.id })));
  if (daysError) throw daysError;

  const { data, error } = await supabase
    .from('week_plans')
    .select(PLAN_SELECT)
    .eq('id', plan.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateWeekPlanDay(dayId: string, meal_id: string) {
  const { error } = await supabase
    .from('week_plan_days')
    .update({ meal_id })
    .eq('id', dayId);
  if (error) throw error;
}

export async function renameWeekPlan(id: string, name: string) {
  const { error } = await supabase
    .from('week_plans')
    .update({ name })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteWeekPlan(id: string) {
  const { error } = await supabase
    .from('week_plans')
    .delete()
    .eq('id', id);
  if (error) throw error;
}