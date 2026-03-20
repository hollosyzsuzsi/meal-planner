import { type Meal, type DietaryTag } from '../../types/meal';

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

const TAG_COLORS: Record<DietaryTag, string> = {
  vegetarian: 'tag-green',
  vegan: 'tag-teal',
  'gluten-free': 'tag-amber',
  'dairy-free': 'tag-blue',
  'nut-free': 'tag-coral',
  'high-protein': 'tag-purple',
  'low-carb': 'tag-gray',
};

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  return (
    <article className="meal-card">
      <div className="meal-card__header">
        <div>
          <h3 className="meal-card__name">{meal.name}</h3>
          <span className="meal-card__cuisine">{meal.cuisine_type}</span>
        </div>
        <div className="meal-card__actions">
          <button
            className="btn-icon"
            onClick={() => onEdit(meal)}
            aria-label="Edit meal"
          >
            <EditIcon />
          </button>
          <button
            className="btn-icon btn-icon--danger"
            onClick={() => onDelete(meal.id)}
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
          {meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? 's' : ''}
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

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.5l2 1.5" strokeLinecap="round" />
    </svg>
  );
}