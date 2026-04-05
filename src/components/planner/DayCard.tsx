import { useState } from "react";
import { DAY_LABELS } from "../../constants/days";
import { type DayCardProps } from "../../types/props";
import { SwapIcon } from "../ui/Icons";

export function DayCard({ day, dayPlan, allMeals, onSwap }: DayCardProps) {
  const [swapping, setSwapping] = useState(false);
  const [showSelect, setShowSelect] = useState(false);

  const handleSwap = async (meal_id: string) => {
    if (!dayPlan) return;
    try {
      setSwapping(true);
      await onSwap(dayPlan.id, meal_id);
      setShowSelect(false);
    } finally {
      setSwapping(false);
    }
  };

  return (
    <div className="day-card">
      <div className="day-card__header">
        <span className="day-card__label">{DAY_LABELS[day as keyof typeof DAY_LABELS]}</span>
        {dayPlan && !showSelect && (
          <button
            className="btn-icon btn-icon--sm"
            onClick={() => setShowSelect(true)}
            title="Swap meal"
            disabled={swapping}
          >
            <SwapIcon />
          </button>
        )}
      </div>

      {showSelect ? (
        <div className="day-card__swap">
          <select
            className="form-input"
            defaultValue=""
            onChange={(e) => e.target.value && handleSwap(e.target.value)}
            disabled={swapping}
            autoFocus
          >
            <option value="" disabled>Pick a meal…</option>
            {allMeals.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button className="btn-link" onClick={() => setShowSelect(false)}>Cancel</button>
        </div>
      ) : dayPlan ? (
        <div className="day-card__meal">
          <div className="day-card__meal-name">{dayPlan.meal.name}</div>
          <div className="day-card__meal-meta">
            <span className="day-card__cuisine">{dayPlan.meal.cuisine_type}</span>
            <span className="day-card__prep">{dayPlan.meal.prep_time} min</span>
          </div>
          {dayPlan.meal.dietary_tags.length > 0 && (
            <div className="day-card__tags">
              {dayPlan.meal.dietary_tags.slice(0, 2).map((tag) => (
                <span key={tag} className="day-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="day-card__empty">No meal</div>
      )}
    </div>
  );
}