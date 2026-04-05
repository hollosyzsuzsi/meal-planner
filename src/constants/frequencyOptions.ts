import type { CookingFrequency } from "../types/prefs";

export const FREQUENCY_OPTIONS: { value: CookingFrequency; label: string; description: string }[] = [
  {
    value: 'daily',
    label: 'Every day',
    description: 'A different meal assigned to each day',
  },
  {
    value: 'every2days',
    label: 'Every 2 days',
    description: 'Cook once, eat the same meal two days in a row',
  },
  {
    value: 'every3days',
    label: 'Every 3 days',
    description: 'Cook once, eat the same meal three days in a row',
  },
];