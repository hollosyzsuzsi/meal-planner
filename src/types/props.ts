import { type Meal, type MealFormData, type MealIngredientFormRow, type Ingredient, type IngredientCategory, type Unit } from './meal';
import { type WeekPlan, type WeekPlanDay } from './plan';
import { type UserPreferences, type PreferencesFormData } from './prefs';
import { type DayOfWeek } from '../constants/days';

export interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export interface MealFormProps {
  meal?: Meal | null;
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel: () => void;
}

export interface IngredientRowProps {
  row: MealIngredientFormRow;
  idx: number;
  ingredients: Ingredient[];
  categories: IngredientCategory[];
  units: Unit[];
  onSelect: (id: string) => void;
  onUpdate: (patch: Partial<MealIngredientFormRow>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export interface WeekGridProps {
  weekPlan: WeekPlan;
  allMeals: Meal[];
  onSwap: (dayId: string, meal_id: string) => Promise<void>;
}

export interface DayCardProps {
  day: DayOfWeek;
  dayPlan: WeekPlanDay | null;
  allMeals: Meal[];
  onSwap: (dayId: string, meal_id: string) => Promise<void>;
}

export interface PreferencesPanelProps {
  prefs: UserPreferences;
  saving: boolean;
  onSave: (data: PreferencesFormData) => Promise<void>;
}

export interface EditablePlanNameProps {
  name: string;
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
}