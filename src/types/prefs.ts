export type CookingFrequency = 'daily' | 'every2days' | 'every3days';

export interface UserPreferences {
  id: string;
  variety_cuisines: boolean;     
  shared_ingredients: boolean;    
  cooking_frequency: CookingFrequency; 
}

export type PreferencesFormData = Omit<UserPreferences, 'id'>;

