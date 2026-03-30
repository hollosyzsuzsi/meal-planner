import { useState, useEffect } from 'react';
import { type Meal, type MealFormData, type MealIngredientFormRow, type DietaryTag, type CuisineType } from '../../types/meal';
import { useReferenceData } from '../../hooks/useReferenceData';

const DIETARY_TAGS: DietaryTag[] = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'high-protein', 'low-carb',
];

const CUISINE_TYPES: CuisineType[] = [
  'italian', 'asian', 'mexican', 'mediterranean', 'american', 'indian', 'middle-eastern', 'other',
];

const emptyRow = (): MealIngredientFormRow => ({
  ingredient_id: '',
  ingredient_name: '',
  quantity: 1,
  unit_id: '',
  category_id: '',
  isNew: false,
});

const defaultForm = (): MealFormData => ({
  name: '',
  description: '',
  cuisine_type: 'other',
  prep_time: 30,
  dietary_tags: [],
  ingredients: [emptyRow()],
});

interface MealFormProps {
  meal?: Meal | null;
  onSubmit: (data: MealFormData) => Promise<void>;
  onCancel: () => void;
}

export function MealForm({ meal, onSubmit, onCancel }: MealFormProps) {
  const { categories, units, ingredients, loading: refLoading } = useReferenceData();
  const [form, setForm] = useState<MealFormData>(defaultForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (meal && !refLoading) {
      setForm({
        name: meal.name,
        description: meal.description,
        cuisine_type: meal.cuisine_type,
        prep_time: meal.prep_time,
        dietary_tags: meal.dietary_tags,
        ingredients: (meal.meal_ingredients ?? []).length > 0
          ? (meal.meal_ingredients ?? []).map((mi) => ({
              ingredient_id: mi.ingredient_id,
              ingredient_name: mi.ingredient.name,
              quantity: mi.quantity,
              unit_id: mi.unit_id,
              category_id: mi.ingredient.category_id,
              isNew: false,
            }))
          : [emptyRow()],
      });
    } else if (!meal) {
      const firstUnitId = units[0]?.id ?? '';
      setForm({ ...defaultForm(), ingredients: [{ ...emptyRow(), unit_id: firstUnitId }] });
    }
  }, [meal, refLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = form.ingredients.filter(
      (i) => i.ingredient_id || (i.isNew && i.ingredient_name.trim() !== '')
    );
    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({ ...form, ingredients: validIngredients });
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

  const updateRow = (idx: number, patch: Partial<MealIngredientFormRow>) => {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.map((r, i) => i === idx ? { ...r, ...patch } : r),
    }));
  };

  const handleIngredientSelect = (idx: number, ingredient_id: string) => {
    if (ingredient_id === '__new__') {
      updateRow(idx, { ingredient_id: '', ingredient_name: '', isNew: true, category_id: '' });
      return;
    }
    const found = ingredients.find((i) => i.id === ingredient_id);
    if (found) {
      updateRow(idx, {
        ingredient_id: found.id,
        ingredient_name: found.name,
        category_id: found.category_id,
        isNew: false,
      });
    }
  };

  const addRow = () => {
    setForm((f) => ({
      ...f,
      ingredients: [...f.ingredients, { ...emptyRow(), unit_id: units[0]?.id ?? '' }],
    }));
  };

  const removeRow = (idx: number) => {
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== idx) }));
  };

  if (refLoading) return <p className="state-msg">Loading…</p>;

  return (
    <form className="meal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="meal-name">Meal name</label>
        <input id="meal-name" className="form-input" type="text"
          placeholder="e.g. Chicken stir-fry" value={form.name} required
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="meal-description">Description (optional)</label>
        <textarea id="meal-description" className="form-input form-textarea" rows={2}
          placeholder="A quick note about this meal..."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="meal-cuisine">Cuisine</label>
          <select id="meal-cuisine" className="form-input form-select"
            value={form.cuisine_type}
            onChange={(e) => setForm((f) => ({ ...f, cuisine_type: e.target.value as CuisineType }))}>
            {CUISINE_TYPES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="meal-prep">Prep time (min)</label>
          <input id="meal-prep" className="form-input" type="number" min={1} max={360}
            value={form.prep_time}
            onChange={(e) => setForm((f) => ({ ...f, prep_time: Number(e.target.value) }))} />
        </div>
      </div>

      <div className="form-group">
        <span className="form-label">Dietary tags</span>
        <div className="tag-picker">
          {DIETARY_TAGS.map((tag) => (
            <button key={tag} type="button"
              className={`tag-toggle ${form.dietary_tags.includes(tag) ? 'tag-toggle--active' : ''}`}
              onClick={() => toggleTag(tag)}>{tag}</button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <div className="ingredients-header">
          <span className="form-label">Ingredients</span>
          <button type="button" className="btn-link" onClick={addRow}>+ Add ingredient</button>
        </div>
        <div className="ingredients-list">
          {form.ingredients.map((row, idx) => (
            <IngredientRow
              key={idx}
              row={row}
              idx={idx}
              ingredients={ingredients}
              categories={categories}
              units={units}
              onSelect={(id) => handleIngredientSelect(idx, id)}
              onUpdate={(patch) => updateRow(idx, patch)}
              onRemove={() => removeRow(idx)}
              canRemove={form.ingredients.length > 1}
            />
          ))}
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary"
          disabled={submitting || !form.name.trim()}>
          {submitting ? 'Saving…' : meal ? 'Save changes' : 'Add meal'}
        </button>
      </div>
    </form>
  );
}

// ─── Ingredient row ────────────────────────────────────────────────────────────

interface IngredientRowProps {
  row: MealIngredientFormRow;
  idx: number;
  ingredients: ReturnType<typeof useReferenceData>['ingredients'];
  categories: ReturnType<typeof useReferenceData>['categories'];
  units: ReturnType<typeof useReferenceData>['units'];
  onSelect: (id: string) => void;
  onUpdate: (patch: Partial<MealIngredientFormRow>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function IngredientRow({ row, ingredients, categories, units, onSelect, onUpdate, onRemove, canRemove }: IngredientRowProps) {
  return (
    <div className="ingredient-row">
      {/* Ingredient selector or new ingredient form */}
      {!row.isNew ? (
        <select
          className="form-input ingredient-select"
          value={row.ingredient_id}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Select ingredient…</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>{ing.name}</option>
          ))}
          <option value="__new__">+ Register new ingredient…</option>
        </select>
      ) : (
        <div className="new-ingredient-fields">
          <input
            className="form-input"
            type="text"
            placeholder="New ingredient name"
            value={row.ingredient_name}
            onChange={(e) => onUpdate({ ingredient_name: e.target.value })}
            autoFocus
          />
          <select
            className="form-input form-select"
            value={row.category_id}
            onChange={(e) => onUpdate({ category_id: e.target.value })}
          >
            <option value="">Category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button type="button" className="btn-link" onClick={() => onUpdate({ isNew: false, ingredient_name: '', category_id: '' })}>
            Cancel
          </button>
        </div>
      )}

      {/* Quantity */}
      <input
        className="form-input ingredient-qty"
        type="number"
        min={0}
        step={0.1}
        value={row.quantity}
        onChange={(e) => onUpdate({ quantity: Number(e.target.value) })}
      />

      {/* Unit */}
      <select
        className="form-input ingredient-unit"
        value={row.unit_id}
        onChange={(e) => onUpdate({ unit_id: e.target.value })}
      >
        <option value="">Unit…</option>
        {units.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      {canRemove && (
        <button type="button" className="btn-icon btn-icon--danger" onClick={onRemove} aria-label="Remove">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 8h10" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}