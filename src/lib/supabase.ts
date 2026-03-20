import { createClient } from '@supabase/supabase-js';
import { type Meal, type MealFormData } from '../types/meal';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// Meals
// ---------------------------------------------------------------------------

export async function fetchMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*, ingredients(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Meal[];
}

export async function createMeal(meal: MealFormData): Promise<Meal> {
  const { ingredients, ...mealData } = meal;

  const { data: newMeal, error: mealError } = await supabase
    .from('meals')
    .insert(mealData)
    .select()
    .single();

  if (mealError) throw mealError;

  if (ingredients.length > 0) {
    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredients.map((ing) => ({ ...ing, meal_id: newMeal.id })));

    if (ingError) throw ingError;
  }

  return { ...newMeal, ingredients } as Meal;
}

export async function updateMeal(id: string, meal: MealFormData): Promise<Meal> {
  const { ingredients, ...mealData } = meal;

  const { data: updatedMeal, error: mealError } = await supabase
    .from('meals')
    .update(mealData)
    .eq('id', id)
    .select()
    .single();

  if (mealError) throw mealError;

  // Replace ingredients: delete old, insert new
  await supabase.from('ingredients').delete().eq('meal_id', id);

  if (ingredients.length > 0) {
    const { error: ingError } = await supabase
      .from('ingredients')
      .insert(ingredients.map((ing) => ({ ...ing, meal_id: id })));

    if (ingError) throw ingError;
  }

  return { ...updatedMeal, ingredients } as Meal;
}

export async function deleteMeal(id: string): Promise<void> {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw error;
}