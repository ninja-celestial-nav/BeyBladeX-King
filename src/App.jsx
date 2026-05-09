import { useState } from 'react';
import { Package, Wrench, Brain, Camera } from 'lucide-react';
import InventoryPage from './pages/InventoryPage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import AdvisorPage from './pages/AdvisorPage';

const PAGES = [
  { id: 'inventory', icon: Package, label: '武器庫' },
  { id: 'deck', icon: Wrench, label: '牌組' },
  { id: 'advisor', icon: Brain, label: '建議' },
];

export default function App() {
  const [page, setPage] = useState('inventory');

  return (
    <div className="app-layout">
      <nav className="sidebar">
        <div className="sidebar-logo">🌀</div>
        {PAGES.map(p => (
          <button
            key={p.id}
            className={`sidebar-btn ${page === p.id ? 'active' : ''}`}
            onClick={() => setPage(p.id)}
            title={p.label}
          >
            <p.icon size={22} />
          </button>
        ))}
      </nav>
      <main className="main-content">
        {page === 'inventory' && <InventoryPage />}
        {page === 'deck' && <DeckBuilderPage />}
        {page === 'advisor' && <AdvisorPage />}
      </main>
    </div>
  );
}
