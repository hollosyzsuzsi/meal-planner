import { useState, useCallback } from 'react';
import { type Meal } from '../types/meal';
import { type WeekPlan } from '../types/plan';
import { type UserPreferences } from '../types/prefs';
import { generateWeekPlan } from '../lib/planner';
import { supabase } from '../lib/supabase';

interface UsePlannerReturn {
  weekPlan: WeekPlan | null;
  generating: boolean;
  warnings: string[];
  error: string | null;
  generate: (meals: Meal[], prefs: UserPreferences) => Promise<void>;
  clearPlan: () => void;
  loadLatestPlan: () => Promise<void>;
}

export function usePlanner(): UsePlannerReturn {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (meals: Meal[], prefs: UserPreferences) => {
    try {
      setGenerating(true);
      setError(null);
      setWarnings([]);

      // Runs locally — no API call needed
      const { weekPlan: plan, warnings: w } = generateWeekPlan(meals, prefs);

      // Persist to Supabase
      const { data, error: dbError } = await supabase
        .from('week_plans')
        .insert({
          week_start: plan.week_start,
          plan_json: plan.days,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setWeekPlan({ ...plan, id: data.id, created_at: data.created_at });
      setWarnings(w);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setGenerating(false);
    }
  }, []);

  const loadLatestPlan = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabase
        .from('week_plans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (dbError || !data) return;

      setWeekPlan({
        id: data.id,
        week_start: data.week_start,
        days: data.plan_json,
        created_at: data.created_at,
      });
    } catch {
      // No plan yet — that's fine
    }
  }, []);

  const clearPlan = useCallback(() => {
    setWeekPlan(null);
    setWarnings([]);
    setError(null);
  }, []);

  return { weekPlan, generating, warnings, error, generate, clearPlan, loadLatestPlan };
}