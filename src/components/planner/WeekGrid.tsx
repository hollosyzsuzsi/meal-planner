import { DAYS } from '../../constants/days';
import type { WeekGridProps } from '../../types/props';
import { DayCard } from './DayCard';

export function WeekGrid({ weekPlan, allMeals, onSwap }: WeekGridProps) {
  const dayMap = new Map(weekPlan.days.map((d) => [d.day, d]));

  return (
    <div className="week-grid">
      {DAYS.map((day) => (
        <DayCard
          key={day}
          day={day}
          dayPlan={dayMap.get(day as any) ?? null}
          allMeals={allMeals}
          onSwap={onSwap}
        />
      ))}
    </div>
  );
}

