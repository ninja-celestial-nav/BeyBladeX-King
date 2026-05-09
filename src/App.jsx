import { useState, useEffect, useCallback } from 'react';
import { Package, Wrench, Brain, Book, History, Keyboard } from 'lucide-react';
import InventoryPage from './pages/InventoryPage';
import DeckBuilderPage from './pages/DeckBuilderPage';
import AdvisorPage from './pages/AdvisorPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import HistoryPage from './pages/HistoryPage';

const PAGES = [
  { id: 'inventory', icon: Package, label: '武器庫', key: '1' },
  { id: 'deck', icon: Wrench, label: '牌組', key: '2' },
  { id: 'advisor', icon: Brain, label: '建議', key: '3' },
  { id: 'encyclopedia', icon: Book, label: '圖鑑', key: '4' },
  { id: 'history', icon: History, label: '紀錄', key: '5' },
];

export default function App() {
  const [page, setPage] = useState('inventory');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState(() => localStorage.getItem('bx-theme') || 'dark');
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bx-theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  const handleKey = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
    const pg = PAGES.find(p => p.key === e.key);
    if (pg) { e.preventDefault(); setPage(pg.id); }
    if (e.key === '/') { e.preventDefault(); document.querySelector('.search-bar input')?.focus(); }
    if (e.key === '?') { e.preventDefault(); setShowShortcuts(v => !v); }
    if (e.key === 'Escape') setShowShortcuts(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <div className={`app-layout ${isMobile ? 'mobile' : ''}`}>
      {!isMobile && (
        <nav className="sidebar">
          <div className="sidebar-logo" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="切換主題">🌀</div>
          {PAGES.map(p => (
            <button key={p.id} className={`sidebar-btn ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)} title={`${p.label} (${p.key})`}>
              <p.icon size={22} />
            </button>
          ))}
          <button className="sidebar-btn" onClick={() => setShowShortcuts(true)} title="快捷鍵 (?)" style={{ marginTop: 'auto' }}>
            <Keyboard size={18} />
          </button>
        </nav>
      )}
      <main className="main-content">
        <div className="page-transition" key={page}>
          {page === 'inventory' && <InventoryPage />}
          {page === 'deck' && <DeckBuilderPage />}
          {page === 'advisor' && <AdvisorPage />}
          {page === 'encyclopedia' && <EncyclopediaPage />}
          {page === 'history' && <HistoryPage />}
        </div>
      </main>
      {isMobile && (
        <nav className="bottom-nav">
          {PAGES.map(p => (
            <button key={p.id} className={`bottom-nav-btn ${page === p.id ? 'active' : ''}`}
              onClick={() => setPage(p.id)}>
              <p.icon size={18} />
              <span>{p.label}</span>
            </button>
          ))}
        </nav>
      )}

      {showShortcuts && (
        <div className="modal-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h2>⌨️ 鍵盤快捷鍵</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {PAGES.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-glass)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                  <kbd style={{ background: 'var(--bg-glass)', padding: '2px 10px', borderRadius: 6, fontFamily: 'Orbitron', fontSize: 13, border: '1px solid var(--border-glass)' }}>{p.key}</kbd>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>搜尋</span>
                <kbd style={{ background: 'var(--bg-glass)', padding: '2px 10px', borderRadius: 6, fontFamily: 'Orbitron', fontSize: 13, border: '1px solid var(--border-glass)' }}>/</kbd>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>顯示快捷鍵</span>
                <kbd style={{ background: 'var(--bg-glass)', padding: '2px 10px', borderRadius: 6, fontFamily: 'Orbitron', fontSize: 13, border: '1px solid var(--border-glass)' }}>?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
