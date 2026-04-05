import { useState, useCallback } from 'react';
import { type Meal } from '../types/meal';
import { type UsePlannerReturn } from '../types/hooks';
import { type WeekPlan } from '../types/plan';
import { type UserPreferences } from '../types/prefs';
import { generateWeekPlan } from '../lib/planner';
import { fetchWeekPlans, createWeekPlan, updateWeekPlanDay, renameWeekPlan, deleteWeekPlan } from '../lib/supabase';
import { formatWeekLabel } from '../utils/date';

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

      // Auto-generate a name from the week date
      const name = `Week of ${formatWeekLabel(plan.week_start)}`;

      const saved = await createWeekPlan(
        plan.week_start,
        name,
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
    const data = await fetchWeekPlans();
    const plans = data as WeekPlan[];
    setWeekPlans(plans);
    const updated = plans.find((p) => p.days.some((d) => d.id === dayId));
    if (updated) setSelectedPlan(updated);
  }, []);

  const renamePlan = useCallback(async (id: string, name: string) => {
    await renameWeekPlan(id, name);
    const update = (plans: WeekPlan[]) =>
      plans.map((p) => (p.id === id ? { ...p, name } : p));
    setWeekPlans((prev) => update(prev));
    setSelectedPlan((prev) => (prev?.id === id ? { ...prev, name } : prev));
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    await deleteWeekPlan(id);
    setWeekPlans((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      setSelectedPlan((cur) => {
        if (cur?.id !== id) return cur;
        return remaining[0] ?? null;
      });
      return remaining;
    });
  }, []);

  return {
    weekPlans, selectedPlan, generating, warnings, error,
    generate, selectPlan, swapMeal, renamePlan, deletePlan, loadPlans,
  };
}