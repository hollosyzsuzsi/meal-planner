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

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  cuisine_type: CuisineType;
  prep_time: number; // minutes
  dietary_tags: DietaryTag[];
  ingredients: Ingredient[];
  created_at: string;
}

export type MealFormData = Omit<Meal, 'id' | 'created_at'>;