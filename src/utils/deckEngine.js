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

// 發射方式建議系統
export function getLaunchAdvice(combo) {
  const blade = getPartById(combo.blade);
  const ratchet = getPartById(combo.ratchet);
  const bit = getPartById(combo.bit);
  if (!blade || !ratchet || !bit) return null;

  const isAttackBit = ['b-low-rush','b-rush','b-kick','b-trans-kick','b-rubber-accel','b-gear-flat','b-flat','b-low-flat','b-accel','b-gear-rush'].includes(bit.id);
  const isStaminaBit = ['b-ball','b-free-ball','b-glide','b-unite','b-high-taper','b-metal-needle','b-needle','b-orb','b-taper','b-dot','b-point'].includes(bit.id);
  const isDefenseBit = ['b-hexa','b-bound-spike','b-spike'].includes(bit.id);
  const isBalanceBit = ['b-elevate','b-level'].includes(bit.id);
  const isLeftSpin = blade.spin === '左旋';
  const isLowHeight = ratchet.height <= 55;
  const isHighHeight = ratchet.height >= 75;

  let power = ''; // 力道
  let angle = ''; // 角度
  let timing = ''; // 時機
  let technique = ''; // 技巧名稱
  let detail = ''; // 詳細說明
  let emoji = '';

  if (isAttackBit) {
    if (bit.id === 'b-low-rush' || bit.id === 'b-rush' || bit.id === 'b-gear-rush') {
      power = '💪 全力 (90-100%)';
      angle = '📐 水平平射 (0°)';
      timing = '⏱️ 倒數同時發射，搶先觸發 X-Dash';
      technique = '滿力平射 (Full Power Flat Shot)';
      detail = isLowHeight
        ? '超低棘輪搭配衝刺軸心，平射後陀螺會貼地高速移動，利用上掀力從對手下方擊飛。發射瞬間手腕快速向內翻轉增加初速。'
        : '標準攻擊發射，全力拉繩讓軸心立刻接觸 X-Celerator 軌道觸發 Xtreme Dash，追求首次接觸就 KO。';
      emoji = '🔥';
    } else if (bit.id === 'b-kick' || bit.id === 'b-trans-kick') {
      power = '💪 強力 (80-90%)';
      angle = '📐 微傾斜射 (5-10°)';
      timing = '⏱️ 略慢於對手 0.5 秒，利用踢擊軌道反擊';
      technique = '延遲踢射 (Delayed Kick Shot)';
      detail = 'Kick 軸心的不規則移動是雙面刃。微傾角度發射讓陀螺先穩定 1-2 圈再觸發踢擊軌道，能更精準地撞擊已穩定的對手。';
      emoji = '🦶';
    } else if (bit.id === 'b-rubber-accel') {
      power = '💪 強力 (85-95%)';
      angle = '📐 水平平射 (0°)';
      timing = '⏱️ 與對手同步發射';
      technique = '橡膠加速射 (Rubber Accel Shot)';
      detail = '橡膠材質提供額外抓地力，平射後會有爆發性的加速效果。發射力道要足夠但不要過猛，讓橡膠軸心能穩定抓住場地面。';
      emoji = '⚡';
    } else {
      power = '💪 強力 (80-90%)';
      angle = '📐 水平平射 (0°)';
      timing = '⏱️ 標準時機';
      technique = '標準攻擊射 (Standard Attack Shot)';
      detail = '保持水平角度全力發射，讓攻擊型軸心發揮最大移動速度。注意控制發射方向，避免初始軌道偏離中心。';
      emoji = '⚔️';
    }
  } else if (isDefenseBit) {
    power = '🤚 中等 (50-65%)';
    angle = '📐 傾斜發射 (15-25°)';
    timing = '⏱️ 略早於對手發射，搶佔中心位置';
    technique = '傾斜定位射 (Tilt Position Shot)';
    detail = bit.id === 'b-hexa'
      ? 'Hexa 六角軸心的制動效果在傾斜發射時最有效。以 15-20° 角度發射，讓陀螺落地時微晃 → Hexa 的六角面會立刻產生制動力 → 陀螺快速穩定在場地中心。過度用力反而會降低穩定性。'
      : '防禦型軸心需要穩定而非速度。中等力道傾斜發射，讓陀螺在場地中心建立防禦陣地，等待對手撞上來。';
    emoji = '🛡️';
  } else if (isStaminaBit) {
    if (bit.id === 'b-free-ball') {
      power = '🤚 中等偏弱 (40-55%)';
      angle = '📐 垂直下壓 (30-45°)';
      timing = '⏱️ 可略晚發射，持久戰不急';
      technique = '柔力下壓射 (Soft Drop Shot)';
      detail = 'Free Ball 的自由滾動特性在低速時表現最佳。大角度下壓發射讓陀螺從高處穩定落入場地中心，自由球會自動找到最穩定的旋轉位置。切忌全力發射，會導致陀螺失控亂跑。';
      emoji = '🎱';
    } else {
      power = '🤚 中等 (45-60%)';
      angle = '📐 傾斜發射 (10-20°)';
      timing = '⏱️ 標準時機，保持穩定';
      technique = '穩定持久射 (Stable Stamina Shot)';
      detail = '持久型配置的發射核心是「穩」而非「猛」。適當的傾斜角度讓陀螺快速穩定，中等力道確保旋轉時間最長。發射時保持手腕穩定，避免左右晃動。';
      emoji = '🔄';
    }
  } else if (isBalanceBit) {
    if (bit.id === 'b-elevate') {
      power = isLeftSpin ? '💪 中強 (65-80%)' : '💪 強力 (75-85%)';
      angle = '📐 微傾斜射 (5-15°)';
      timing = '⏱️ 與對手同步或略晚';
      technique = isLeftSpin ? '左旋升降射 (L-Spin Elevate Shot)' : '升降攻擊射 (Elevate Attack Shot)';
      detail = isLeftSpin
        ? 'Elevate 搭配左旋刃是同化型戰術。中強力道讓 Elevate 的彎曲齒輪產生升降軌道，前期主動接觸對手吸收旋轉力，後期靠剩餘旋轉力取勝。發射角度不宜太大，保持接觸頻率。'
        : 'Elevate 的升降效果在右旋時增加打擊面高度變化，讓對手難以預測接觸點。';
      emoji = '↕️';
    } else if (bit.id === 'b-level') {
      power = isLeftSpin ? '💪 中強 (60-75%)' : '💪 強力 (70-85%)';
      angle = '📐 斜射 (10-20°)';
      timing = isLeftSpin ? '⏱️ 略晚 0.5-1 秒，後發制人' : '⏱️ 標準時機';
      technique = isLeftSpin ? '左旋變速射 (L-Spin Variable Shot)' : '雙模式射 (Dual Mode Shot)';
      detail = isLeftSpin
        ? 'Level 搭配左旋的精髓是「前攻後守」。中強力道斜射讓前期有足夠速度主動出擊，當速度下降後 Level 自動切換為持久模式，利用左旋優勢吸收對手殘餘旋轉。略晚發射可以讓對手先消耗。'
        : 'Level 的雙模式特性：前期高速 X-Dash 攻擊，後期自動轉為持久。斜射讓兩個模式都能發揮效果。';
      emoji = '🔀';
    }
  }

  // 特殊配置修正
  if (isLeftSpin && !isBalanceBit) {
    technique = '左旋 ' + technique;
    detail += ' ⬅️ 左旋注意：發射方向與右旋相反，需要特別練習拉繩/發射器的反向操作。';
  }

  if (isLowHeight && isAttackBit) {
    detail += ' 📏 超低棘輪加成：低重心讓接觸點低於對手，產生「上掀力」效果更佳。';
  }

  if (isHighHeight) {
    detail += ' 📏 高棘輪注意：重心較高容易頭重腳輕，發射時務必保持水平穩定。';
  }

  return { power, angle, timing, technique, detail, emoji };
}
