import { useState, useMemo } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { generateRecommendations, getMatchupAnalysis, getComboDescription } from '../utils/deckEngine';
import { getPartById, TIER_COLORS } from '../data/partsDatabase';

const ROLE_ICONS = { '先鋒': '🔰', '中堅': '🔄', '大將': '👑' };

function RadarChart({ data }) {
  const cx = 100, cy = 100, r = 70;
  const labels = [
    { key: 'attack', label: '攻擊', angle: -90 },
    { key: 'defense', label: '防禦', angle: 0 },
    { key: 'stamina', label: '持久', angle: 90 },
    { key: 'counter', label: '反制', angle: 180 },
  ];

  const toXY = (angle, radius) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  const points = labels.map(l => {
    const val = (data[l.key] || 0) / 100;
    return toXY(l.angle, r * val);
  });
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 200 200" style={{ width: 180, height: 180 }}>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s} points={labels.map(l => toXY(l.angle, r * s)).map(p => `${p.x},${p.y}`).join(' ')}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {labels.map(l => {
        const ep = toXY(l.angle, r + 20);
        return <text key={l.key} x={ep.x} y={ep.y} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Outfit">{l.label}</text>;
      })}
      <polygon points={polyPoints} fill="rgba(102, 126, 234, 0.25)" stroke="#667eea" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#667eea" stroke="#fff" strokeWidth="1" />
      ))}
    </svg>
  );
}

export default function AdvisorPage() {
  const { inventory, applyRecommendation } = useInventoryStore();
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalParts = Object.values(inventory).reduce((a, b) => a + b, 0);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      const results = generateRecommendations(inventory, 3);
      setRecs(results);
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🧠 AI 配置建議 ADVISOR</h1>
        <p>基於你的武器庫，自動計算最強 3-on-3 牌組</p>
      </div>

      {totalParts === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧠</div>
          <p>武器庫是空的！請先到武器庫頁面新增零件，AI 才能幫你配裝。</p>
        </div>
      ) : (
        <>
          <div className="action-bar">
            <button className="btn btn-gold" onClick={handleGenerate} disabled={loading}>
              <Sparkles size={16} /> {loading ? '計算中...' : '🚀 一鍵生成最強牌組'}
            </button>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} /> 武器庫中有 {totalParts} 個零件可用
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 48, animation: 'spin-slow 1s linear infinite', display: 'inline-block' }}>🌀</div>
              <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>正在計算所有合法組合的戰力值...</p>
            </div>
          )}

          {recs && !loading && recs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">😅</div>
              <p>零件不足以組成合法的 3-on-3 牌組（需要至少 3 個不同的之刃、棘輪、軸心）</p>
            </div>
          )}

          {recs && !loading && recs.map((rec, idx) => {
            const matchup = getMatchupAnalysis(rec.combos);
            return (
              <div className="rec-card" key={idx}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 16 }}>
                  <div>
                    <div className="rec-rank">#{idx + 1}</div>
                    <div className="rec-score">戰力 {Math.round(rec.totalScore)}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {rec.combos.map((c, ci) => {
                      const blade = getPartById(c.blade);
                      const ratchet = getPartById(c.ratchet);
                      const bit = getPartById(c.bit);
                      return (
                        <div key={ci} style={{ marginBottom: 10, padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>{ROLE_ICONS[c.role]}</span>
                            <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 13 }}>
                              {blade?.name} {ratchet?.name} {bit?.abbr}
                            </span>
                            <span className="tier-badge" style={{
                              background: `${TIER_COLORS[blade?.tier]}22`,
                              color: TIER_COLORS[blade?.tier],
                              border: `1px solid ${TIER_COLORS[blade?.tier]}44`,
                              fontSize: 9
                            }}>{blade?.tier}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 'auto' }}>{c.role}</span>
                          </div>
                          {c.synergy && (
                            <div style={{ fontSize: 11, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Sparkles size={12} /> 協同加成: {c.synergy.note} (+{c.synergy.bonus * 2})
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <RadarChart data={matchup} />
                </div>
                <button className="btn btn-accent" onClick={() => applyRecommendation(rec.combos)}>
                  <ArrowRight size={16} /> 套用到牌組構築器
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
