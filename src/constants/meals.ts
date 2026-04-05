import { type CuisineType, type DietaryTag } from '../types/meal';

export const CUISINE_TYPES: CuisineType[] = [
  'italian',
  'asian',
  'mexican',
  'mediterranean',
  'american',
  'indian',
  'middle-eastern',
  'other',
];

export const DIETARY_TAGS: DietaryTag[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'high-protein',
  'low-carb',
];

export const TAG_COLORS: Record<DietaryTag, string> = {
  vegetarian: 'tag-green',
  vegan: 'tag-teal',
  'gluten-free': 'tag-amber',
  'dairy-free': 'tag-blue',
  'nut-free': 'tag-coral',
  'high-protein': 'tag-purple',
  'low-carb': 'tag-gray',
};