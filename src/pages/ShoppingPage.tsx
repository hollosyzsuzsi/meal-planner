import { useShopping } from '../hooks/useShopping';
import { type ShoppingGroup, type ShoppingItem, type IngredientCategory } from '../types/plan';

const CATEGORY_ICONS: Record<IngredientCategory, string> = {
  'produce': '🥦',
  'meat & fish': '🥩',
  'dairy & eggs': '🥛',
  'grains & pasta': '🌾',
  'canned & dry': '🥫',
  'condiments & spices': '🧂',
  'other': '🛒',
};

export function ShoppingPage() {
  const {
    savedPlans,
    selectedPlan,
    shoppingList,
    loadingPlans,
    selectPlan,
    toggleItem,
    clearChecked,
  } = useShopping();

  const totalItems = shoppingList?.groups.reduce((sum, g) => sum + g.items.length, 0) ?? 0;
  const checkedItems = shoppingList?.groups.reduce(
    (sum, g) => sum + g.items.filter((i) => i.checked).length, 0
  ) ?? 0;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Shopping list</h1>
          {shoppingList && (
            <p className="page__subtitle">
              {checkedItems} of {totalItems} items checked
            </p>
          )}
        </div>
        {checkedItems > 0 && (
          <button className="btn btn--ghost" onClick={clearChecked}>
            Uncheck all
          </button>
        )}
      </div>

      {/* Plan selector */}
      {loadingPlans ? (
        <p className="state-msg">Loading saved plans…</p>
      ) : savedPlans.length === 0 ? (
        <div className="banner banner--info">
          <InfoIcon />
          <span>No saved plans yet. Generate a weekly plan first, then come back here.</span>
        </div>
      ) : (
        <div className="plan-selector">
          <span className="plan-selector__label">Plan</span>
          <div className="plan-selector__options">
            {savedPlans.map((plan) => (
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

      {/* Shopping list */}
      {shoppingList && (
        <div className="shopping-list">
          {shoppingList.groups.map((group) => (
            <ShoppingGroupSection
              key={group.category}
              group={group}
              onToggle={(itemName) => toggleItem(group.category, itemName)}
            />
          ))}

          {shoppingList.groups.length === 0 && (
            <div className="empty-state">
              <p className="empty-state__text">
                No ingredients found. Make sure your meals have ingredients added.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shopping group section
// ---------------------------------------------------------------------------

interface ShoppingGroupSectionProps {
  group: ShoppingGroup;
  onToggle: (itemName: string) => void;
}

function ShoppingGroupSection({ group, onToggle }: ShoppingGroupSectionProps) {
  const allChecked = group.items.every((i) => i.checked);
  const someChecked = group.items.some((i) => i.checked);

  return (
    <div className={`shopping-group ${allChecked ? 'shopping-group--done' : ''}`}>
      <div className="shopping-group__header">
        <span className="shopping-group__icon" style={{ fontSize: 16 }}>
          {CATEGORY_ICONS[group.category]}
        </span>
        <h3 className="shopping-group__title">{group.category}</h3>
        <span className="shopping-group__count">
          {group.items.filter((i) => i.checked).length}/{group.items.length}
        </span>
      </div>
      <ul className="shopping-group__items">
        {group.items.map((item) => (
          <ShoppingItemRow key={item.name} item={item} onToggle={() => onToggle(item.name)} />
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shopping item row
// ---------------------------------------------------------------------------

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onToggle: () => void;
}

function ShoppingItemRow({ item, onToggle }: ShoppingItemRowProps) {
  return (
    <li className={`shopping-item ${item.checked ? 'shopping-item--checked' : ''}`}>
      <button
        className={`shopping-checkbox ${item.checked ? 'shopping-checkbox--checked' : ''}`}
        onClick={onToggle}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
      >
        {item.checked && <CheckIcon />}
      </button>
      <div className="shopping-item__content">
        <span className="shopping-item__name">{item.name}</span>
        <span className="shopping-item__meals">{item.meals.join(', ')}</span>
      </div>
      <span className="shopping-item__qty">
        {formatQuantity(item.quantity)} {item.unit}
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatWeekLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const end = new Date(date);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(date)} – ${fmt(end)}`;
}

function formatQuantity(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1);
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7v4M8 5.5v.5" strokeLinecap="round" />
    </svg>
  );
}