import type { EquipmentData, MaterialData } from '../types';

export const EQUIPMENT_DATA: EquipmentData[] = [
  // ---- 武器 ----
  { id: 'sword_rusty',   name: '錆びた剣',   emoji: '⚔️',  type: 'weapon', weaponType: 'sword',
    preferredRole: 'ATK', baseStats: { str: 15 }, effects: [], unlockStage: 0, shopPrice: 300 },
  { id: 'sword_steel',   name: '鋼鉄の剣',   emoji: '⚔️',  type: 'weapon', weaponType: 'sword',
    preferredRole: 'ATK', baseStats: { str: 25 }, effects: [{ type: 'atb_expand', value: 1 }], unlockStage: 1, shopPrice: 800 },
  { id: 'staff_old',     name: '古い杖',     emoji: '🪄',  type: 'weapon', weaponType: 'staff',
    preferredRole: 'BLA', baseStats: { mag: 20 }, effects: [], unlockStage: 0, shopPrice: 300 },
  { id: 'staff_magic',   name: '魔封の杖',   emoji: '🪄',  type: 'weapon', weaponType: 'staff',
    preferredRole: 'BLA', baseStats: { mag: 35 }, effects: [{ type: 'magic_cost_reduce', value: 1 }], unlockStage: 1, shopPrice: 1200 },
  { id: 'bow_silver',    name: '銀の弓',     emoji: '🏹',  type: 'weapon', weaponType: 'bow',
    baseStats: { str: 15, mag: 10 }, effects: [{ type: 'atb_speed', value: 0.15 }], unlockStage: 2, shopPrice: 1200 },
  { id: 'shield_heavy',  name: '重厚の盾',   emoji: '🛡',  type: 'weapon', weaponType: 'shield',
    preferredRole: 'DEF', baseStats: { def: 25, hp: 400 }, effects: [], unlockStage: 2, shopPrice: 1500 },
  { id: 'holy_item',     name: '聖なる具',   emoji: '📿',  type: 'weapon', weaponType: 'holy',
    preferredRole: 'HLR', baseStats: { mag: 15 }, effects: [{ type: 'heal_boost', value: 0.20 }], unlockStage: 3, shopPrice: 1500 },
  { id: 'instrument',    name: '魔法の楽器', emoji: '🎸',  type: 'weapon', weaponType: 'instrument',
    preferredRole: 'ENH', baseStats: {}, effects: [{ type: 'buff_extend', value: 0.20 }, { type: 'atb_speed', value: 0.15 }], unlockStage: 3, shopPrice: 2000 },
  { id: 'cursed_tool',   name: '呪具',       emoji: '💀',  type: 'weapon', weaponType: 'cursed',
    preferredRole: 'JAM', baseStats: { mag: 10 }, effects: [{ type: 'debuff_rate', value: 0.25 }], unlockStage: 3, shopPrice: 2500 },

  // ---- アクセサリ ----
  { id: 'acc_guard_small', name: 'アイアンバングル', emoji: '💎', type: 'accessory',
    baseStats: { hp: 150 }, effects: [], unlockStage: 0, shopPrice: 300 },
  { id: 'acc_guard',      name: 'ダイヤバングル',     emoji: '💎', type: 'accessory',
    baseStats: { hp: 300 }, effects: [{ type: 'damage_boost', value: -0.10 }], unlockStage: 1, shopPrice: 600 },
  { id: 'acc_speed_ring', name: '閃光のリング',     emoji: '💍', type: 'accessory',
    baseStats: {}, effects: [{ type: 'atb_speed', value: 0.15 }], unlockStage: 1, shopPrice: 800 },
  { id: 'acc_heal_orb',   name: '医療の心得',     emoji: '🔮', type: 'accessory',
    baseStats: {}, effects: [{ type: 'heal_boost', value: 0.25 }], unlockStage: 2, shopPrice: 1200 },
  { id: 'acc_chain_charm',name: 'ガーンデーヴァ',     emoji: '📿', type: 'accessory',
    baseStats: {}, effects: [{ type: 'chain_boost', value: 0.10 }], unlockStage: 2, shopPrice: 1000 },
  { id: 'acc_str_ring',   name: 'パワーリスト',   emoji: '🌟', type: 'accessory',
    baseStats: { str: 25 }, effects: [], unlockStage: 1, shopPrice: 700 },
  { id: 'acc_mag_ring',   name: 'マジシャンサイン',   emoji: '✨', type: 'accessory',
    baseStats: { mag: 25 }, effects: [], unlockStage: 1, shopPrice: 700 },
  { id: 'acc_fire_amulet',name: '炎の護符',   emoji: '🔥', type: 'accessory',
    baseStats: {}, effects: [{ type: 'element_resist', element: 'fire', value: 0.30 }], unlockStage: 4, shopPrice: 1800 },
  { id: 'acc_ice_amulet', name: '氷の護符',   emoji: '🧊', type: 'accessory',
    baseStats: {}, effects: [{ type: 'element_resist', element: 'ice', value: 0.30 }], unlockStage: 4, shopPrice: 1800 },
  { id: 'acc_thunder_amulet', name: '雷の護符', emoji: '⚡', type: 'accessory',
    baseStats: {}, effects: [{ type: 'element_resist', element: 'thunder', value: 0.30 }], unlockStage: 4, shopPrice: 1800 },
  { id: 'acc_dark_stone', name: '闇の石',     emoji: '💀', type: 'accessory',
    baseStats: {}, effects: [{ type: 'atb_expand', value: 1 }], unlockStage: 999, shopPrice: 4000 },
  { id: 'acc_wind_feather',name: '風の羽根',  emoji: '🌀', type: 'accessory',
    baseStats: {}, effects: [{ type: 'atb_speed', value: 0.20 }, { type: 'chain_boost', value: 0.05 }], unlockStage: 5, shopPrice: 2500 },
  { id: 'acc_gear',       name: '精密歯車',   emoji: '⚙️', type: 'accessory',
    baseStats: {}, effects: [{ type: 'damage_boost', value: 0.10 }], unlockStage: 5, shopPrice: 3000 },
  { id: 'acc_nature_stone',name: '自然の石',  emoji: '🌿', type: 'accessory',
    baseStats: {}, effects: [{ type: 'auto_regen', value: 0.003 }], unlockStage: 999, shopPrice: 5000 },
  { id: 'god_proof',      name: '神の証',     emoji: '🔱', type: 'accessory',
    baseStats: { str: 30, mag: 30, hp: 300 }, effects: [{ type: 'damage_boost', value: 0.10 }], unlockStage: 999, shopPrice: 0 },

  // ---- 追加武器 ----
  { id: 'sword_dragon',   name: '竜鱗の大剣', emoji: '🗡️', type: 'weapon', weaponType: 'sword',
    preferredRole: 'ATK', baseStats: { str: 40, hp: 200 }, effects: [{ type: 'damage_boost', value: 0.10 }], unlockStage: 3, shopPrice: 2800 },
  { id: 'staff_holy',     name: '聖光の杖',   emoji: '✨', type: 'weapon', weaponType: 'holy',
    preferredRole: 'HLR', baseStats: { mag: 45 }, effects: [{ type: 'heal_boost', value: 0.25 }, { type: 'buff_extend', value: 0.15 }], unlockStage: 3, shopPrice: 3000 },
  { id: 'staff_dark',     name: '闇の杖',     emoji: '🌑', type: 'weapon', weaponType: 'cursed',
    preferredRole: 'BLA', baseStats: { mag: 50 }, effects: [{ type: 'debuff_rate', value: 0.20 }, { type: 'magic_cost_reduce', value: 1 }], unlockStage: 4, shopPrice: 3500 },
  { id: 'bow_swift',      name: '疾風の弓',   emoji: '💨', type: 'weapon', weaponType: 'bow',
    baseStats: { str: 20, mag: 20 }, effects: [{ type: 'atb_speed', value: 0.25 }, { type: 'chain_boost', value: 0.08 }], unlockStage: 4, shopPrice: 4000 },
  { id: 'sword_masterwork', name: '極剣',     emoji: '⚔️', type: 'weapon', weaponType: 'sword',
    preferredRole: 'ATK', baseStats: { str: 60 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'damage_boost', value: 0.12 }], unlockStage: 5, shopPrice: 6000 },
  // ATB拡張 – 各武器種最強
  { id: 'staff_arcane',     name: '魔導の杖',     emoji: '🔯', type: 'weapon', weaponType: 'staff',
    preferredRole: 'BLA', baseStats: { mag: 60 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'magic_cost_reduce', value: 1 }], unlockStage: 5, shopPrice: 6500 },
  { id: 'bow_heaven',       name: '天空の弓',     emoji: '🏹', type: 'weapon', weaponType: 'bow',
    baseStats: { str: 30, mag: 30 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'chain_boost', value: 0.10 }], unlockStage: 5, shopPrice: 6500 },
  { id: 'shield_aegis',     name: '神盾',         emoji: '🛡️', type: 'weapon', weaponType: 'shield',
    preferredRole: 'DEF', baseStats: { def: 40, hp: 700 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'damage_boost', value: -0.05 }], unlockStage: 5, shopPrice: 6000 },
  { id: 'holy_archangel',   name: '大天使の聖具', emoji: '👼', type: 'weapon', weaponType: 'holy',
    preferredRole: 'HLR', baseStats: { mag: 25 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'heal_boost', value: 0.35 }], unlockStage: 5, shopPrice: 6000 },
  { id: 'instrument_harmony', name: '響鳴の楽器', emoji: '🎵', type: 'weapon', weaponType: 'instrument',
    preferredRole: 'ENH', baseStats: {}, effects: [{ type: 'atb_expand', value: 1 }, { type: 'buff_extend', value: 0.35 }, { type: 'atb_speed', value: 0.20 }], unlockStage: 5, shopPrice: 6500 },
  { id: 'cursed_void',      name: '虚無の呪具',   emoji: '🌀', type: 'weapon', weaponType: 'cursed',
    preferredRole: 'JAM', baseStats: { mag: 20 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'debuff_rate', value: 0.40 }], unlockStage: 5, shopPrice: 6000 },
  // ボスドロップ限定レア武器 (shopPrice: 0)
  { id: 'relic_chaos',      name: 'カオスブレード', emoji: '⚡', type: 'weapon', weaponType: 'sword',
    preferredRole: 'ATK', baseStats: { str: 90 }, effects: [{ type: 'chain_boost', value: 0.30 }, { type: 'damage_boost', value: 0.20 }], unlockStage: 999, shopPrice: 0 },
  { id: 'relic_lich',       name: '死霊の魔杖',   emoji: '💀', type: 'weapon', weaponType: 'staff',
    preferredRole: 'BLA', baseStats: { mag: 90 }, effects: [{ type: 'magic_cost_reduce', value: 1 }, { type: 'chain_boost', value: 0.25 }], unlockStage: 999, shopPrice: 0 },
  { id: 'relic_guardian',   name: '守護の聖盾',   emoji: '✨', type: 'weapon', weaponType: 'shield',
    preferredRole: 'DEF', baseStats: { def: 55, hp: 1200 }, effects: [{ type: 'auto_regen', value: 0.006 }, { type: 'atb_expand', value: 1 }], unlockStage: 999, shopPrice: 0 },
  { id: 'relic_seraph',     name: '熾天使の聖具', emoji: '🌟', type: 'weapon', weaponType: 'holy',
    preferredRole: 'HLR', baseStats: { mag: 40 }, effects: [{ type: 'heal_boost', value: 0.50 }, { type: 'buff_extend', value: 0.30 }, { type: 'atb_expand', value: 1 }], unlockStage: 999, shopPrice: 0 },
  { id: 'relic_omega',      name: '始原の一振り', emoji: '🔱', type: 'weapon', weaponType: 'sword',
    preferredRole: 'ATK', baseStats: { str: 100 }, effects: [{ type: 'atb_expand', value: 1 }, { type: 'chain_boost', value: 0.20 }, { type: 'damage_boost', value: 0.15 }], unlockStage: 999, shopPrice: 0 },

  // ---- 追加アクセサリ（auto_buff: 戦闘開始時バフ付与）----
  { id: 'acc_haste_ring',  name: '加速の石',   emoji: '⚡', type: 'accessory',
    baseStats: {}, effects: [{ type: 'auto_buff', value: 15, buffId: 'haste' }], unlockStage: 2, shopPrice: 2000 },
  { id: 'acc_prot_charm',  name: '鉄壁の守り', emoji: '🛡️', type: 'accessory',
    baseStats: { hp: 200 }, effects: [{ type: 'auto_buff', value: 20, buffId: 'prot' }], unlockStage: 2, shopPrice: 1800 },
  { id: 'acc_faith_gem',   name: '信念の宝玉', emoji: '🔮', type: 'accessory',
    baseStats: {}, effects: [{ type: 'auto_buff', value: 18, buffId: 'faith' }], unlockStage: 3, shopPrice: 2200 },
  { id: 'acc_regen_stone', name: 'リジェネ石',  emoji: '🌿', type: 'accessory',
    baseStats: {}, effects: [{ type: 'auto_buff', value: 30, buffId: 'regen' }, { type: 'auto_regen', value: 0.002 }], unlockStage: 3, shopPrice: 2500 },
];

