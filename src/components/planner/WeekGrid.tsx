import { type WeekPlan, type DayPlan } from '../../types/plan';

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

interface WeekGridProps {
  weekPlan: WeekPlan;
}

export function WeekGrid({ weekPlan }: WeekGridProps) {
  const dayMap = new Map(weekPlan.days.map((d) => [d.day, d]));

  return (
    <div className="week-grid">
      {DAYS_ORDER.map((day) => {
        const dayPlan = dayMap.get(day);
        return (
          <DayCard key={day} day={day} dayPlan={dayPlan ?? null} />
        );
      })}
    </div>
  );
}

interface DayCardProps {
  day: string;
  dayPlan: DayPlan | null;
}

function DayCard({ day, dayPlan }: DayCardProps) {
  return (
    <div className="day-card">
      <div className="day-card__label">{DAY_LABELS[day]}</div>
      {dayPlan ? (
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