import { useState } from 'react';
import { NAV_ITEMS } from './constants/navigation';
import { type Page } from './types/page';
import { PAGES } from './constants/navigation';
import './styles/global.css';

export default function App() {
  const [page, setPage] = useState<Page>('meals');
 
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__logo">
          meal<span>plan</span>
        </div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-link ${page === id ? 'nav-link--active' : ''}`}
              onClick={() => setPage(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {PAGES[page]}
      </main>
    </div>
  );
}