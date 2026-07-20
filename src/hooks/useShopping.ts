import { useState, useCallback } from 'react';
import { type WeekPlan, type ShoppingList, type ShoppingGroup, type ShoppingItem } from '../types/plan';

// ---------------------------------------------------------------------------
// Unit normalisation
// ---------------------------------------------------------------------------

type UnitFamily = 'weight' | 'volume' | 'spoon' | 'count';

interface NormalisedAmount {
  family: UnitFamily;
  baseValue: number; // grams for weight, ml for volume, original value otherwise
}

// How many base units (g / ml) one of these equals
const TO_BASE: Record<string, { family: UnitFamily; factor: number }> = {
  g:       { family: 'weight', factor: 1 },
  kg:      { family: 'weight', factor: 1000 },
  ml:      { family: 'volume', factor: 1 },
  l:       { family: 'volume', factor: 1000 },
  // Spoon/cup units: kept separate family, no cross-conversion with ml
  tsp:     { family: 'spoon', factor: 1 },
  tbsp:    { family: 'spoon', factor: 3 },   // 1 tbsp = 3 tsp
  cup:     { family: 'spoon', factor: 48 },  // 1 cup = 48 tsp
  // Countable — each unit is its own family so they never merge across types
  piece:   { family: 'count', factor: 1 },
  pinch:   { family: 'count', factor: 1 },
  slice:   { family: 'count', factor: 1 },
  handful: { family: 'count', factor: 1 },
  bunch:   { family: 'count', factor: 1 },
};

function normalise(quantity: number, unitName: string): NormalisedAmount {
  const entry = TO_BASE[unitName.toLowerCase()];
  if (!entry) return { family: 'count', baseValue: quantity };
  return { family: entry.family, baseValue: quantity * entry.factor };
}

function formatAmount(baseValue: number, family: UnitFamily, originalUnit: string): { quantity: number; unit: string } {
  if (family === 'weight') {
    if (baseValue >= 1000) return { quantity: Math.round((baseValue / 1000) * 100) / 100, unit: 'kg' };
    if (baseValue >= 100)  return { quantity: Math.round(baseValue / 10), unit: 'dkg' };
    return { quantity: Math.round(baseValue), unit: 'g' };
  }
  if (family === 'volume') {
    if (baseValue >= 1000) return { quantity: Math.round((baseValue / 1000) * 100) / 100, unit: 'l' };
    return { quantity: Math.round(baseValue), unit: 'ml' };
  }
  if (family === 'spoon') {
    // Display in the largest clean unit
    if (baseValue >= 48 && baseValue % 48 === 0) return { quantity: baseValue / 48, unit: 'cup' };
    if (baseValue >= 3)  return { quantity: Math.round((baseValue / 3) * 10) / 10, unit: 'tbsp' };
    return { quantity: baseValue, unit: 'tsp' };
  }
  // count family — keep original unit name
  return { quantity: baseValue, unit: originalUnit };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

// Accumulator keyed by `ingredientId__unitFamily`
interface Accumulator {
  ingredient_id: string;
  ingredient_name: string;
  category_id: string;
  category_name: string;
  family: UnitFamily;
  baseValue: number;
  originalUnit: string; // unit name of the first entry (for count family display)
  meals: string[];
}

export function useShopping() {
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);

  const buildFromPlan = useCallback((plan: WeekPlan) => {
    const accumulators = new Map<string, Accumulator>();

    for (const day of plan.days) {
      for (const mi of (day.meal.meal_ingredients ?? [])) {
        const { family, baseValue } = normalise(mi.quantity, mi.unit.name);

        // Merge key: same ingredient + same unit family (weight stays with weight, etc.)
        const key = `${mi.ingredient_id}__${family}`;
        const existing = accumulators.get(key);

        if (existing) {
          existing.baseValue += baseValue;
          if (!existing.meals.includes(day.meal.name)) {
            existing.meals.push(day.meal.name);
          }
        } else {
          accumulators.set(key, {
            ingredient_id: mi.ingredient_id,
            ingredient_name: mi.ingredient.name,
            category_id: mi.ingredient.category_id,
            category_name: mi.ingredient.category?.name ?? 'other',
            family,
            baseValue,
            originalUnit: mi.unit.name,
            meals: [day.meal.name],
          });
        }
      }
    }

    // Convert accumulators → ShoppingItems
    const merged = new Map<string, ShoppingItem>();
    for (const [key, acc] of accumulators) {
      const { quantity, unit } = formatAmount(acc.baseValue, acc.family, acc.originalUnit);
      merged.set(key, {
        ingredient_id: acc.ingredient_id,
        ingredient_name: acc.ingredient_name,
        category_id: acc.category_id,
        category_name: acc.category_name,
        quantity,
        unit,
        meals: acc.meals,
        checked: false,
      });
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