import { BLADES, RATCHETS, BITS, getPartById, TIER_COLORS } from '../data/partsDatabase';

const TIER_SCORE = { 'T0': 10, 'T0.5': 8, 'T1': 6, 'T2': 3, 'T3': 1 };

// 協同加成表
const SYNERGY_BONUSES = [
  { blade: 'shark-scale', ratchet: 'r-4-50', bit: 'b-low-rush', bonus: 5, note: '極限上掀KO' },
  { blade: 'shark-scale', ratchet: 'r-1-70', bit: 'b-low-rush', bonus: 4, note: '高攻擊射程' },
  { blade: 'shark-scale', ratchet: 'r-1-60', bit: 'b-low-rush', bonus: 4, note: '低重心掃射' },
  { blade: 'shark-scale', ratchet: 'r-3-60', bit: 'b-rush', bonus: 3, note: '標準攻擊' },
  { blade: 'wizard-rod', ratchet: 'r-1-60', bit: 'b-hexa', bonus: 5, note: 'Meta基準防禦' },
  { blade: 'wizard-rod', ratchet: 'r-9-60', bit: 'b-hexa', bonus: 4, note: '高抗爆防禦' },
  { blade: 'wizard-rod', ratchet: 'r-9-60', bit: 'b-ball', bonus: 3, note: '純持久' },
  { blade: 'wizard-rod', ratchet: 'r-3-60', bit: 'b-free-ball', bonus: 3, note: '自由球持久' },
  { blade: 'cobalt-dragoon', ratchet: 'r-5-60', bit: 'b-elevate', bonus: 5, note: '最強左旋同化' },
  { blade: 'cobalt-dragoon', ratchet: 'r-2-60', bit: 'b-elevate', bonus: 4, note: '輕量左旋同化' },
  { blade: 'cobalt-dragoon', ratchet: 'r-9-60', bit: 'b-level', bonus: 3, note: '攻擊型左旋' },
  { blade: 'meteor-dragoon', ratchet: 'r-7-60', bit: 'b-level', bonus: 5, note: '最佳磨合左旋' },
  { blade: 'meteor-dragoon', ratchet: 'r-9-60', bit: 'b-level', bonus: 4, note: '高穩定左旋' },
  { blade: 'meteor-dragoon', ratchet: 'r-5-60', bit: 'b-level', bonus: 3, note: '輕量左旋' },
  { blade: 'hover-wyvern', ratchet: 'r-9-60', bit: 'b-kick', bonus: 4, note: '洋芋片踢擊' },
  { blade: 'hover-wyvern', ratchet: 'r-1-60', bit: 'b-low-rush', bonus: 3, note: '狙擊型' },
  { blade: 'aero-pegasus', ratchet: 'r-3-60', bit: 'b-ball', bonus: 3, note: '泛用平衡' },
  { blade: 'aero-pegasus', ratchet: 'r-9-60', bit: 'b-hexa', bonus: 3, note: '防禦飛馬' },
];

function getComboScore(bladeId, ratchetId, bitId) {
  const blade = getPartById(bladeId);
  const ratchet = getPartById(ratchetId);
  const bit = getPartById(bitId);
  if (!blade || !ratchet || !bit) return { score: 0, synergy: null };

  let score = (TIER_SCORE[blade.tier] || 0) * 2 + (TIER_SCORE[ratchet.tier] || 0) + (TIER_SCORE[bit.tier] || 0) * 1.5;
  let synergy = null;

  for (const s of SYNERGY_BONUSES) {
    if (s.blade === bladeId && s.ratchet === ratchetId && s.bit === bitId) {
      score += s.bonus * 2;
      synergy = s;
      break;
    }
    if (s.blade === bladeId && s.bit === bitId) {
      score += s.bonus;
      synergy = s;
    }
    if (s.blade === bladeId && s.ratchet === ratchetId) {
      score += s.bonus * 0.5;
      if (!synergy) synergy = s;
    }
  }
  return { score, synergy };
}

function getCoverageScore(combos) {
  const types = new Set();
  const spins = new Set();
  combos.forEach(c => {
    const blade = getPartById(c.blade);
    if (blade) {
      types.add(blade.type);
      spins.add(blade.spin);
    }
  });
  let coverage = 0;
  if (types.has('攻擊')) coverage += 3;
  if (types.has('持久') || types.has('防禦')) coverage += 3;
  if (spins.has('左旋')) coverage += 4;
  if (types.size >= 3) coverage += 2;
  return coverage;
}

