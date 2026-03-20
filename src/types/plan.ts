import { type Meal } from './meal';

export interface DayPlan {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  meal: Meal;
}

export interface WeekPlan {
  id: string;
  week_start: string; // ISO date string
  days: DayPlan[];
  created_at: string;
}

export interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  meals: string[]; // meal names that use this ingredient
}

export interface ShoppingList {
  week_plan_id: string;
  items: ShoppingItem[];
}