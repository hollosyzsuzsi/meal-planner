import { type CuisineType, type DietaryTag } from './meal';

export interface UserPreferences {
  id: string;
  variety_mode: boolean;         // avoid repeating cuisine types
  shared_ingredients: boolean;   // prefer meals sharing ingredients
  dietary_filters: DietaryTag[];
  excluded_cuisines: CuisineType[];
  max_prep_time: number | null;  // minutes, null = no limit
}

export type PreferencesFormData = Omit<UserPreferences, 'id'>;