export const MATERIALS: MaterialData[] = [
  { id: 'enhance_stone_normal', name: '灰チタン石',    emoji: '⚒️', description: '装備強化に使用' },
  { id: 'enhance_stone_rare',   name: 'アダマンタイト', emoji: '💎', description: '高レベル装備強化に使用（レア）' },
  { id: 'crystal_atk',          name: '赤のクリスタル', emoji: '⚔️', description: 'ATKロールレベルアップに使用' },
  { id: 'crystal_bla',          name: '青のクリスタル', emoji: '🔮', description: 'BLAロールレベルアップに使用' },
  { id: 'crystal_def',          name: '橙のクリスタル', emoji: '🛡️', description: 'DEFロールレベルアップに使用' },
  { id: 'crystal_hlr',          name: '緑のクリスタル', emoji: '💚', description: 'HLRロールレベルアップに使用' },
  { id: 'crystal_enh',          name: '紫のクリスタル', emoji: '✨', description: 'ENHロールレベルアップに使用' },
  { id: 'crystal_jam',          name: '灰のクリスタル', emoji: '💜', description: 'JAMロールレベルアップに使用' },
  { id: 'crystal_all',          name: '万能クリスタル', emoji: '🌈', description: 'どのロールにも使用可能' },
  { id: 'dragon_scale',         name: '竜の鱗',        emoji: '🐉', description: '強化素材' },
  { id: 'dragon_fang',          name: '竜の牙',        emoji: '🦷', description: '希少強化素材（レア）' },
  { id: 'god_proof',            name: '神の証',         emoji: '🌟', description: '最高レアの素材（レア）' },
  { id: 'acc_dark_stone',       name: 'ダーク石',       emoji: '🌑', description: '闇属性アクセサリ素材' },
  { id: 'acc_ice_amulet',       name: '氷のお守り',     emoji: '❄️', description: '氷属性アクセサリ素材' },
  { id: 'acc_thunder_amulet',   name: '雷のお守り',     emoji: '⚡', description: '雷属性アクセサリ素材' },
];

