import { type Meal } from '../../types/meal';
import { TAG_COLORS } from '../../constants/meals';
import { CATEGORY_ICONS } from '../../constants/categoryIcons';
import { ClockIcon, EditIcon } from '../ui/Icons';

interface MealDetailModalProps {
  meal: Meal;
  onClose: () => void;
  onEdit: (meal: Meal) => void;
}

export function MealDetailModal({ meal, onClose, onEdit }: MealDetailModalProps) {
  const ingredients = meal.meal_ingredients ?? [];

  // Group ingredients by category
  const byCategory = new Map<string, { categoryName: string; items: typeof ingredients }>();
  for (const mi of ingredients) {
    const catName = mi.ingredient.category?.name ?? 'other';
    const existing = byCategory.get(catName);
    if (existing) {
      existing.items.push(mi);
    } else {
      byCategory.set(catName, { categoryName: catName, items: [mi] });
    }
  }
  const groups = Array.from(byCategory.values()).sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={meal.name}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal__header">
          <div className="modal__title-block">
            <h2 className="modal__title">{meal.name}</h2>
            <span className="meal-card__cuisine">{meal.cuisine_type}</span>
          </div>
          <div className="modal__header-actions">
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => { onClose(); onEdit(meal); }}
            >
              <EditIcon /> Edit
            </button>
            <button className="btn-icon" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="meal-card__meta modal__meta">
          <span className="meal-card__prep-time">
            <ClockIcon /> {meal.prep_time} min
          </span>
          {ingredients.length > 0 && (
            <span>{ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Tags */}
        {meal.dietary_tags.length > 0 && (
          <div className="meal-card__tags">
            {meal.dietary_tags.map((tag) => (
              <span key={tag} className={`tag ${TAG_COLORS[tag]}`}>{tag}</span>
            ))}
          </div>
        )}

        {/* Description */}
        {meal.description && (
          <p className="modal__description">{meal.description}</p>
        )}

        {/* Ingredients */}
        {groups.length > 0 && (
          <div className="modal__ingredients">
            <h3 className="modal__section-title">Ingredients</h3>
            {groups.map(({ categoryName, items }) => (
              <div key={categoryName} className="modal__ing-group">
                <div className="modal__ing-category">
                  <span>{CATEGORY_ICONS[categoryName] ?? '🧂'}</span>
                  <span>{categoryName}</span>
                </div>
                <ul className="modal__ing-list">
                  {items.map((mi) => (
                    <li key={mi.id} className="modal__ing-item">
                      <span className="modal__ing-name">{mi.ingredient.name}</span>
                      <span className="modal__ing-qty">
                        {mi.quantity} {mi.unit.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {ingredients.length === 0 && (
          <p className="modal__empty">No ingredients added yet.</p>
        )}
      </div>
    </div>
  );
}