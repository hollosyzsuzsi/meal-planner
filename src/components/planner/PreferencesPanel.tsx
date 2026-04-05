import { useState, useEffect } from 'react';
import { type PreferencesFormData } from '../../types/prefs';
import { type PreferencesPanelProps } from '../../types/props';
import { FREQUENCY_OPTIONS } from '../../constants/frequencyOptions';

export function PreferencesPanel({ prefs, saving, onSave }: PreferencesPanelProps) {
  const [form, setForm] = useState<PreferencesFormData>({
    variety_cuisines: prefs.variety_cuisines,
    shared_ingredients: prefs.shared_ingredients,
    cooking_frequency: prefs.cooking_frequency,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      variety_cuisines: prefs.variety_cuisines,
      shared_ingredients: prefs.shared_ingredients,
      cooking_frequency: prefs.cooking_frequency,
    });
  }, [prefs]);

  const handleSave = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const isDirty =
    form.variety_cuisines !== prefs.variety_cuisines ||
    form.shared_ingredients !== prefs.shared_ingredients ||
    form.cooking_frequency !== prefs.cooking_frequency;

  return (
    <div className="prefs-panel">
      <div className="prefs-section">
        <h3 className="prefs-section__title">Cuisine variety</h3>
        <label className="toggle-row">
          <div className="toggle-row__text">
            <span className="toggle-row__label">Avoid repeating cuisines</span>
            <span className="toggle-row__desc">
              The planner will try to pick a different cuisine type each day
            </span>
          </div>
          <button
            type="button"
            className={`toggle ${form.variety_cuisines ? 'toggle--on' : ''}`}
            onClick={() => setForm((f) => ({ ...f, variety_cuisines: !f.variety_cuisines }))}
            aria-pressed={form.variety_cuisines}
          >
            <span className="toggle__thumb" />
          </button>
        </label>
      </div>

      <div className="prefs-section">
        <h3 className="prefs-section__title">Ingredients</h3>
        <label className="toggle-row">
          <div className="toggle-row__text">
            <span className="toggle-row__label">Prefer shared ingredients</span>
            <span className="toggle-row__desc">
              Pick meals that reuse the same ingredients to reduce your shopping list
            </span>
          </div>
          <button
            type="button"
            className={`toggle ${form.shared_ingredients ? 'toggle--on' : ''}`}
            onClick={() => setForm((f) => ({ ...f, shared_ingredients: !f.shared_ingredients }))}
            aria-pressed={form.shared_ingredients}
          >
            <span className="toggle__thumb" />
          </button>
        </label>
      </div>

      <div className="prefs-section">
        <h3 className="prefs-section__title">Cooking frequency</h3>
        <div className="frequency-options">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`frequency-card ${form.cooking_frequency === opt.value ? 'frequency-card--active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, cooking_frequency: opt.value }))}
            >
              <span className="frequency-card__label">{opt.label}</span>
              <span className="frequency-card__desc">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="prefs-footer">
        <button
          className="btn btn--primary"
          onClick={handleSave}
          disabled={saving || !isDirty}
        >
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save preferences'}
        </button>
        {!isDirty && !saved && (
          <span className="prefs-footer__hint">No unsaved changes</span>
        )}
      </div>
    </div>
  );
}