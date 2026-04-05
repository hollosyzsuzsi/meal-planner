import { MealsIcon, PlannerIcon, ShoppingIcon } from "../components/ui/Icons";
import type { Page } from "../types/page";
import { MealsPage } from '../pages/MealsPage';
import { PlannerPage } from '../pages/PlannerPage';
import { ShoppingPage } from '../pages/ShoppingPage';

export const NAV_ITEMS = [
  { id: 'meals',    label: 'My meals',       icon: MealsIcon },
  { id: 'planner',  label: 'Weekly plan',    icon: PlannerIcon },
  { id: 'shopping', label: 'Shopping list',  icon: ShoppingIcon },
] as const;

export const PAGES: Record<Page, React.ReactNode> = {
  meals:    <MealsPage />,
  planner:  <PlannerPage />,
  shopping: <ShoppingPage />,
};