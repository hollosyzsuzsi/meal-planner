import { useEffect, useState } from 'react';
import { useShopping } from '../hooks/useShopping';
import { usePlanner } from '../hooks/usePlanner';
import { type ShoppingGroup, type ShoppingItem } from '../types/plan';
import { CheckIcon, InfoIcon } from '../components/ui/Icons';
import { EditablePlanName } from '../components/planner/EditablePlanName';
import { CATEGORY_ICONS } from '../constants/categoryIcons';
import { formatWeekLabel } from '../utils/date';

export function ShoppingPage() {
  const { weekPlans, selectedPlan, selectPlan, renamePlan, deletePlan, loadPlans } = usePlanner();
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
  const checkedItems = shoppingList?.groups.reduce(
    (s, g) => s + g.items.filter((i) => i.checked).length, 0
  ) ?? 0;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          {selectedPlan ? (
            <EditablePlanName
              name={selectedPlan.name}
              onRename={(name) => renamePlan(selectedPlan.id, name)}
              onDelete={() => deletePlan(selectedPlan.id)}
            />
          ) : (
            <h1 className="page__title">Shopping list</h1>
          )}
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
              <p className="empty-state__text">
                No ingredients found. Make sure your meals have ingredients added.
              </p>
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
          <ShoppingItemRow
            key={`${item.ingredient_id}-${item.unit}`}
            item={item}
            onToggle={() => onToggle(item.ingredient_id)}
          />
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