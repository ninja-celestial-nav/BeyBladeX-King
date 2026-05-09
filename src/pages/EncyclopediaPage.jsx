import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { getAllParts, TIER_COLORS, TYPE_ICONS } from '../data/partsDatabase';
import { getSingleComboAnalysis } from '../utils/deckEngine';

const FILTER_TYPES = [
  { id: 'all', label: '全部' },
  { id: 'blade', label: '⚔️ 之刃' },
  { id: 'ratchet', label: '⚙️ 棘輪' },
  { id: 'bit', label: '🔩 軸心' },
  { id: 'lockChip', label: '🔷 鎖定晶片' },
  { id: 'mainBlade', label: '🗡️ 主刃' },
  { id: 'assistBlade', label: '🛡️ 輔助刃' },
];

const TIER_FILTERS = ['全部', 'T0', 'T0.5', 'T1', 'T2', 'T3'];

export default function EncyclopediaPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('全部');
  const [selected, setSelected] = useState(null);
  const allParts = useMemo(() => getAllParts(), []);

  const filtered = allParts
    .filter(p => filterType === 'all' || p.partType === filterType)
    .filter(p => filterTier === '全部' || p.tier === filterTier)
    .filter(p => !search || [p.name, p.nameJP, p.nameCN, p.code, p.abbr]
      .some(v => v && v.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="page-header">
        <h1>📖 零件圖鑑 ENCYCLOPEDIA</h1>
        <p>全 {allParts.length} 種零件資料庫 — 點擊查看詳細資訊</p>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input placeholder="搜尋零件名稱 (中/英文/代號)..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {FILTER_TYPES.map(f => (
          <button key={f.id} className={`tab-btn ${filterType === f.id ? 'active' : ''}`}
            style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setFilterType(f.id)}>{f.label}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {TIER_FILTERS.map(t => (
          <button key={t} className={`tab-btn ${filterTier === t ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: 11, color: t !== '全部' ? TIER_COLORS[t] : undefined }}
            onClick={() => setFilterTier(t)}>{t}</button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>顯示 {filtered.length} / {allParts.length} 種零件</div>

      <div className="parts-grid">
        {filtered.map(p => (
          <div className="part-card" key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>{TYPE_ICONS[p.type] || '⚙️'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="part-name">{p.name}</div>
              <div className="part-sub">
                {p.nameCN || p.nameJP || ''} {p.code ? `• ${p.code}` : ''} {p.abbr ? `(${p.abbr})` : ''}
              </div>
            </div>
            <span className="tier-badge" style={{
              background: `${TIER_COLORS[p.tier]}22`, color: TIER_COLORS[p.tier],
              border: `1px solid ${TIER_COLORS[p.tier]}44`,
            }}>{p.tier}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{TYPE_ICONS[selected.type] || '⚙️'} {selected.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginBottom: 16 }}>
              <Detail label="中文名" value={selected.nameCN || selected.nameJP || '—'} />
              <Detail label="代號" value={selected.code || '—'} />
              <Detail label="系統" value={selected.system || selected.partType} />
              <Detail label="類型" value={selected.type || '—'} />
              <Detail label="旋轉" value={selected.spin || '—'} />
              <Detail label="Tier" value={selected.tier} color={TIER_COLORS[selected.tier]} />
              {selected.abbr && <Detail label="縮寫" value={selected.abbr} />}
              {selected.height && <Detail label="高度" value={`${selected.height}mm`} />}
              {selected.prongs && <Detail label="齒數" value={selected.prongs} />}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              分類：{selected.partType} | ID：{selected.id}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}
