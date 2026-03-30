import { useState, useEffect, useCallback } from 'react';
import { type Meal, type MealFormData } from '../types/meal';
import { fetchMeals, createMeal, updateMeal, deleteMeal, createIngredient } from '../lib/supabase';

interface UseMealsReturn {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  addMeal: (data: MealFormData) => Promise<void>;
  editMeal: (id: string, data: MealFormData) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
}

export function useMeals(): UseMealsReturn {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMeals();
      setMeals(data as Meal[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resolveIngredients = async (data: MealFormData) => {
    const resolved = [];
    for (const row of data.ingredients) {
      // Existing ingredient — just needs a valid id and unit
      if (!row.isNew) {
        if (row.ingredient_id && row.unit_id) {
          resolved.push({ ingredient_id: row.ingredient_id, quantity: row.quantity, unit_id: row.unit_id });
        }
        continue;
      }
      // New ingredient — create it first
      if (row.ingredient_name.trim() && row.category_id && row.unit_id) {
        const created = await createIngredient(row.ingredient_name, row.category_id);
        resolved.push({ ingredient_id: created.id, quantity: row.quantity, unit_id: row.unit_id });
      }
    }
    return resolved;
  };

  const addMeal = async (data: MealFormData) => {
    const ingredients = await resolveIngredients(data);
    const { ingredients: _, ...mealData } = data;
    const newMeal = await createMeal(mealData, ingredients);
    setMeals((prev) => [newMeal as Meal, ...prev]);
  };

  const editMeal = async (id: string, data: MealFormData) => {
    const ingredients = await resolveIngredients(data);
    const { ingredients: _, ...mealData } = data;
    const updated = await updateMeal(id, mealData, ingredients);
    setMeals((prev) => prev.map((m) => (m.id === id ? (updated as Meal) : m)));
  };

  const removeMeal = async (id: string) => {
    await deleteMeal(id);
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return { meals, loading, error, addMeal, editMeal, removeMeal };
}