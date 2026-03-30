import { useState } from 'react';
import { type WeekPlan, type WeekPlanDay } from '../../types/plan';
import { type Meal } from '../../types/meal';

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

const DAYS_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const;

interface WeekGridProps {
  weekPlan: WeekPlan;
  allMeals: Meal[];
  onSwap: (dayId: string, meal_id: string) => Promise<void>;
}

export function WeekGrid({ weekPlan, allMeals, onSwap }: WeekGridProps) {
  const dayMap = new Map(weekPlan.days.map((d) => [d.day, d]));

  return (
    <div className="week-grid">
      {DAYS_ORDER.map((day) => (
        <DayCard
          key={day}
          day={day}
          dayPlan={dayMap.get(day) ?? null}
          allMeals={allMeals}
          onSwap={onSwap}
        />
      ))}
    </div>
  );
}

interface DayCardProps {
  day: string;
  dayPlan: WeekPlanDay | null;
  allMeals: Meal[];
  onSwap: (dayId: string, meal_id: string) => Promise<void>;
}

function DayCard({ day, dayPlan, allMeals, onSwap }: DayCardProps) {
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
        <span className="day-card__label">{DAY_LABELS[day]}</span>
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

function SwapIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 5h12M11 2l3 3-3 3M14 11H2M5 8l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}