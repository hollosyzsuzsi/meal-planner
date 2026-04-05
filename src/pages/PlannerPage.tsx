import { useEffect, useState } from 'react';
import { useMeals } from '../hooks/useMeals';
import { usePlanner } from '../hooks/usePlanner';
import { usePreferences } from '../hooks/usePreferences';
import { WeekGrid } from '../components/planner/WeekGrid';
import { PreferencesPanel } from '../components/planner/PreferencesPanel';
import { EditablePlanName } from '../components/planner/EditablePlanName';
import { WarnIcon, InfoIcon, SettingsIcon, Spinner } from '../components/ui/Icons';
import { formatWeekLabel, getThisMonday } from '../utils/date';

export function PlannerPage() {
  const { meals, loading: mealsLoading } = useMeals();
  const { weekPlans, selectedPlan, generating, warnings, error, generate, selectPlan, swapMeal, renamePlan, deletePlan, loadPlans } = usePlanner();
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
          {selectedPlan ? (
            <EditablePlanName
              name={selectedPlan.name}
              onRename={(name) => renamePlan(selectedPlan.id, name)}
              onDelete={() => deletePlan(selectedPlan.id)}
            />
          ) : (
            <h1 className="page__title">Weekly plan</h1>
          )}
          <p className="page__subtitle">{weekLabel}</p>
        </div>
        <div className="planner-actions">
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
            {generating ? <><Spinner />&nbsp;Generating…</> : selectedPlan ? 'Regenerate' : 'Generate plan'}
          </button>
        </div>
      </div>

      {showPrefs && prefs && (
        <div className="prefs-card">
          <PreferencesPanel prefs={prefs} saving={saving} onSave={savePrefs} />
        </div>
      )}

      {meals.length > 0 && meals.length < 7 && (
        <div className="banner banner--warning">
          <WarnIcon />
          <span>You have {meals.length} meal{meals.length !== 1 ? 's' : ''} — ideally 7+ for variety. Some may repeat.</span>
        </div>
      )}

      {meals.length === 0 && !mealsLoading && (
        <div className="banner banner--info">
          <InfoIcon />
          <span>Add some meals first.</span>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="banner banner--warning">
          <WarnIcon />
          <ul className="banner__list">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}

      {error && (
        <div className="banner banner--error">
          <WarnIcon />
          <span>{error}</span>
        </div>
      )}

      {generating && (
        <div className="planner-loading">
          <Spinner large />
          <p>Planning your week…</p>
        </div>
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