function assignRoles(combos) {
  return combos.map(c => {
    const blade = getPartById(c.blade);
    if (!blade) return { ...c, role: '先鋒' };
    if (blade.type === '攻擊' && blade.spin === '右旋') return { ...c, role: '先鋒' };
    if (blade.spin === '左旋') return { ...c, role: '中堅' };
    return { ...c, role: '大將' };
  });
}

export function generateRecommendations(inventory, topN = 3) {
  const ownedBlades = BLADES.filter(b => inventory[b.id] > 0);
  const ownedRatchets = RATCHETS.filter(r => inventory[r.id] > 0);
  const ownedBits = BITS.filter(b => inventory[b.id] > 0);

  if (ownedBlades.length < 3 || ownedRatchets.length < 3 || ownedBits.length < 3) {
    return [];
  }

  // Generate all valid single combos
  const singleCombos = [];
  for (const bl of ownedBlades) {
    for (const ra of ownedRatchets) {
      for (const bi of ownedBits) {
        const { score, synergy } = getComboScore(bl.id, ra.id, bi.id);
        singleCombos.push({ blade: bl.id, ratchet: ra.id, bit: bi.id, score, synergy });
      }
    }
  }
  singleCombos.sort((a, b) => b.score - a.score);

  // Greedy: try top combos and build valid 3-bey decks
  const results = [];
  const topCombos = singleCombos.slice(0, Math.min(80, singleCombos.length));

  for (let i = 0; i < topCombos.length && results.length < topN * 3; i++) {
    const c1 = topCombos[i];
    for (let j = i + 1; j < topCombos.length && results.length < topN * 3; j++) {
      const c2 = topCombos[j];
      if (c2.blade === c1.blade || c2.ratchet === c1.ratchet || c2.bit === c1.bit) continue;
      // Check inventory counts
      const usedParts = {};
      [c1, c2].forEach(c => { [c.blade, c.ratchet, c.bit].forEach(p => { usedParts[p] = (usedParts[p] || 0) + 1; }); });
      let valid = true;
      for (const [pid, cnt] of Object.entries(usedParts)) {
        if ((inventory[pid] || 0) < cnt) { valid = false; break; }
      }
      if (!valid) continue;

      for (let k = j + 1; k < topCombos.length; k++) {
        const c3 = topCombos[k];
        if ([c1, c2].some(c => c3.blade === c.blade || c3.ratchet === c.ratchet || c3.bit === c.bit)) continue;
        const allUsed = { ...usedParts };
        [c3.blade, c3.ratchet, c3.bit].forEach(p => { allUsed[p] = (allUsed[p] || 0) + 1; });
        let allValid = true;
        for (const [pid, cnt] of Object.entries(allUsed)) {
          if ((inventory[pid] || 0) < cnt) { allValid = false; break; }
        }
        if (!allValid) continue;

        const trio = [c1, c2, c3];
        const deckScore = trio.reduce((s, c) => s + c.score, 0) + getCoverageScore(trio);
        results.push({ combos: assignRoles(trio), totalScore: deckScore });
        break;
      }
    }
  }

  results.sort((a, b) => b.totalScore - a.totalScore);
  // Deduplicate by blade set
  const seen = new Set();
  const unique = [];
  for (const r of results) {
    const key = r.combos.map(c => c.blade).sort().join('|');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
    if (unique.length >= topN) break;
  }
  return unique;
}

export function getMatchupAnalysis(combos) {
  let attack = 0, defense = 0, stamina = 0, counter = 0;
  combos.forEach(c => {
    const blade = getPartById(c.blade);
    const bit = getPartById(c.bit);
    if (!blade) return;
    if (blade.type === '攻擊') attack += 3;
    if (blade.type === '防禦') defense += 3;
    if (blade.type === '持久') { stamina += 3; defense += 1; }
    if (blade.type === '平衡') { attack += 1; stamina += 1; defense += 1; }
    if (blade.spin === '左旋') counter += 4;
    if (bit) {
      if (['T0', 'T0.5'].includes(bit.tier)) {
        if (bit.type === '攻擊') attack += 2;
        if (bit.type === '防禦') defense += 2;
        if (bit.type === '持久') stamina += 2;
      }
    }
  });
  const max = Math.max(attack, defense, stamina, counter, 1);
  return {
    attack: Math.round((attack / max) * 100),
    defense: Math.round((defense / max) * 100),
    stamina: Math.round((stamina / max) * 100),
    counter: Math.round((counter / max) * 100),
  };
}

export function getComboDescription(combo) {
  const blade = getPartById(combo.blade);
  const ratchet = getPartById(combo.ratchet);
  const bit = getPartById(combo.bit);
  if (!blade || !ratchet || !bit) return '';
  return `${blade.name} ${ratchet.name} ${bit.name}`;
}
