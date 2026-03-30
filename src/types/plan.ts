import { type Meal } from './meal';

export type DayOfWeek =
  | 'monday' | 'tuesday' | 'wednesday'
  | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface WeekPlanDay {
  id: string;
  week_plan_id: string;
  day: DayOfWeek;
  meal_id: string;
  meal: Meal;
}

export interface WeekPlan {
  id: string;
  week_start: string;
  days: WeekPlanDay[];
  created_at: string;
}

export interface ShoppingItem {
  ingredient_id: string;
  ingredient_name: string;
  category_id: string;
  category_name: string;
  quantity: number;
  unit: string;
  meals: string[];
  checked: boolean;
}

export interface ShoppingGroup {
  category_id: string;
  category_name: string;
  items: ShoppingItem[];
}

export interface ShoppingList {
  week_plan_id: string;
  week_start: string;
  groups: ShoppingGroup[];
}