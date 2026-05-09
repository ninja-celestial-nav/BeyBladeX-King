import { useState, useEffect } from 'react';
import { Package, Wrench, Brain } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className={`app-layout ${isMobile ? 'mobile' : ''}`}>
      {!isMobile && (
        <nav className="sidebar">
          <div className="sidebar-logo">🌀</div>
          {PAGES.map(p => (
            <button key={p.id} className={`sidebar-btn ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)} title={p.label}>
              <p.icon size={22} />
            </button>
          ))}
        </nav>
      )}
      <main className="main-content">
        <div className="page-transition" key={page}>
          {page === 'inventory' && <InventoryPage />}
          {page === 'deck' && <DeckBuilderPage />}
          {page === 'advisor' && <AdvisorPage />}
        </div>
      </main>
      {isMobile && (
        <nav className="bottom-nav">
          {PAGES.map(p => (
            <button key={p.id} className={`bottom-nav-btn ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)}>
              <p.icon size={20} />
              <span>{p.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
