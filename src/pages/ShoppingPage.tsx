import { useEffect, useState } from 'react';
import { useShopping } from '../hooks/useShopping';
import { usePlanner } from '../hooks/usePlanner';
import { type ShoppingGroup, type ShoppingItem } from '../types/plan';
import { type WeekPlan } from '../types/plan';

const CATEGORY_ICONS: Record<string, string> = {
  'produce': '🥦', 'meat & fish': '🥩', 'dairy & eggs': '🥛',
  'grains & pasta': '🌾', 'canned & dry': '🥫',
  'condiments & spices': '🧂', 'other': '🛒',
};

export function ShoppingPage() {
  const { weekPlans, selectedPlan, selectPlan, loadPlans } = usePlanner();
  const { shoppingList, buildFromPlan, toggleItem, clearChecked } = useShopping();
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const load = async () => {
      await loadPlans();
      setLoadingPlans(false);
    };
    load();
  }, [loadPlans]);

  useEffect(() => {
    if (selectedPlan) buildFromPlan(selectedPlan);
  }, [selectedPlan, buildFromPlan]);

  const totalItems = shoppingList?.groups.reduce((s, g) => s + g.items.length, 0) ?? 0;
  const checkedItems = shoppingList?.groups.reduce((s, g) => s + g.items.filter((i) => i.checked).length, 0) ?? 0;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Shopping list</h1>
          {shoppingList && (
            <p className="page__subtitle">{checkedItems} of {totalItems} items checked</p>
          )}
        </div>
        {checkedItems > 0 && (
          <button className="btn btn--ghost" onClick={clearChecked}>Uncheck all</button>
        )}
      </div>

      {loadingPlans ? (
        <p className="state-msg">Loading plans…</p>
      ) : weekPlans.length === 0 ? (
        <div className="banner banner--info">
          <InfoIcon />
          <span>No saved plans yet. Generate a weekly plan first.</span>
        </div>
      ) : (
        <div className="plan-selector">
          <span className="plan-selector__label">Plan</span>
          <div className="plan-selector__options">
            {weekPlans.map((plan) => (
              <button
                key={plan.id}
                className={`plan-pill ${selectedPlan?.id === plan.id ? 'plan-pill--active' : ''}`}
                onClick={() => selectPlan(plan)}
              >
                {formatWeekLabel(plan.week_start)}
              </button>
            ))}
          </div>
        </div>
      )}

      {shoppingList && (
        <div className="shopping-list">
          {shoppingList.groups.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state__text">No ingredients found. Make sure your meals have ingredients added.</p>
            </div>
          ) : (
            shoppingList.groups.map((group) => (
              <ShoppingGroupSection
                key={group.category_id}
                group={group}
                onToggle={(ingredient_id) => toggleItem(group.category_id, ingredient_id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ShoppingGroupSection({ group, onToggle }: { group: ShoppingGroup; onToggle: (id: string) => void }) {
  const allChecked = group.items.every((i) => i.checked);
  return (
    <div className={`shopping-group ${allChecked ? 'shopping-group--done' : ''}`}>
      <div className="shopping-group__header">
        <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[group.category_name] ?? '🛒'}</span>
        <h3 className="shopping-group__title">{group.category_name}</h3>
        <span className="shopping-group__count">
          {group.items.filter((i) => i.checked).length}/{group.items.length}
        </span>
      </div>
      <ul className="shopping-group__items">
        {group.items.map((item) => (
          <ShoppingItemRow key={`${item.ingredient_id}-${item.unit}`} item={item} onToggle={() => onToggle(item.ingredient_id)} />
        ))}
      </ul>
    </div>
  );
}

function ShoppingItemRow({ item, onToggle }: { item: ShoppingItem; onToggle: () => void }) {
  return (
    <li className={`shopping-item ${item.checked ? 'shopping-item--checked' : ''}`}>
      <button
        className={`shopping-checkbox ${item.checked ? 'shopping-checkbox--checked' : ''}`}
        onClick={onToggle}
      >
        {item.checked && <CheckIcon />}
      </button>
      <div className="shopping-item__content">
        <span className="shopping-item__name">{item.ingredient_name}</span>
        <span className="shopping-item__meals">{item.meals.join(', ')}</span>
      </div>
      <span className="shopping-item__qty">
        {item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(1)} {item.unit}
      </span>
    </li>
  );
}

function formatWeekLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const end = new Date(date);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(date)} – ${fmt(end)}`;
}

function CheckIcon() {
  return <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function InfoIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5.5v.5" strokeLinecap="round"/></svg>;
}