// ショップで購入できる素材リスト（price: Gilコスト, minCleared: 必要クリアステージ数, isRare: クリア後のみ）
export interface MaterialShopEntry {
  itemId: string;
  price: number;
  minCleared: number; // クリアステージ数が必要なら1以上
  isRare: boolean;
}

export const MATERIAL_SHOP: MaterialShopEntry[] = [
  // 通常素材 - 常時購入可
  { itemId: 'enhance_stone_normal', price: 300,   minCleared: 0, isRare: false },
  { itemId: 'dragon_scale',         price: 800,   minCleared: 1, isRare: false },
  // クリスタル系 - 高価格
  { itemId: 'crystal_atk',  price: 1600, minCleared: 1, isRare: false },
  { itemId: 'crystal_bla',  price: 1600, minCleared: 1, isRare: false },
  { itemId: 'crystal_def',  price: 1600, minCleared: 1, isRare: false },
  { itemId: 'crystal_hlr',  price: 1600, minCleared: 1, isRare: false },
  { itemId: 'crystal_enh',  price: 1600, minCleared: 1, isRare: false },
  { itemId: 'crystal_jam',  price: 1600, minCleared: 1, isRare: false },
  { itemId: 'crystal_all',  price: 5000, minCleared: 3, isRare: false },
  // レア素材 - クリア後のみ高価で購入可
  { itemId: 'enhance_stone_rare', price: 15000, minCleared: 2, isRare: true },
  { itemId: 'dragon_fang',        price: 25000, minCleared: 3, isRare: true },
  { itemId: 'god_proof',          price: 75000, minCleared: 5, isRare: true },
];

export const ENHANCE_MULTIPLIERS: Record<number, number> = {
  0: 1.00,
  1: 1.15,
  2: 1.32,
  3: 1.52,
  4: 1.75,
  5: 2.00,
};

export const ENHANCE_COSTS = [
  { gil: 300,  material: { itemId: 'enhance_stone_normal', quantity: 2 } },
  { gil: 600,  material: { itemId: 'enhance_stone_normal', quantity: 4 } },
  { gil: 1200, material: { itemId: 'enhance_stone_normal', quantity: 6 } },
  { gil: 2500, material: { itemId: 'enhance_stone_rare',   quantity: 2 } },
  { gil: 5000, material: { itemId: 'enhance_stone_rare',   quantity: 5 } },
];

export function getEquipmentById(id: string): EquipmentData | undefined {
  return EQUIPMENT_DATA.find(e => e.id === id);
}

export function getMaterialById(id: string): MaterialData | undefined {
  return MATERIALS.find(m => m.id === id);
}

export const SHOP_ITEMS = EQUIPMENT_DATA
  .filter(e => e.shopPrice > 0)
  .map(e => ({ itemId: e.id, price: e.shopPrice, stock: 'unlimited' as const, unlockStage: e.unlockStage }));
