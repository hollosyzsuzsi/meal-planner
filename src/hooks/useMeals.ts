import { useState, useEffect, useCallback } from 'react';
import { type Meal, type MealFormData } from '../types/meal';
import { fetchMeals, createMeal, updateMeal, deleteMeal } from '../lib/supabase';

interface UseMealsReturn {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  addMeal: (data: MealFormData) => Promise<void>;
  editMeal: (id: string, data: MealFormData) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
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
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addMeal = async (data: MealFormData) => {
    const newMeal = await createMeal(data);
    setMeals((prev) => [newMeal, ...prev]);
  };

  const editMeal = async (id: string, data: MealFormData) => {
    const updated = await updateMeal(id, data);
    setMeals((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  const removeMeal = async (id: string) => {
    await deleteMeal(id);
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return { meals, loading, error, addMeal, editMeal, removeMeal, refresh: load };
}