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
];

export function getCraftRecipes(clearedCount: number): CraftRecipe[] {
  return CRAFT_RECIPES.filter(r => r.minCleared <= clearedCount);
}
