import { useState, useCallback } from 'react';
import { type Meal } from '../types/meal';
import { type WeekPlan, type DayOfWeek } from '../types/plan';
import { type UserPreferences } from '../types/prefs';
import { generateWeekPlan } from '../lib/planner';
import { fetchWeekPlans, createWeekPlan, updateWeekPlanDay } from '../lib/supabase';

interface UsePlannerReturn {
  weekPlans: WeekPlan[];
  selectedPlan: WeekPlan | null;
  generating: boolean;
  warnings: string[];
  error: string | null;
  generate: (meals: Meal[], prefs: UserPreferences) => Promise<void>;
  selectPlan: (plan: WeekPlan) => void;
  swapMeal: (dayId: string, meal_id: string) => Promise<void>;
  loadPlans: () => Promise<void>;
}

export function usePlanner(): UsePlannerReturn {
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WeekPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    try {
      const data = await fetchWeekPlans();
      const plans = data as WeekPlan[];
      setWeekPlans(plans);
      if (plans.length > 0 && !selectedPlan) setSelectedPlan(plans[0]);
    } catch (err) {
      console.error('Failed to load plans', err);
    }
  }, [selectedPlan]);

  const generate = useCallback(async (meals: Meal[], prefs: UserPreferences) => {
    try {
      setGenerating(true);
      setError(null);
      setWarnings([]);

      const { weekPlan: plan, warnings: w } = generateWeekPlan(meals, prefs);

      const saved = await createWeekPlan(
        plan.week_start,
        plan.days.map((d) => ({ day: d.day, meal_id: d.meal.id }))
      );

      const newPlan = saved as WeekPlan;
      setWeekPlans((prev) => [newPlan, ...prev]);
      setSelectedPlan(newPlan);
      setWarnings(w);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  }, []);

  const selectPlan = useCallback((plan: WeekPlan) => {
    setSelectedPlan(plan);
  }, []);

  const swapMeal = useCallback(async (dayId: string, meal_id: string) => {
    await updateWeekPlanDay(dayId, meal_id);
    // Refresh plans to get updated meal data
    const data = await fetchWeekPlans();
    const plans = data as WeekPlan[];
    setWeekPlans(plans);
    const updated = plans.find((p) => p.days.some((d) => d.id === dayId));
    if (updated) setSelectedPlan(updated);
  }, []);

  return { weekPlans, selectedPlan, generating, warnings, error, generate, selectPlan, swapMeal, loadPlans };
}