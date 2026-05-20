import { type MealCardProps } from '../../types/props';
import { TAG_COLORS } from '../../constants/meals';
import { EditIcon, TrashIcon, ClockIcon } from '../ui/Icons';

export function MealCard({ meal, onEdit, onDelete, onView }: MealCardProps) {
  return (
    <article
      className="meal-card meal-card--clickable"
      onClick={() => onView?.(meal)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onView?.(meal); }}
      aria-label={`View ${meal.name}`}
    >
      <div className="meal-card__header">
        <div>
          <h3 className="meal-card__name">{meal.name}</h3>
          <span className="meal-card__cuisine">{meal.cuisine_type}</span>
        </div>
        <div className="meal-card__actions">
          <button
            className="btn-icon"
            onClick={(e) => { e.stopPropagation(); onEdit(meal); }}
            aria-label="Edit meal"
          >
            <EditIcon />
          </button>
          <button
            className="btn-icon btn-icon--danger"
            onClick={(e) => { e.stopPropagation(); onDelete(meal.id); }}
            aria-label="Delete meal"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {meal.description && (
        <p className="meal-card__description">{meal.description}</p>
      )}

      <div className="meal-card__meta">
        <span className="meal-card__prep-time">
          <ClockIcon />
          {meal.prep_time} min
        </span>
        <span className="meal-card__ingredient-count">
          {(meal.meal_ingredients ?? []).length} ingredient{(meal.meal_ingredients ?? []).length !== 1 ? 's' : ''}
        </span>
      </div>

      {meal.dietary_tags.length > 0 && (
        <div className="meal-card__tags">
          {meal.dietary_tags.map((tag) => (
            <span key={tag} className={`tag ${TAG_COLORS[tag]}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}