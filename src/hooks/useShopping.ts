import { useState, useCallback } from 'react';
import { type WeekPlan, type ShoppingList, type ShoppingGroup, type ShoppingItem } from '../types/plan';

export function useShopping() {
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

  const buildFromPlan = useCallback((plan: WeekPlan) => {
    // Merge ingredients across all days, grouped by category
    const merged = new Map<string, ShoppingItem>();

    for (const day of plan.days) {
      for (const mi of (day.meal.meal_ingredients ?? [])) {
        const key = `${mi.ingredient_id}__${mi.unit.id}`;
        const existing = merged.get(key);

        if (existing) {
          existing.quantity += mi.quantity;
          if (!existing.meals.includes(day.meal.name)) {
            existing.meals.push(day.meal.name);
          }
        } else {
          merged.set(key, {
            ingredient_id: mi.ingredient_id,
            ingredient_name: mi.ingredient.name,
            category_id: mi.ingredient.category_id,
            category_name: mi.ingredient.category?.name ?? 'other',
            quantity: mi.quantity,
            unit: mi.unit.name,
            meals: [day.meal.name],
            checked: false,
          });
        }
      }
    }

    // Group by category
    const byCategory = new Map<string, ShoppingGroup>();
    for (const item of merged.values()) {
      const existing = byCategory.get(item.category_id);
      if (existing) {
        existing.items.push(item);
      } else {
        byCategory.set(item.category_id, {
          category_id: item.category_id,
          category_name: item.category_name,
          items: [item],
        });
      }
    }

    const groups: ShoppingGroup[] = Array.from(byCategory.values())
      .map((g) => ({ ...g, items: g.items.sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name)) }))
      .sort((a, b) => a.category_name.localeCompare(b.category_name));

    setShoppingList({ week_plan_id: plan.id, week_start: plan.week_start, groups });
  }, []);

  const toggleItem = useCallback((category_id: string, ingredient_id: string) => {
    setShoppingList((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((g) => {
          if (g.category_id !== category_id) return g;
          return {
            ...g,
            items: g.items.map((item) =>
              item.ingredient_id === ingredient_id ? { ...item, checked: !item.checked } : item
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
        groups: prev.groups.map((g) => ({
          ...g,
          items: g.items.map((item) => ({ ...item, checked: false })),
        })),
      };
    });
  }, []);

  return { shoppingList, buildFromPlan, toggleItem, clearChecked };
}