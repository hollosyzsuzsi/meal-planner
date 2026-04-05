import { type Meal, type MealFormData, type Ingredient, type IngredientCategory, type Unit } from './meal';
import { type WeekPlan } from './plan';
import { type UserPreferences, type PreferencesFormData } from './prefs';

export interface UseMealsReturn {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  addMeal: (data: MealFormData) => Promise<void>;
  editMeal: (id: string, data: MealFormData) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
}

export interface UsePlannerReturn {
  weekPlans: WeekPlan[];
  selectedPlan: WeekPlan | null;
  generating: boolean;
  warnings: string[];
  error: string | null;
  generate: (meals: Meal[], prefs: UserPreferences) => Promise<void>;
  selectPlan: (plan: WeekPlan) => void;
  swapMeal: (dayId: string, meal_id: string) => Promise<void>;
  renamePlan: (id: string, name: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  loadPlans: () => Promise<void>;
}

export interface UsePreferencesReturn {
  prefs: UserPreferences | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  savePrefs: (data: PreferencesFormData) => Promise<void>;
}

export interface UseReferenceDataReturn {
  categories: IngredientCategory[];
  units: Unit[];
  ingredients: Ingredient[];
  loading: boolean;
  registerIngredient: (name: string, category_id: string) => Promise<Ingredient>;
}