import { useEffect, useState } from 'react';
import { useMeals } from '../hooks/useMeals';
import { usePlanner } from '../hooks/usePlanner';
import { usePreferences } from '../hooks/usePreferences';
import { WeekGrid } from '../components/planner/WeekGrid';
import { PreferencesPanel } from '../components/planner/PreferencesPanel';

export function PlannerPage() {
  const { meals, loading: mealsLoading } = useMeals();
  const { weekPlans, selectedPlan, generating, warnings, error, generate, selectPlan, swapMeal, loadPlans } = usePlanner();
  const { prefs, loading: prefsLoading, saving, savePrefs } = usePreferences();
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const handleGenerate = () => {
    if (prefs) generate(meals, prefs);
  };

  const weekLabel = selectedPlan
    ? formatWeekLabel(selectedPlan.week_start)
    : formatWeekLabel(getThisMonday());

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Weekly plan</h1>
          <p className="page__subtitle">{weekLabel}</p>
        </div>
        <div className="planner-actions">
          {/* Plan selector */}
          {weekPlans.length > 1 && (
            <select
              className="form-input"
              value={selectedPlan?.id ?? ''}
              onChange={(e) => {
                const plan = weekPlans.find((p) => p.id === e.target.value);
                if (plan) selectPlan(plan);
              }}
            >
              {weekPlans.map((p) => (
                <option key={p.id} value={p.id}>{formatWeekLabel(p.week_start)}</option>
              ))}
            </select>
          )}
          <button
            className={`btn btn--ghost ${showPrefs ? 'btn--ghost-active' : ''}`}
            onClick={() => setShowPrefs((v) => !v)}
          >
            <SettingsIcon /> Preferences
          </button>
          <button
            className="btn btn--primary"
            onClick={handleGenerate}
            disabled={generating || mealsLoading || prefsLoading || meals.length === 0}
          >
            {generating ? <><Spinner />Generating…</> : selectedPlan ? 'Regenerate' : 'Generate plan'}
          </button>
        </div>
      </div>

      {showPrefs && prefs && (
        <div className="prefs-card">
          <PreferencesPanel prefs={prefs} saving={saving} onSave={savePrefs} />
        </div>
      )}

      {meals.length < 7 && meals.length > 0 && (
        <div className="banner banner--warning">
          <WarnIcon />
          <span>You have {meals.length} meal{meals.length !== 1 ? 's' : ''} — ideally 7+ for variety. Some may repeat.</span>
        </div>
      )}

      {meals.length === 0 && !mealsLoading && (
        <div className="banner banner--info"><InfoIcon /><span>Add some meals first.</span></div>
      )}

      {warnings.length > 0 && (
        <div className="banner banner--warning">
          <WarnIcon />
          <ul className="banner__list">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}

      {error && <div className="banner banner--error"><WarnIcon /><span>{error}</span></div>}

      {generating && (
        <div className="planner-loading"><Spinner large /><p>Planning your week…</p></div>
      )}

      {selectedPlan && !generating && (
        <WeekGrid weekPlan={selectedPlan} allMeals={meals} onSwap={swapMeal} />
      )}

      {!selectedPlan && !generating && meals.length > 0 && (
        <div className="empty-state">
          <p className="empty-state__text">Hit "Generate plan" to get started.</p>
        </div>
      )}
    </div>
  );
}

function getThisMonday(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return d.toISOString().split('T')[0];
}

function formatWeekLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const end = new Date(date);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${fmt(date)} – ${fmt(end)}`;
}

function Spinner({ large }: { large?: boolean }) {
  const size = large ? 24 : 14;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
function WarnIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><path d="M8 1.5L1 13.5h14L8 1.5z" strokeLinejoin="round"/><path d="M8 6v4M8 11.5v.5" strokeLinecap="round"/></svg>;
}
function InfoIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5.5v.5" strokeLinecap="round"/></svg>;
}
function SettingsIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" strokeLinecap="round"/></svg>;
}