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
];

export const MATERIALS: MaterialData[] = [
  { id: 'enhance_stone_normal', name: '灰チタン石', emoji: '⚒️', description: '装備強化に使用' },
  { id: 'enhance_stone_rare',   name: 'アダマンタイト', emoji: '💎', description: '高レベル装備強化に使用' },
  { id: 'crystal_atk',          name: '赤のクリスタル', emoji: '⚔️', description: 'ATKロールレベルアップに使用' },
  { id: 'crystal_bla',          name: '青のクリスタル', emoji: '🔮', description: 'BLAロールレベルアップに使用' },
  { id: 'crystal_def',          name: '橙のクリスタル', emoji: '🛡️', description: 'DEFロールレベルアップに使用' },
  { id: 'crystal_hlr',          name: '緑のクリスタル', emoji: '💚', description: 'HLRロールレベルアップに使用' },
  { id: 'crystal_enh',          name: '紫のクリスタル', emoji: '✨', description: 'ENHロールレベルアップに使用' },
  { id: 'crystal_jam',          name: '灰のクリスタル', emoji: '💜', description: 'JAMロールレベルアップに使用' },
  { id: 'crystal_all',          name: '万能クリスタル', emoji: '🌈', description: 'どのロールにも使用可能' },
  { id: 'dragon_scale',         name: '竜の鱗',  emoji: '🐉', description: '強化素材' },
  { id: 'dragon_fang',          name: '竜の牙',  emoji: '🦷', description: '希少強化素材' },
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
