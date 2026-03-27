import { type Meal } from './meal';

export interface DayPlan {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meal: Meal;
}

export interface WeekPlan {
  id: string;
  week_start: string;
  days: DayPlan[];
  created_at: string;
}

export type IngredientCategory =
  | 'produce'
  | 'meat & fish'
  | 'dairy & eggs'
  | 'grains & pasta'
  | 'canned & dry'
  | 'condiments & spices'
  | 'other';

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  meals: string[];   // meal names that use this ingredient
  checked: boolean;
}

export interface ShoppingGroup {
  category: IngredientCategory;
  items: ShoppingItem[];
}

export interface ShoppingList {
  week_plan_id: string;
  week_start: string;
  groups: ShoppingGroup[];
}