import { useState, useEffect, useCallback } from 'react';
import { type WeekPlan } from '../types/plan';
import { type ShoppingList, type ShoppingItem } from '../types/plan';
import { buildShoppingList } from '../lib/shopping';
import { supabase } from '../lib/supabase';

interface UseShoppingReturn {
  savedPlans: WeekPlan[];
  selectedPlan: WeekPlan | null;
  shoppingList: ShoppingList | null;
  loadingPlans: boolean;
  selectPlan: (plan: WeekPlan) => void;
  toggleItem: (category: string, itemName: string) => void;
  clearChecked: () => void;
}

export function useShopping(): UseShoppingReturn {
  const [savedPlans, setSavedPlans] = useState<WeekPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WeekPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Load all saved week plans
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('week_plans')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const plans: WeekPlan[] = (data ?? []).map((row) => ({
          id: row.id,
          week_start: row.week_start,
          days: row.plan_json,
          created_at: row.created_at,
        }));

        setSavedPlans(plans);

        // Auto-select the most recent plan
        if (plans.length > 0) {
          selectPlanAndBuild(plans[0]);
        }
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoadingPlans(false);
      }
    };
    load();
  }, []);

  const selectPlanAndBuild = useCallback((plan: WeekPlan) => {
    setSelectedPlan(plan);
    setShoppingList(buildShoppingList(plan));
  }, []);

  const selectPlan = useCallback((plan: WeekPlan) => {
    selectPlanAndBuild(plan);
  }, [selectPlanAndBuild]);

  const toggleItem = useCallback((category: string, itemName: string) => {
    setShoppingList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.category !== category) return group;
          return {
            ...group,
            items: group.items.map((item) =>
              item.name === itemName ? { ...item, checked: !item.checked } : item
            ),
          };
        }),
      };
    });
  }, []);

  const clearChecked = useCallback(() => {
    setShoppingList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((group) => ({
          ...group,
          items: group.items.map((item) => ({ ...item, checked: false })),
        })),
      };
    });
  }, []);

  return {
    savedPlans,
    selectedPlan,
    shoppingList,
    loadingPlans,
    selectPlan,
    toggleItem,
    clearChecked,
  };
}