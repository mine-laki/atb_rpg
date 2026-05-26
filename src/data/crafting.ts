// 装備合成レシピ定義

export type CraftResultType = 'material' | 'equipment';

export interface CraftRecipe {
  id: string;
  name: string;
  description: string;
  materials: { itemId: string; quantity: number }[];
  resultType: CraftResultType;
  resultItemId: string;
  resultQuantity: number;  // material の場合のみ使用
  minCleared: number;      // 最低クリアステージ数
}

export const CRAFT_RECIPES: CraftRecipe[] = [
  // ── 素材合成 ────────────────────────────────
  {
    id: 'craft_rare_stone',
    name: 'アダマンタイト合成',
    description: '灰チタン石5個 → アダマンタイト1個',
    materials: [{ itemId: 'enhance_stone_normal', quantity: 5 }],
    resultType: 'material',
    resultItemId: 'enhance_stone_rare',
    resultQuantity: 1,
    minCleared: 1,
  },
  {
    id: 'craft_crystal_all',
    name: '万能クリスタル精製',
    description: '各色クリスタル3個ずつ → 万能クリスタル1個',
    materials: [
      { itemId: 'crystal_atk', quantity: 3 },
      { itemId: 'crystal_bla', quantity: 3 },
      { itemId: 'crystal_def', quantity: 3 },
    ],
    resultType: 'material',
    resultItemId: 'crystal_all',
    resultQuantity: 1,
    minCleared: 2,
  },
  // ── 武器合成 ────────────────────────────────
  {
    id: 'craft_sword_dragon',
    name: '竜鱗の大剣 鍛造',
    description: '竜の鱗と灰チタン石から強力な剣を作る',
    materials: [
      { itemId: 'dragon_scale',         quantity: 3 },
      { itemId: 'enhance_stone_normal', quantity: 5 },
    ],
    resultType: 'equipment',
    resultItemId: 'sword_dragon',
    resultQuantity: 1,
    minCleared: 2,
  },
  {
    id: 'craft_staff_arcane',
    name: '魔導の杖 精製',
    description: '竜の牙とアダマンタイトから魔法の杖を作る',
    materials: [
      { itemId: 'dragon_fang',        quantity: 2 },
      { itemId: 'enhance_stone_rare', quantity: 1 },
    ],
    resultType: 'equipment',
    resultItemId: 'staff_arcane',
    resultQuantity: 1,
    minCleared: 3,
  },
  // ── アクセサリ合成 ───────────────────────────
  {
    id: 'craft_chain_charm',
    name: 'ガーンデーヴァ 合成',
    description: '各属性のお守りを組み合わせてチェーン強化品を作る',
    materials: [
      { itemId: 'acc_ice_amulet',     quantity: 1 },
      { itemId: 'acc_thunder_amulet', quantity: 1 },
      { itemId: 'dragon_scale',       quantity: 2 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_chain_charm',
    resultQuantity: 1,
    minCleared: 2,
  },
  {
    id: 'craft_str_ring',
    name: 'パワーリスト 鍛造',
    description: '竜の鱗とクリスタルから攻撃力強化リングを作る',
    materials: [
      { itemId: 'dragon_scale',  quantity: 2 },
      { itemId: 'crystal_atk',   quantity: 5 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_str_ring',
    resultQuantity: 1,
    minCleared: 2,
  },
  {
    id: 'craft_mag_ring',
    name: 'マジシャンサイン 精製',
    description: '竜の鱗と魔法クリスタルから魔力強化リングを作る',
    materials: [
      { itemId: 'dragon_scale',  quantity: 2 },
      { itemId: 'crystal_bla',   quantity: 5 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_mag_ring',
    resultQuantity: 1,
    minCleared: 2,
  },
  // ── 最高レア合成 ─────────────────────────────
  {
    id: 'craft_relic_omega',
    name: '始原の一振り 鍛造',
    description: '神の証と竜の牙から最強の剣を作る',
    materials: [
      { itemId: 'god_proof',          quantity: 1 },
      { itemId: 'dragon_fang',        quantity: 3 },
      { itemId: 'enhance_stone_rare', quantity: 2 },
    ],
    resultType: 'equipment',
    resultItemId: 'relic_omega',
    resultQuantity: 1,
    minCleared: 5,
  },
  {
    id: 'craft_relic_lich',
    name: '死霊の魔杖 精製',
    description: '神の証と闇の石から最強の杖を作る',
    materials: [
      { itemId: 'god_proof',          quantity: 1 },
      { itemId: 'acc_dark_stone',     quantity: 2 },
      { itemId: 'enhance_stone_rare', quantity: 2 },
    ],
    resultType: 'equipment',
    resultItemId: 'relic_lich',
    resultQuantity: 1,
    minCleared: 5,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  合成専用アクセサリ レシピ
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ── デメリット付き・高ステータス系 ──
  {
    id: 'craft_berserker',
    name: '狂戦士の腕輪 鍛造',
    description: '竜の鱗と赤クリスタルから作る。STR/MAG大幅UP、ATB鈍化のデメリット付き。',
    materials: [
      { itemId: 'dragon_scale',  quantity: 3 },
      { itemId: 'crystal_atk',   quantity: 8 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_berserker',
    resultQuantity: 1,
    minCleared: 2,
  },
  {
    id: 'craft_iron_shackle',
    name: '鉄の枷 鍛造',
    description: '大量の強化素材から作る超高耐久アクセサリ。ATBが大幅に鈍化する。',
    materials: [
      { itemId: 'enhance_stone_normal', quantity: 10 },
      { itemId: 'crystal_def',          quantity: 8 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_iron_shackle',
    resultQuantity: 1,
    minCleared: 2,
  },
  {
    id: 'craft_blood_pact',
    name: '血盟の証 精製',
    description: '竜の牙と赤クリスタルで作る。ダメージ+30%だが回復が激減する両刃の剣。',
    materials: [
      { itemId: 'dragon_fang',   quantity: 2 },
      { itemId: 'crystal_atk',   quantity: 5 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_blood_pact',
    resultQuantity: 1,
    minCleared: 3,
  },
  {
    id: 'craft_glass_cannon',
    name: 'ガラスの砲 精製',
    description: '竜の牙と青クリスタルで作る超高MAGアクセサリ。回復が半減するデメリットあり。',
    materials: [
      { itemId: 'dragon_fang',   quantity: 2 },
      { itemId: 'crystal_bla',   quantity: 5 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_glass_cannon',
    resultQuantity: 1,
    minCleared: 3,
  },
  {
    id: 'craft_sluggard',
    name: '怠惰の石板 鍛造',
    description: '神の証と防御クリスタルで作る。STR/MAG/HP全上昇だがATBが激遅になる。',
    materials: [
      { itemId: 'dragon_fang',   quantity: 2 },
      { itemId: 'crystal_atk',   quantity: 4 },
      { itemId: 'crystal_bla',   quantity: 4 },
      { itemId: 'crystal_def',   quantity: 4 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_sluggard',
    resultQuantity: 1,
    minCleared: 4,
  },

  // ── 高コスト・強力系 ──
  {
    id: 'craft_dragon_heart',
    name: '竜の心臓 精製',
    description: '竜の鱗5枚から作る。STR・HP・リジェネを同時強化する全能アクセサリ。',
    materials: [
      { itemId: 'dragon_scale',  quantity: 5 },
      { itemId: 'crystal_atk',   quantity: 3 },
      { itemId: 'crystal_hlr',   quantity: 3 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_dragon_heart',
    resultQuantity: 1,
    minCleared: 3,
  },
  {
    id: 'craft_arcane_focus',
    name: '魔法陣の核 精製',
    description: '竜の牙と青クリスタルの塊から作る。MAG+200・魔法コスト-1・チェーン強化。',
    materials: [
      { itemId: 'dragon_fang',        quantity: 3 },
      { itemId: 'crystal_bla',        quantity: 8 },
      { itemId: 'enhance_stone_rare', quantity: 1 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_arcane_focus',
    resultQuantity: 1,
    minCleared: 4,
  },
  {
    id: 'craft_phoenix_charm',
    name: '不死鳥の守護 精製',
    description: '神の証と緑クリスタルで作る。一度だけ戦闘不能から復活し、リジェネも付与。',
    materials: [
      { itemId: 'god_proof',          quantity: 1 },
      { itemId: 'crystal_hlr',        quantity: 5 },
      { itemId: 'enhance_stone_rare', quantity: 2 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_phoenix_charm',
    resultQuantity: 1,
    minCleared: 4,
  },
  {
    id: 'craft_chain_god',
    name: 'チェーン神器 鍛造',
    description: '竜の牙と複数クリスタルで作る。チェーン・ダメージ・ATBをまとめて強化。',
    materials: [
      { itemId: 'dragon_fang',   quantity: 2 },
      { itemId: 'crystal_atk',   quantity: 4 },
      { itemId: 'crystal_bla',   quantity: 4 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_chain_god',
    resultQuantity: 1,
    minCleared: 4,
  },
  {
    id: 'craft_omniscient',
    name: '全知の眼 精製',
    description: '神の証2個+竜の牙3本で作る最高峰全能アクセサリ。STR・MAG・HP・チェーンを全強化。',
    materials: [
      { itemId: 'god_proof',          quantity: 2 },
      { itemId: 'dragon_fang',        quantity: 3 },
      { itemId: 'enhance_stone_rare', quantity: 3 },
    ],
    resultType: 'equipment',
    resultItemId: 'acc_omniscient',
    resultQuantity: 1,
    minCleared: 5,
  },
];

export function getCraftRecipes(clearedCount: number): CraftRecipe[] {
  return CRAFT_RECIPES.filter(r => r.minCleared <= clearedCount);
}
