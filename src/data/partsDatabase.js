// Beyblade X 完整零件資料庫 — 2026 Meta
export const PART_TYPES = {
  BLADE: 'blade',
  RATCHET: 'ratchet',
  BIT: 'bit',
  LOCK_CHIP: 'lockChip',
  MAIN_BLADE: 'mainBlade',
  ASSIST_BLADE: 'assistBlade',
};

export const SYSTEMS = { BX: 'BX', UX: 'UX', CX: 'CX' };
export const BLADE_TYPES = { ATTACK: '攻擊', DEFENSE: '防禦', STAMINA: '持久', BALANCE: '平衡' };
export const SPIN_DIR = { RIGHT: '右旋', LEFT: '左旋' };
export const TIERS = ['T0', 'T0.5', 'T1', 'T2', 'T3'];

export const BLADES = [
  // UX T0
  { id: 'wizard-rod', name: 'Wizard Rod', nameJP: '杖之魔術師', system: 'UX', type: '持久', spin: '右旋', tier: 'T0', code: 'UX-03' },
  { id: 'shark-scale', name: 'Shark Scale', nameJP: '鮫之鱗', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T0', code: 'UX' },
  { id: 'cobalt-dragoon', name: 'Cobalt Dragoon', nameJP: '鈷藍龍騎', system: 'UX', type: '攻擊', spin: '左旋', tier: 'T0', code: 'UX' },
  { id: 'meteor-dragoon', name: 'Meteor Dragoon', nameJP: '流星龍騎', system: 'UX', type: '攻擊', spin: '左旋', tier: 'T0', code: 'UX-17' },
  // UX T0.5
  { id: 'hover-wyvern', name: 'Hover Wyvern', nameJP: '懸浮飛龍', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T0.5', code: 'UX' },
  // UX T1
  { id: 'dran-buster-ux', name: 'Dran Buster', nameJP: '龍破', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-01' },
  { id: 'hells-hammer-ux', name: "Hell's Hammer", nameJP: '地獄之錘', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-02' },
  { id: 'impact-drake', name: 'Impact Drake', nameJP: '衝擊龍', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-11' },
  { id: 'aero-pegasus', name: 'Aero Pegasus', nameJP: '飛馬', system: 'UX', type: '平衡', spin: '右旋', tier: 'T1', code: 'UX-14' },
  { id: 'bullet-griffon', name: 'Bullet Griffon', nameJP: '子彈獅鷲', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T1', code: 'UX-19' },
  // UX T2
  { id: 'silver-wolf', name: 'Silver Wolf', nameJP: '銀狼', system: 'UX', type: '平衡', spin: '右旋', tier: 'T2', code: 'UX-04' },
  { id: 'shinobi-shadow', name: 'Shinobi Shadow', nameJP: '忍者影', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'UX-05' },
  { id: 'phoenix-rudder', name: 'Phoenix Rudder', nameJP: '鳳凰舵', system: 'UX', type: '持久', spin: '右旋', tier: 'T2', code: 'UX-06' },
  { id: 'leon-crest', name: 'Leon Crest', nameJP: '獅紋章', system: 'UX', type: '平衡', spin: '右旋', tier: 'T2', code: 'UX-07' },
  { id: 'knight-mail', name: 'Knight Mail', nameJP: '騎士鎧', system: 'UX', type: '防禦', spin: '右旋', tier: 'T2', code: 'UX-08' },
  { id: 'samurai-saber', name: 'Samurai Saber', nameJP: '武士刀', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'UX-09' },
  { id: 'ghost-circle', name: 'Ghost Circle', nameJP: '幽靈圓環', system: 'UX', type: '持久', spin: '右旋', tier: 'T2', code: 'UX-12' },
  { id: 'golem-rock', name: 'Golem Rock', nameJP: '岩石巨人', system: 'UX', type: '防禦', spin: '右旋', tier: 'T2', code: 'UX-13' },
  { id: 'scorpio-spear', name: 'Scorpio Spear', nameJP: '天蠍矛', system: 'UX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'UX-15' },
  { id: 'clock-mirage', name: 'Clock Mirage', nameJP: '時鐘幻影', system: 'UX', type: '持久', spin: '右旋', tier: 'T2', code: 'UX-16' },
  { id: 'mummy-curse', name: 'Mummy Curse', nameJP: '木乃伊詛咒', system: 'UX', type: '平衡', spin: '右旋', tier: 'T2', code: 'UX-18' },
  // BX
  { id: 'dran-sword', name: 'Dran Sword', nameJP: '龍劍', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T3', code: 'BX-01' },
  { id: 'hells-scythe', name: "Hell's Scythe", nameJP: '地獄鐮刀', system: 'BX', type: '平衡', spin: '右旋', tier: 'T2', code: 'BX-02' },
  { id: 'knight-shield', name: 'Knight Shield', nameJP: '騎士盾', system: 'BX', type: '防禦', spin: '右旋', tier: 'T3', code: 'BX' },
  { id: 'wizard-arrow', name: 'Wizard Arrow', nameJP: '魔箭', system: 'BX', type: '持久', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'viper-tail', name: 'Viper Tail', nameJP: '蛇尾', system: 'BX', type: '持久', spin: '右旋', tier: 'T3', code: 'BX' },
  { id: 'leon-claw', name: 'Leon Claw', nameJP: '獅爪', system: 'BX', type: '平衡', spin: '右旋', tier: 'T3', code: 'BX' },
  { id: 'phoenix-wing', name: 'Phoenix Wing', nameJP: '鳳翼', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'shark-edge', name: 'Shark Edge', nameJP: '鯊刃', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'tyranno-beat', name: 'Tyranno Beat', nameJP: '暴龍擊', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'hells-chain', name: "Hell's Chain", nameJP: '地獄鏈', system: 'BX', type: '防禦', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'wyvern-gale', name: 'Wyvern Gale', nameJP: '飛龍風', system: 'BX', type: '持久', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'cobalt-drake', name: 'Cobalt Drake', nameJP: '鈷藍龍', system: 'BX', type: '攻擊', spin: '右旋', tier: 'T2', code: 'BX' },
  { id: 'unicorn-sting', name: 'Unicorn Sting', nameJP: '獨角獸刺', system: 'BX', type: '平衡', spin: '右旋', tier: 'T3', code: 'BX' },
  { id: 'sphinx-cowl', name: 'Sphinx Cowl', nameJP: '獅身人面', system: 'BX', type: '防禦', spin: '右旋', tier: 'T3', code: 'BX' },
];

export const RATCHETS = [
  { id: 'r-0-60', name: '0-60', protrusions: 0, height: 60, tier: 'T2' },
  { id: 'r-0-70', name: '0-70', protrusions: 0, height: 70, tier: 'T2' },
  { id: 'r-0-80', name: '0-80', protrusions: 0, height: 80, tier: 'T2' },
  { id: 'r-1-50', name: '1-50', protrusions: 1, height: 50, tier: 'T2' },
  { id: 'r-1-60', name: '1-60', protrusions: 1, height: 60, tier: 'T0' },
  { id: 'r-1-70', name: '1-70', protrusions: 1, height: 70, tier: 'T0' },
  { id: 'r-1-80', name: '1-80', protrusions: 1, height: 80, tier: 'T2' },
  { id: 'r-2-60', name: '2-60', protrusions: 2, height: 60, tier: 'T1' },
  { id: 'r-2-70', name: '2-70', protrusions: 2, height: 70, tier: 'T2' },
  { id: 'r-2-80', name: '2-80', protrusions: 2, height: 80, tier: 'T2' },
  { id: 'r-3-60', name: '3-60', protrusions: 3, height: 60, tier: 'T0.5' },
  { id: 'r-3-70', name: '3-70', protrusions: 3, height: 70, tier: 'T2' },
  { id: 'r-3-80', name: '3-80', protrusions: 3, height: 80, tier: 'T2' },
  { id: 'r-3-85', name: '3-85', protrusions: 3, height: 85, tier: 'T2' },
  { id: 'r-4-50', name: '4-50', protrusions: 4, height: 50, tier: 'T0' },
  { id: 'r-4-55', name: '4-55', protrusions: 4, height: 55, tier: 'T2' },
  { id: 'r-4-60', name: '4-60', protrusions: 4, height: 60, tier: 'T1' },
  { id: 'r-4-70', name: '4-70', protrusions: 4, height: 70, tier: 'T2' },
  { id: 'r-4-80', name: '4-80', protrusions: 4, height: 80, tier: 'T2' },
  { id: 'r-5-60', name: '5-60', protrusions: 5, height: 60, tier: 'T0.5' },
  { id: 'r-5-70', name: '5-70', protrusions: 5, height: 70, tier: 'T2' },
  { id: 'r-5-80', name: '5-80', protrusions: 5, height: 80, tier: 'T2' },
  { id: 'r-6-60', name: '6-60', protrusions: 6, height: 60, tier: 'T2' },
  { id: 'r-6-70', name: '6-70', protrusions: 6, height: 70, tier: 'T2' },
  { id: 'r-6-80', name: '6-80', protrusions: 6, height: 80, tier: 'T2' },
  { id: 'r-7-55', name: '7-55', protrusions: 7, height: 55, tier: 'T2' },
  { id: 'r-7-60', name: '7-60', protrusions: 7, height: 60, tier: 'T0.5' },
  { id: 'r-7-70', name: '7-70', protrusions: 7, height: 70, tier: 'T1' },
  { id: 'r-7-80', name: '7-80', protrusions: 7, height: 80, tier: 'T2' },
  { id: 'r-8-70', name: '8-70', protrusions: 8, height: 70, tier: 'T2' },
  { id: 'r-9-60', name: '9-60', protrusions: 9, height: 60, tier: 'T0' },
  { id: 'r-9-65', name: '9-65', protrusions: 9, height: 65, tier: 'T2' },
  { id: 'r-9-70', name: '9-70', protrusions: 9, height: 70, tier: 'T1' },
  { id: 'r-9-80', name: '9-80', protrusions: 9, height: 80, tier: 'T2' },
  { id: 'r-m-85', name: 'M-85', protrusions: 0, height: 85, tier: 'T2' },
];

export const BITS = [
  { id: 'b-low-rush', name: 'Low Rush', abbr: 'LR', type: '攻擊', tier: 'T0' },
  { id: 'b-hexa', name: 'Hexa', abbr: 'H', type: '防禦', tier: 'T0' },
  { id: 'b-elevate', name: 'Elevate', abbr: 'E', type: '平衡', tier: 'T0' },
  { id: 'b-level', name: 'Level', abbr: 'L', type: '平衡', tier: 'T0' },
  { id: 'b-free-ball', name: 'Free Ball', abbr: 'FB', type: '持久', tier: 'T0' },
  { id: 'b-rubber-accel', name: 'Rubber Accel', abbr: 'RA', type: '攻擊', tier: 'T1' },
  { id: 'b-rush', name: 'Rush', abbr: 'R', type: '攻擊', tier: 'T1' },
  { id: 'b-kick', name: 'Kick', abbr: 'K', type: '攻擊', tier: 'T1' },
  { id: 'b-trans-kick', name: 'Trans Kick', abbr: 'TK', type: '攻擊', tier: 'T1' },
  { id: 'b-glide', name: 'Glide', abbr: 'G', type: '持久', tier: 'T1' },
  { id: 'b-unite', name: 'Unite', abbr: 'U', type: '持久', tier: 'T1' },
  { id: 'b-high-taper', name: 'High Taper', abbr: 'HT', type: '持久', tier: 'T1' },
  { id: 'b-ball', name: 'Ball', abbr: 'B', type: '持久', tier: 'T1' },
  { id: 'b-metal-needle', name: 'Metal Needle', abbr: 'MN', type: '持久', tier: 'T1' },
  { id: 'b-gear-flat', name: 'Gear Flat', abbr: 'GF', type: '攻擊', tier: 'T1' },
  { id: 'b-accel', name: 'Accel', abbr: 'A', type: '攻擊', tier: 'T2' },
  { id: 'b-disc-ball', name: 'Disc Ball', abbr: 'DB', type: '持久', tier: 'T2' },
  { id: 'b-gear-ball', name: 'Gear Ball', abbr: 'GB', type: '持久', tier: 'T2' },
  { id: 'b-bound-spike', name: 'Bound Spike', abbr: 'BS', type: '防禦', tier: 'T2' },
  { id: 'b-cyclone', name: 'Cyclone', abbr: 'C', type: '攻擊', tier: 'T2' },
  { id: 'b-dot', name: 'Dot', abbr: 'D', type: '持久', tier: 'T2' },
  { id: 'b-flat', name: 'Flat', abbr: 'F', type: '攻擊', tier: 'T2' },
  { id: 'b-low-flat', name: 'Low Flat', abbr: 'LF', type: '攻擊', tier: 'T2' },
  { id: 'b-gear-rush', name: 'Gear Rush', abbr: 'GR', type: '攻擊', tier: 'T2' },
  { id: 'b-needle', name: 'Needle', abbr: 'N', type: '持久', tier: 'T2' },
  { id: 'b-high-needle', name: 'High Needle', abbr: 'HN', type: '持久', tier: 'T2' },
  { id: 'b-gear-needle', name: 'Gear Needle', abbr: 'GN', type: '持久', tier: 'T2' },
  { id: 'b-under-needle', name: 'Under Needle', abbr: 'UN', type: '持久', tier: 'T2' },
  { id: 'b-orb', name: 'Orb', abbr: 'O', type: '持久', tier: 'T2' },
  { id: 'b-low-orb', name: 'Low Orb', abbr: 'LO', type: '持久', tier: 'T2' },
  { id: 'b-point', name: 'Point', abbr: 'P', type: '持久', tier: 'T2' },
  { id: 'b-gear-point', name: 'Gear Point', abbr: 'GP', type: '持久', tier: 'T2' },
  { id: 'b-trans-point', name: 'Trans Point', abbr: 'TP', type: '持久', tier: 'T2' },
  { id: 'b-spike', name: 'Spike', abbr: 'S', type: '防禦', tier: 'T2' },
  { id: 'b-taper', name: 'Taper', abbr: 'T', type: '持久', tier: 'T2' },
  { id: 'b-wedge', name: 'Wedge', abbr: 'W', type: '攻擊', tier: 'T2' },
  { id: 'b-jolt', name: 'Jolt', abbr: 'J', type: '攻擊', tier: 'T2' },
  { id: 'b-operate', name: 'Operate', abbr: 'Op', type: '特殊', tier: 'T2' },
  { id: 'b-quake', name: 'Quake', abbr: 'Q', type: '攻擊', tier: 'T2' },
  { id: 'b-zap', name: 'Zap', abbr: 'Z', type: '攻擊', tier: 'T2' },
];

export const CX_LOCK_CHIPS = [
  'Bahamut','Cerberus','Dran','Emperor','Eva','Fox','Hells','Hornet','Knight','Kraken',
  'Leon','Pegasus','Perseus','Phoenix','Ragna','Rhino','Sol','Stag','Unicorn','Valkyrie','Whale','Wizard','Wolf'
].map(n => ({ id: `lc-${n.toLowerCase()}`, name: n, tier: n === 'Pegasus' || n === 'Wizard' ? 'T1' : 'T2' }));

export const CX_MAIN_BLADES = [
  { name: 'Blast', tier: 'T0' }, { name: 'Might', tier: 'T1' }, { name: 'Reaper', tier: 'T1' },
  { name: 'Antler', tier: 'T2' }, { name: 'Arc', tier: 'T2' }, { name: 'Brave', tier: 'T2' },
  { name: 'Brush', tier: 'T3' }, { name: 'Dark', tier: 'T2' }, { name: 'Eclipse', tier: 'T2' },
  { name: 'Fang', tier: 'T2' }, { name: 'Flame', tier: 'T2' }, { name: 'Flare', tier: 'T2' },
  { name: 'Fort', tier: 'T2' }, { name: 'Hunt', tier: 'T2' }, { name: 'Volt', tier: 'T2' }, { name: 'Wriggle', tier: 'T3' },
].map(p => ({ id: `mb-${p.name.toLowerCase()}`, ...p }));

export const CX_ASSIST_BLADES = [
  { name: 'Wheel', tier: 'T0', type: '平衡' }, { name: 'Heavy', tier: 'T0', type: '攻擊' },
  { name: 'Erase', tier: 'T1', type: '防禦' }, { name: 'Slash', tier: 'T1', type: '攻擊' },
  { name: 'Massive', tier: 'T1', type: '防禦' },
  { name: 'Assault', tier: 'T2', type: '攻擊' }, { name: 'Bumper', tier: 'T2', type: '防禦' },
  { name: 'Charge', tier: 'T2', type: '攻擊' }, { name: 'Dual', tier: 'T2', type: '平衡' },
  { name: 'Free', tier: 'T2', type: '持久' }, { name: 'Jaggy', tier: 'T2', type: '攻擊' },
  { name: 'Knuckle', tier: 'T2', type: '攻擊' }, { name: 'Odd', tier: 'T2', type: '特殊' },
  { name: 'Round', tier: 'T2', type: '持久' }, { name: 'Turn', tier: 'T2', type: '平衡' },
  { name: 'Vertical', tier: 'T2', type: '攻擊' }, { name: 'Zillion', tier: 'T2', type: '攻擊' },
].map(p => ({ id: `ab-${p.name.toLowerCase()}`, ...p }));

// Helper: get all parts in flat list
export function getAllParts() {
  return [
    ...BLADES.map(p => ({ ...p, partType: PART_TYPES.BLADE })),
    ...RATCHETS.map(p => ({ ...p, partType: PART_TYPES.RATCHET })),
    ...BITS.map(p => ({ ...p, partType: PART_TYPES.BIT })),
    ...CX_LOCK_CHIPS.map(p => ({ ...p, partType: PART_TYPES.LOCK_CHIP })),
    ...CX_MAIN_BLADES.map(p => ({ ...p, partType: PART_TYPES.MAIN_BLADE })),
    ...CX_ASSIST_BLADES.map(p => ({ ...p, partType: PART_TYPES.ASSIST_BLADE })),
  ];
}

export function getPartById(id) {
  return getAllParts().find(p => p.id === id) || null;
}

export const TIER_COLORS = {
  'T0': '#ff6b6b', 'T0.5': '#ffa94d', 'T1': '#ffd43b', 'T2': '#69db7c', 'T3': '#868e96',
};

export const TYPE_ICONS = {
  '攻擊': '⚔️', '防禦': '🛡️', '持久': '🔄', '平衡': '⚖️', '特殊': '✨',
};
