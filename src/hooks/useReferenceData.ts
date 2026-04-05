import { useState, useEffect } from 'react';
import { type IngredientCategory, type Ingredient, type Unit } from '../types/meal';
import { type UseReferenceDataReturn } from '../types/hooks';
import { fetchCategories, fetchUnits, fetchIngredients, createIngredient } from '../lib/supabase';

export function useReferenceData(): UseReferenceDataReturn {
  const [categories, setCategories] = useState<IngredientCategory[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, units, ings] = await Promise.all([
          fetchCategories(),
          fetchUnits(),
          fetchIngredients(),
        ]);
        setCategories(cats as IngredientCategory[]);
        setUnits(units as Unit[]);
        setIngredients(ings as Ingredient[]);
      } catch (err) {
        console.error('Failed to load reference data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const registerIngredient = async (name: string, category_id: string): Promise<Ingredient> => {
    const created = await createIngredient(name, category_id);
    setIngredients((prev) => [...prev, created as Ingredient].sort((a, b) => a.name.localeCompare(b.name)));
    return created as Ingredient;
  };

  return { categories, units, ingredients, loading, registerIngredient };
}