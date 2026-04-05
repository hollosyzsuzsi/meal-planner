import { useState } from 'react';
import { useMeals } from '../hooks/useMeals';
import { MealCard } from '../components/meals/MealCard';
import { MealForm } from '../components/meals/MealForm';
import { type Meal, type MealFormData } from '../types/meal';
import { type FilterCuisine } from '../types/ui';

export function MealsPage() {
  const { meals, loading, error, addMeal, editMeal, removeMeal } = useMeals();
  const [showForm, setShowForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState<FilterCuisine>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = async (data: MealFormData) => {
    await addMeal(data);
    setShowForm(false);
  };

  const handleEdit = async (data: MealFormData) => {
    if (!editingMeal) return;
    await editMeal(editingMeal.id, data);
    setEditingMeal(null);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }
    await removeMeal(id);
    setDeleteConfirm(null);
  };

  const cuisines = Array.from(new Set(meals.map((m) => m.cuisine_type)));

  const filtered = meals.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = cuisineFilter === 'all' || m.cuisine_type === cuisineFilter;
    return matchesSearch && matchesCuisine;
  });

  const isFormOpen = showForm || editingMeal !== null;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">My meals</h1>
          <p className="page__subtitle">
            {meals.length} meal{meals.length !== 1 ? 's' : ''} in your database
          </p>
        </div>
        {!isFormOpen && (
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            + Add meal
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="form-panel">
          <h2 className="form-panel__title">
            {editingMeal ? `Editing: ${editingMeal.name}` : 'New meal'}
          </h2>
          <MealForm
            meal={editingMeal}
            onSubmit={editingMeal ? handleEdit : handleAdd}
            onCancel={() => {
              setShowForm(false);
              setEditingMeal(null);
            }}
          />
        </div>
      )}

      {!isFormOpen && (
        <>
          <div className="filters">
            <input
              className="form-input filters__search"
              type="search"
              placeholder="Search meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filters__cuisines">
              <button
                className={`filter-pill ${cuisineFilter === 'all' ? 'filter-pill--active' : ''}`}
                onClick={() => setCuisineFilter('all')}
              >
                All
              </button>
              {cuisines.map((c) => (
                <button
                  key={c}
                  className={`filter-pill ${cuisineFilter === c ? 'filter-pill--active' : ''}`}
                  onClick={() => setCuisineFilter(c)}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="state-msg">Loading your meals…</p>}
          {error && <p className="state-msg state-msg--error">{error}</p>}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">
              <p className="empty-state__text">
                {search || cuisineFilter !== 'all'
                  ? 'No meals match your filters.'
                  : 'No meals yet. Add your first one!'}
              </p>
            </div>
          )}

          <div className="meal-grid">
            {filtered.map((meal) => (
              <div key={meal.id}>
                <MealCard
                  meal={meal}
                  onEdit={(m) => setEditingMeal(m)}
                  onDelete={handleDelete}
                />
                {deleteConfirm === meal.id && (
                  <div className="delete-confirm">
                    <span>Delete "{meal.name}"?</span>
                    <button className="btn btn--danger btn--sm" onClick={() => handleDelete(meal.id)}>
                      Yes, delete
                    </button>
                    <button className="btn btn--ghost btn--sm" onClick={() => setDeleteConfirm(null)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}