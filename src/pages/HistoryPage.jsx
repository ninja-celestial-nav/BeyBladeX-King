import { useState } from 'react';
import { Trophy, Trash2, Share2, Swords, Plus } from 'lucide-react';
import useInventoryStore from '../store/useInventoryStore';
import { getPartById, TIER_COLORS } from '../data/partsDatabase';
import { getSingleComboAnalysis } from '../utils/deckEngine';

// 使用 localStorage 儲存戰績
const HISTORY_KEY = 'bx-battle-history';
function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } }
function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }

const RESULTS = ['勝利 🏆', '敗北 💀', '平手 🤝'];

export default function HistoryPage() {
  const [history, setHistory] = useState(loadHistory);
  const [showAdd, setShowAdd] = useState(false);
  const [showSim, setShowSim] = useState(false);
  const { savedDecks } = useInventoryStore();

  const addRecord = (record) => {
    const next = [{ ...record, id: Date.now(), date: new Date().toISOString() }, ...history];
    setHistory(next); saveHistory(next);
  };
  const deleteRecord = (id) => {
    const next = history.filter(h => h.id !== id);
    setHistory(next); saveHistory(next);
  };

  const wins = history.filter(h => h.result === '勝利 🏆').length;
  const losses = history.filter(h => h.result === '敗北 💀').length;
  const winRate = history.length > 0 ? Math.round((wins / history.length) * 100) : 0;

  // 分享牌組
  const shareDeck = (deck) => {
    const parts = Object.values(deck.deck).map(s => {
      const b = s.blade ? getPartById(s.blade) : null;
      const r = s.ratchet ? getPartById(s.ratchet) : null;
      const bi = s.bit ? getPartById(s.bit) : null;
      return `${b?.name||'?'} ${r?.name||'?'} ${bi?.abbr||'?'}`;
    });
    const text = `🌀 Beyblade X King 牌組分享\n📋 ${deck.name}\n\n🔰 先鋒: ${parts[0]}\n🔄 中堅: ${parts[1]}\n👑 大將: ${parts[2]}\n\n🔗 https://beybladex-king.vercel.app`;
    if (navigator.share) navigator.share({ title: 'BX King 牌組', text });
    else { navigator.clipboard.writeText(text); alert('已複製到剪貼簿！'); }
  };

  // 模擬對戰
  const runSimulation = () => {
    if (savedDecks.length < 1) { alert('請先儲存至少一套牌組'); return; }
    setShowSim(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>📊 戰績紀錄 HISTORY</h1>
        <p>記錄比賽結果、分享牌組、模擬對戰</p>
      </div>

      <div className="stats-row">
        <div className="stat-chip"><div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>{wins}</div><div className="stat-label">勝利</div></div></div>
        <div className="stat-chip"><div><div className="stat-value" style={{ color: 'var(--accent-red)' }}>{losses}</div><div className="stat-label">敗北</div></div></div>
        <div className="stat-chip"><div><div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{winRate}%</div><div className="stat-label">勝率</div></div></div>
        <div className="stat-chip"><div><div className="stat-value">{history.length}</div><div className="stat-label">總場次</div></div></div>
      </div>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> 新增戰績</button>
        <button className="btn btn-accent" onClick={runSimulation}><Swords size={16} /> 模擬對戰</button>
      </div>

      {savedDecks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'Orbitron', fontSize: 14, color: 'var(--accent-gold)', marginBottom: 12 }}>📤 分享牌組</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {savedDecks.map((d, i) => (
              <button key={i} className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => shareDeck(d)}>
                <Share2 size={14} /> {d.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>尚無戰績紀錄，點擊「新增戰績」開始記錄你的比賽！</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {history.map(h => (
            <div className="part-card" key={h.id} style={{ flexDirection: 'column', alignItems: 'stretch', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{h.result}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString('zh-TW')}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                {h.myDeck || '—'} vs {h.opponent || '—'}
              </div>
              {h.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{h.notes}</div>}
              <button onClick={() => deleteRecord(h.id)} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddRecordModal onClose={() => setShowAdd(false)} onAdd={addRecord} savedDecks={savedDecks} />}
      {showSim && <SimulationModal onClose={() => setShowSim(false)} savedDecks={savedDecks} />}
    </div>
  );
}

function AddRecordModal({ onClose, onAdd, savedDecks }) {
  const [result, setResult] = useState('勝利 🏆');
  const [myDeck, setMyDeck] = useState('');
  const [opponent, setOpponent] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>📝 新增戰績</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>比賽結果</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {RESULTS.map(r => (
                <button key={r} className={`tab-btn ${result === r ? 'active' : ''}`}
                  style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setResult(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>使用牌組</label>
            <select className="slot-select" value={myDeck} onChange={e => setMyDeck(e.target.value)}>
              <option value="">-- 選擇牌組 --</option>
              {savedDecks.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>對手 / 備註</label>
            <input className="slot-select" value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="對手名稱或備註..." />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>筆記</label>
            <input className="slot-select" value={notes} onChange={e => setNotes(e.target.value)} placeholder="例如：對手用 Shark Scale KO 了我的先鋒..." />
          </div>
          <button className="btn btn-gold" onClick={() => { onAdd({ result, myDeck, opponent, notes }); onClose(); }}>
            <Trophy size={16} /> 儲存紀錄
          </button>
        </div>
      </div>
    </div>
  );
}

function SimulationModal({ onClose, savedDecks }) {
  const [deckA, setDeckA] = useState(0);
  const [deckB, setDeckB] = useState(savedDecks.length > 1 ? 1 : 0);
  const [result, setResult] = useState(null);

  const simulate = () => {
    const dA = savedDecks[deckA], dB = savedDecks[deckB];
    if (!dA || !dB) return;
    const slotsA = Object.values(dA.deck), slotsB = Object.values(dB.deck);
    let scoreA = 0, scoreB = 0;
    const rounds = [];
    for (let i = 0; i < 3; i++) {
      const a = slotsA[i], b = slotsB[i];
      const anA = getSingleComboAnalysis(a), anB = getSingleComboAnalysis(b);
      if (!anA || !anB) continue;
      const totalA = anA.attack + anA.defense + anA.stamina + anA.burst;
      const totalB = anB.attack + anB.defense + anB.stamina + anB.burst;
      // 加入隨機性 ±15%
      const rA = totalA * (0.85 + Math.random() * 0.3), rB = totalB * (0.85 + Math.random() * 0.3);
      const bA = getPartById(a.blade), bB = getPartById(b.blade);
      const nameA = bA?.name || '?', nameB = bB?.name || '?';
      let winner, method;
      if (rA > rB * 1.3) { winner = 'A'; method = 'Xtreme Finish 🔥'; scoreA += 2; }
      else if (rA > rB) { winner = 'A'; method = 'Spin Finish 🔄'; scoreA += 1; }
      else if (rB > rA * 1.3) { winner = 'B'; method = 'Xtreme Finish 🔥'; scoreB += 2; }
      else { winner = 'B'; method = 'Spin Finish 🔄'; scoreB += 1; }
      rounds.push({ round: i + 1, nameA, nameB, winner, method, totalA: Math.round(rA), totalB: Math.round(rB) });
    }
    setResult({ rounds, scoreA, scoreB, winner: scoreA > scoreB ? dA.name : scoreB > scoreA ? dB.name : '平手' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 550 }}>
        <h2>⚔️ 模擬對戰</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 10, color: 'var(--text-secondary)' }}>牌組 A</label>
            <select className="slot-select" value={deckA} onChange={e => setDeckA(+e.target.value)}>
              {savedDecks.map((d, i) => <option key={i} value={i}>{d.name}</option>)}
            </select>
          </div>
          <span style={{ fontSize: 24, color: 'var(--accent-gold)' }}>⚡</span>
          <div>
            <label style={{ fontSize: 10, color: 'var(--text-secondary)' }}>牌組 B</label>
            <select className="slot-select" value={deckB} onChange={e => setDeckB(+e.target.value)}>
              {savedDecks.map((d, i) => <option key={i} value={i}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-gold" onClick={simulate} style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
          <Swords size={16} /> 開始模擬！
        </button>

        {result && (
          <div>
            <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, fontFamily: 'Orbitron', color: 'var(--accent-gold)', marginBottom: 12 }}>
              🏆 {result.winner} ({result.scoreA} - {result.scoreB})
            </div>
            {result.rounds.map(r => (
              <div key={r.round} style={{ padding: '8px 12px', marginBottom: 6, background: 'var(--bg-glass)', borderRadius: 8, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 2 }}>第 {r.round} 場</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: r.winner === 'A' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                    {r.nameA} ({r.totalA}) {r.winner === 'A' ? '✅' : ''}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>vs</span>
                  <span style={{ color: r.winner === 'B' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                    {r.nameB} ({r.totalB}) {r.winner === 'B' ? '✅' : ''}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--accent-gold)', marginTop: 2 }}>{r.method}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
