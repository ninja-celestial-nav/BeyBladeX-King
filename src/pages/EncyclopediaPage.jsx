import { useState, useMemo } from 'react';
import { Search, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { getAllParts, TIER_COLORS, TYPE_ICONS } from '../data/partsDatabase';

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

function getWikiName(part) {
  return part.name.replace(/'/g, '').replace(/\s+/g, '');
}
function getWikiUrl(part) { return `https://beyblade.fandom.com/wiki/${getWikiName(part)}`; }
function getSearchUrl(part) { return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent('Beyblade X ' + part.name + ' part official')}`; }

// 用零件名產生 Wikipedia 風格的圖片 URL（Fandom CDN）
function getWikiImgUrl(part) {
  const wn = getWikiName(part);
  // Fandom 預覽圖 pattern（會被 CORS 阻擋但瀏覽器 img src 能載入）
  return `https://static.wikia.nocookie.net/beyblade/images/thumb/${wn}.png/280px-${wn}.png`;
}

export default function EncyclopediaPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTier, setFilterTier] = useState('全部');
  const [selected, setSelected] = useState(null);
  const [imgError, setImgError] = useState({});
  const allParts = useMemo(() => getAllParts(), []);

  const filtered = allParts
    .filter(p => filterType === 'all' || p.partType === filterType)
    .filter(p => filterTier === '全部' || p.tier === filterTier)
    .filter(p => !search || [p.name, p.nameJP, p.nameCN, p.code, p.abbr]
      .some(v => v && v.toLowerCase().includes(search.toLowerCase())));

  const openPhoto = (part) => {
    // 直接開啟 Wiki 頁面看照片
    window.open(getWikiUrl(part), '_blank');
  };

  return (
    <div>
      <div className="page-header">
        <h1>📖 零件圖鑑 ENCYCLOPEDIA</h1>
        <p>全 {allParts.length} 種零件 — 點擊零件可查看詳細資料，點 📷 查看實物照片</p>
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
            <button onClick={e => { e.stopPropagation(); openPhoto(p); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px 6px', borderRadius: 6, transition: 'all 0.2s' }}
              title="查看實物照片">📷</button>
            <span className="tier-badge" style={{
              background: `${TIER_COLORS[p.tier]}22`, color: TIER_COLORS[p.tier],
              border: `1px solid ${TIER_COLORS[p.tier]}44`,
            }}>{p.tier}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>{TYPE_ICONS[selected.type] || '⚙️'} {selected.name}</h2>
              <span className="tier-badge" style={{
                background: `${TIER_COLORS[selected.tier]}22`, color: TIER_COLORS[selected.tier],
                border: `1px solid ${TIER_COLORS[selected.tier]}44`, fontSize: 14, padding: '4px 14px',
              }}>{selected.tier}</span>
            </div>

            {/* 圖片按鈕區 */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href={getWikiUrl(selected)} target="_blank" rel="noopener noreferrer"
                className="btn btn-accent" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
                <ExternalLink size={16} /> 📷 Wiki 實物照片
              </a>
              <a href={getSearchUrl(selected)} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none', flex: 1, justifyContent: 'center' }}>
                <ImageIcon size={16} /> 🔍 Google 圖片搜尋
              </a>
            </div>

            {/* 詳細資料 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: 16 }}>
              <Detail label="中文名稱" value={selected.nameCN || selected.nameJP || '—'} />
              <Detail label="產品代號" value={selected.code || '—'} />
              <Detail label="系統世代" value={selected.system || selected.partType} />
              <Detail label="戰鬥類型" value={selected.type || '—'} />
              <Detail label="旋轉方向" value={selected.spin || '—'} />
              <Detail label="競技等級" value={selected.tier} color={TIER_COLORS[selected.tier]} />
              {selected.abbr && <Detail label="縮寫代碼" value={selected.abbr} />}
              {selected.height != null && <Detail label="軸心高度" value={`${selected.height}mm`} />}
              {selected.protrusions != null && <Detail label="棘輪突起數" value={selected.protrusions} />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 0', borderTop: '1px solid var(--border-glass)' }}>
              零件分類：{selected.partType} | 內部 ID：{selected.id}
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
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: color || 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}
