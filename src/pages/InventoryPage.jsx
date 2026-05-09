import { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Camera, X } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { BLADES, RATCHETS, BITS, CX_ASSIST_BLADES, TIER_COLORS, TYPE_ICONS, getAllParts, PART_TYPES } from '../data/partsDatabase';
import PhotoScanner from '../components/PhotoScanner';

const TABS = [
  { id: 'blade', label: '⚔️ 之刃 Blades', types: [PART_TYPES.BLADE] },
  { id: 'ratchet', label: '⚙️ 棘輪 Ratchets', types: [PART_TYPES.RATCHET] },
  { id: 'bit', label: '💎 軸心 Bits', types: [PART_TYPES.BIT] },
  { id: 'cx', label: '🔧 CX 輔助刃', types: [PART_TYPES.ASSIST_BLADE] },
];

export default function InventoryPage() {
  const { inventory, addPart, removePart, updateQuantity, clearInventory } = useInventoryStore();
  const [tab, setTab] = useState('blade');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

  const allParts = useMemo(() => getAllParts(), []);
  const ownedParts = useMemo(() => {
    return Object.entries(inventory)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const part = allParts.find(p => p.id === id);
        return part ? { ...part, qty } : null;
      })
      .filter(Boolean);
  }, [inventory, allParts]);

  const currentTab = TABS.find(t => t.id === tab);
  const filtered = ownedParts
    .filter(p => currentTab.types.includes(p.partType))
    .filter(p => !search || [p.name, p.nameJP, p.nameCN, p.code, p.abbr].some(v => v && v.toLowerCase().includes(search.toLowerCase())));

  const stats = {
    total: Object.values(inventory).reduce((a, b) => a + b, 0),
    blades: ownedParts.filter(p => p.partType === PART_TYPES.BLADE).length,
    ratchets: ownedParts.filter(p => p.partType === PART_TYPES.RATCHET).length,
    bits: ownedParts.filter(p => p.partType === PART_TYPES.BIT).length,
  };

  return (
    <div>
      <div className="page-header">
        <h1>📦 武器庫 ARSENAL</h1>
        <p>管理你的 Beyblade X 零件收藏</p>
      </div>

      <div className="stats-row">
        {[
          { label: '總零件', value: stats.total, color: '#667eea' },
          { label: '之刃', value: stats.blades, color: '#ff416c' },
          { label: '棘輪', value: stats.ratchets, color: '#00e5ff' },
          { label: '軸心', value: stats.bits, color: '#ffd700' },
        ].map(s => (
          <div className="stat-chip" key={s.label}>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> 新增零件
        </button>
        <button className="btn btn-accent" onClick={() => setShowPhoto(true)}>
          <Camera size={16} /> 📷 拍照辨識
        </button>
        {stats.total > 0 && (
          <button className="btn btn-danger" onClick={() => { if (confirm('確定清空武器庫？')) clearInventory(); }}>
            <Trash2 size={16} /> 清空
          </button>
        )}
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input placeholder="搜尋零件名稱..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="parts-grid">
          {filtered.map(p => (
            <div className="part-card" key={p.id}>
              <span style={{ fontSize: '20px' }}>{TYPE_ICONS[p.type] || '⚙️'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="part-name">{p.name} <span style={{ color: 'var(--accent-cyan)', fontWeight: 400 }}>{p.nameJP || p.nameCN || ''}</span></div>
                <div className="part-sub">{p.code || p.system || ''} {p.spin ? `• ${p.spin}` : ''} {p.abbr ? `(${p.abbr})` : ''}</div>
              </div>
              <span className="tier-badge" style={{
                background: `${TIER_COLORS[p.tier]}22`,
                color: TIER_COLORS[p.tier],
                border: `1px solid ${TIER_COLORS[p.tier]}44`,
              }}>{p.tier}</span>
              <div className="part-qty">
                <button onClick={() => updateQuantity(p.id, p.qty - 1)}>−</button>
                <span>{p.qty}</span>
                <button onClick={() => addPart(p.id)}>+</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>{search ? '找不到符合的零件' : '此分類尚無零件'}</p>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> 新增零件
          </button>
        </div>
      )}

      {showAdd && <AddPartModal allParts={allParts} inventory={inventory} onAdd={addPart} onClose={() => setShowAdd(false)} />}
      {showPhoto && <PhotoScanner onClose={() => setShowPhoto(false)} />}
    </div>
  );
}

function AddPartModal({ allParts, inventory, onAdd, onClose }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const TYPE_FILTERS = [
    { id: 'all', label: '全部' },
    { id: PART_TYPES.BLADE, label: '之刃' },
    { id: PART_TYPES.RATCHET, label: '棘輪' },
    { id: PART_TYPES.BIT, label: '軸心' },
    { id: PART_TYPES.ASSIST_BLADE, label: 'CX輔助刃' },
  ];

  const results = allParts
    .filter(p => filterType === 'all' || p.partType === filterType)
    .filter(p => !search || [p.name, p.nameJP, p.nameCN, p.code, p.abbr].some(v => v && v.toLowerCase().includes(search.toLowerCase())))
    .slice(0, 50);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2>新增零件到武器庫</h2>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="search-bar">
          <Search size={16} className="search-icon" />
          <input placeholder="搜尋零件名稱... (例: Wizard Rod, 9-60, Hexa)" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>

        <div className="tabs" style={{ marginBottom: 12 }}>
          {TYPE_FILTERS.map(f => (
            <button key={f.id} className={`tab-btn ${filterType === f.id ? 'active' : ''}`} onClick={() => setFilterType(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map(p => {
            const owned = inventory[p.id] || 0;
            return (
              <div className="part-card" key={p.id} onClick={() => onAdd(p.id)}>
                <span style={{ fontSize: 18 }}>{TYPE_ICONS[p.type] || '⚙️'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="part-name">{p.name} <span style={{ color: 'var(--accent-cyan)', fontWeight: 400, fontSize: 12 }}>{p.nameJP || p.nameCN || ''}</span></div>
                  <div className="part-sub">{p.code || ''} {p.partType === 'blade' ? `• ${p.system} • ${p.spin || ''}` : ''} {p.abbr ? `(${p.abbr})` : ''}</div>
                </div>
                <span className="tier-badge" style={{
                  background: `${TIER_COLORS[p.tier]}22`,
                  color: TIER_COLORS[p.tier],
                  border: `1px solid ${TIER_COLORS[p.tier]}44`,
                }}>{p.tier}</span>
                {owned > 0 && <span style={{ color: 'var(--accent-green)', fontSize: 12, fontWeight: 600 }}>×{owned}</span>}
                <button className="btn btn-accent" style={{ padding: '6px 12px', fontSize: 12, marginLeft: 'auto' }}
                  onClick={e => { e.stopPropagation(); onAdd(p.id); }}>
                  <Plus size={14} />
                </button>
              </div>
            );
          })}
          {results.length === 0 && <div className="empty-state" style={{ padding: 30 }}><p>找不到「{search}」</p></div>}
        </div>
      </div>
    </div>
  );
}
