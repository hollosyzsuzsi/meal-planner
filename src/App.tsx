import { useState } from 'react';
import { MealsPage } from './pages/MealsPage';
import './styles/global.css';

type Page = 'meals' | 'planner' | 'shopping';

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'meals', label: 'My meals', icon: <MealsIcon /> },
  { id: 'planner', label: 'Weekly plan', icon: <PlannerIcon /> },
  { id: 'shopping', label: 'Shopping list', icon: <ShoppingIcon /> },
];

export default function App() {
  const [page, setPage] = useState<Page>('meals');

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__logo">
          meal<span>plan</span>
        </div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${page === item.id ? 'nav-link--active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {page === 'meals' && <MealsPage />}
        {page === 'planner' && (
          <div className="page">
            <h1 className="page__title">Weekly plan</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Coming soon — add meals first, then generate your AI-powered plan!
            </p>
          </div>
        )}
        {page === 'shopping' && (
          <div className="page">
            <h1 className="page__title">Shopping list</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Your shopping list will appear once a weekly plan is generated.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function MealsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 13V7a6 6 0 0 1 12 0v6" strokeLinecap="round" />
      <path d="M1 13h14" strokeLinecap="round" />
      <path d="M8 4v3" strokeLinecap="round" />
    </svg>
  );
}

function PlannerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <path d="M5 1v4M11 1v4M2 7h12" strokeLinecap="round" />
    </svg>
  );
}

function ShoppingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 2h1.5l2 7h6l1.5-5H5.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}