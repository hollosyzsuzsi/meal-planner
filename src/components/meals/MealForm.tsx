import { useState, useEffect } from 'react';
import { type Meal, type MealFormData, type Ingredient, type DietaryTag, type CuisineType } from '../../types/meal';

const DIETARY_TAGS: DietaryTag[] = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'high-protein', 'low-carb',
];

const CUISINE_TYPES: CuisineType[] = [
  'italian', 'asian', 'mexican', 'mediterranean', 'american', 'indian', 'middle-eastern', 'other',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'piece', 'pinch'];

const emptyIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  name: '',
  quantity: 1,
  unit: 'piece',
});

const defaultForm = (): MealFormData => ({
  name: '',
  description: '',
  cuisine_type: 'other',
  prep_time: 30,
  dietary_tags: [],
  ingredients: [emptyIngredient()],
});

interface MealFormProps {
  meal?: Meal | null;
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel: () => void;
}

export function MealForm({ meal, onSubmit, onCancel }: MealFormProps) {
  const [form, setForm] = useState<MealFormData>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (meal) {
      setForm({
        name: meal.name,
        description: meal.description,
        cuisine_type: meal.cuisine_type,
        prep_time: meal.prep_time,
        dietary_tags: meal.dietary_tags,
        ingredients: meal.ingredients.length > 0 ? meal.ingredients : [emptyIngredient()],
      });
    } else {
      setForm(defaultForm());
    }
  }, [meal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const cleanIngredients = form.ingredients.filter((i) => i.name.trim());

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({ ...form, ingredients: cleanIngredients });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag: DietaryTag) => {
    setForm((f) => ({
      ...f,
      dietary_tags: f.dietary_tags.includes(tag)
        ? f.dietary_tags.filter((t) => t !== tag)
        : [...f.dietary_tags, tag],
    }));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));
  };

  const addIngredient = () => {
    setForm((f) => ({ ...f, ingredients: [...f.ingredients, emptyIngredient()] }));
  };

  const removeIngredient = (id: string) => {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.filter((i) => i.id !== id),
    }));
  };

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="meal-name">Meal name</label>
        <input
          id="meal-name"
          className="form-input"
          type="text"
          placeholder="e.g. Chicken stir-fry"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="meal-description">Description (optional)</label>
        <textarea
          id="meal-description"
          className="form-input form-textarea"
          placeholder="A quick note about this meal..."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="meal-cuisine">Cuisine</label>
          <select
            id="meal-cuisine"
            className="form-input form-select"
            value={form.cuisine_type}
            onChange={(e) => setForm((f) => ({ ...f, cuisine_type: e.target.value as CuisineType }))}
          >
            {CUISINE_TYPES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="meal-prep">Prep time (min)</label>
          <input
            id="meal-prep"
            className="form-input"
            type="number"
            min={1}
            max={360}
            value={form.prep_time}
            onChange={(e) => setForm((f) => ({ ...f, prep_time: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="form-group">
        <span className="form-label">Dietary tags</span>
        <div className="tag-picker">
          {DIETARY_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-toggle ${form.dietary_tags.includes(tag) ? 'tag-toggle--active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <div className="ingredients-header">
          <span className="form-label">Ingredients</span>
          <button type="button" className="btn-link" onClick={addIngredient}>
            + Add ingredient
          </button>
        </div>
        <div className="ingredients-list">
          {form.ingredients.map((ing, idx) => (
            <div key={ing.id} className="ingredient-row">
              <input
                className="form-input ingredient-name"
                type="text"
                placeholder={`Ingredient ${idx + 1}`}
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
              />
              <input
                className="form-input ingredient-qty"
                type="number"
                min={0}
                step={0.1}
                value={ing.quantity}
                onChange={(e) => updateIngredient(ing.id, 'quantity', Number(e.target.value))}
              />
              <select
                className="form-input ingredient-unit"
                value={ing.unit}
                onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              {form.ingredients.length > 1 && (
                <button
                  type="button"
                  className="btn-icon btn-icon--danger"
                  onClick={() => removeIngredient(ing.id)}
                  aria-label="Remove ingredient"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting || !form.name.trim()}>
          {submitting ? 'Saving…' : meal ? 'Save changes' : 'Add meal'}
        </button>
      </div>
    </form>
  );
}