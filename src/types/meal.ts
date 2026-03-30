export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'high-protein'
  | 'low-carb';

export type CuisineType =
  | 'italian'
  | 'asian'
  | 'mexican'
  | 'mediterranean'
  | 'american'
  | 'indian'
  | 'middle-eastern'
  | 'other';

export interface IngredientCategory {
  id: string;
  name: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category_id: string;
  category?: IngredientCategory;
}

export interface Unit {
  id: string;
  name: string;
}

export interface MealIngredient {
  id: string;
  meal_id: string;
  ingredient_id: string;
  ingredient: Ingredient;
  quantity: number;
  unit_id: string;
  unit: Unit;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  cuisine_type: CuisineType;
  prep_time: number;
  dietary_tags: DietaryTag[];
  meal_ingredients: MealIngredient[] | null;
  created_at: string;
}

export interface MealIngredientFormRow {
  ingredient_id: string;
  ingredient_name: string; // for display / new ingredient registration
  quantity: number;
  unit_id: string;
  category_id: string;
  isNew: boolean; // true = needs to be created in DB first
}

export interface MealFormData {
  name: string;
  description: string;
  cuisine_type: CuisineType;
  prep_time: number;
  dietary_tags: DietaryTag[];
  ingredients: MealIngredientFormRow[];
}