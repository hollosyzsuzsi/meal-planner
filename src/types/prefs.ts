export type CookingFrequency = 'daily' | 'every2days' | 'every3days';

export interface UserPreferences {
  id: string;
  variety_cuisines: boolean;      // avoid same cuisine type across the week
  shared_ingredients: boolean;    // prefer meals that share ingredients
  cooking_frequency: CookingFrequency; // how often user wants to cook
}

export type PreferencesFormData = Omit<UserPreferences, 'id'>;

export const DEFAULT_PREFERENCES: PreferencesFormData = {
  variety_cuisines: true,
  shared_ingredients: false,
  cooking_frequency: 'daily',
};