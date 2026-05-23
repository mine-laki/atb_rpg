import type { SkillNode } from '../types';

// Shared skill board templates by growth type.
// Node IDs are prefixed with growth type so they're unique across templates.
// `requires: []` means the node is always unlockable from the start.

const ATTACKER_NODES: SkillNode[] = [
  {
    id: 'atk_hp1',
    name: 'HP強化 I',
    description: '最大HP +300',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 300 },
  },
  {
    id: 'atk_str1',
    name: 'STR強化 I',
    description: 'STR +20',
    cost: { gil: 500, materials: [{ itemId: 'crystal_atk', quantity: 2 }] },
    requires: ['atk_hp1'],
    effect: { type: 'stat_boost', stat: 'str', value: 20 },
  },
  {
    id: 'atk_atb',
    name: 'ATB拡張',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_atk', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['atk_str1'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'atk_str2',
    name: 'STR強化 II',
    description: 'STR +35',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_atk', quantity: 5 }, { itemId: 'dragon_scale', quantity: 1 }] },
    requires: ['atk_atb'],
    effect: { type: 'stat_boost', stat: 'str', value: 35 },
  },
];

const MAGIC_NODES: SkillNode[] = [
  {
    id: 'mag_hp1',
    name: 'HP強化 I',
    description: '最大HP +200',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 200 },
  },
  {
    id: 'mag_mag1',
    name: 'MAG強化 I',
    description: 'MAG +20',
    cost: { gil: 500, materials: [{ itemId: 'crystal_bla', quantity: 2 }] },
    requires: ['mag_hp1'],
    effect: { type: 'stat_boost', stat: 'mag', value: 20 },
  },
  {
    id: 'mag_atb',
    name: 'ATB拡張',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_bla', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['mag_mag1'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'mag_mag2',
    name: 'MAG強化 II',
    description: 'MAG +35',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_bla', quantity: 5 }, { itemId: 'dragon_fang', quantity: 1 }] },
    requires: ['mag_atb'],
    effect: { type: 'stat_boost', stat: 'mag', value: 35 },
  },
];

const TANK_NODES: SkillNode[] = [
  {
    id: 'tnk_hp1',
    name: 'HP強化 I',
    description: '最大HP +500',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 500 },
  },
  {
    id: 'tnk_hp2',
    name: 'HP強化 II',
    description: '最大HP +800',
    cost: { gil: 800, materials: [{ itemId: 'crystal_def', quantity: 2 }] },
    requires: ['tnk_hp1'],
    effect: { type: 'stat_boost', stat: 'hp', value: 800 },
  },
  {
    id: 'tnk_str1',
    name: 'STR強化 I',
    description: 'STR +15',
    cost: { gil: 600, materials: [{ itemId: 'crystal_def', quantity: 3 }] },
    requires: ['tnk_hp1'],
    effect: { type: 'stat_boost', stat: 'str', value: 15 },
  },
  {
    id: 'tnk_atb',
    name: 'ATB拡張',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_def', quantity: 4 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['tnk_hp2'],
    effect: { type: 'atb_expand' },
  },
];

const HEALER_NODES: SkillNode[] = [
  {
    id: 'hlr_hp1',
    name: 'HP強化 I',
    description: '最大HP +200',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 200 },
  },
  {
    id: 'hlr_mag1',
    name: 'MAG強化 I',
    description: 'MAG +20',
    cost: { gil: 500, materials: [{ itemId: 'crystal_hlr', quantity: 2 }] },
    requires: ['hlr_hp1'],
    effect: { type: 'stat_boost', stat: 'mag', value: 20 },
  },
  {
    id: 'hlr_atb',
    name: 'ATB拡張',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_hlr', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['hlr_mag1'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'hlr_mag2',
    name: 'MAG強化 II',
    description: 'MAG +35',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_hlr', quantity: 5 }] },
    requires: ['hlr_atb'],
    effect: { type: 'stat_boost', stat: 'mag', value: 35 },
  },
];

const ALLROUND_NODES: SkillNode[] = [
  {
    id: 'all_hp1',
    name: 'HP強化 I',
    description: '最大HP +250',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 250 },
  },
  {
    id: 'all_str1',
    name: 'STR強化 I',
    description: 'STR +15',
    cost: { gil: 500, materials: [{ itemId: 'crystal_atk', quantity: 2 }] },
    requires: ['all_hp1'],
    effect: { type: 'stat_boost', stat: 'str', value: 15 },
  },
  {
    id: 'all_mag1',
    name: 'MAG強化 I',
    description: 'MAG +15',
    cost: { gil: 500, materials: [{ itemId: 'crystal_bla', quantity: 2 }] },
    requires: ['all_hp1'],
    effect: { type: 'stat_boost', stat: 'mag', value: 15 },
  },
  {
    id: 'all_atb',
    name: 'ATB拡張',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_atk', quantity: 2 }, { itemId: 'crystal_bla', quantity: 2 }, { itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['all_str1', 'all_mag1'],
    effect: { type: 'atb_expand' },
  },
];

export const SKILL_BOARD_TEMPLATES: Record<string, SkillNode[]> = {
  attacker: ATTACKER_NODES,
  magic:    MAGIC_NODES,
  tank:     TANK_NODES,
  healer:   HEALER_NODES,
  allround: ALLROUND_NODES,
};

export function getSkillNodes(growthType: string): SkillNode[] {
  return SKILL_BOARD_TEMPLATES[growthType] ?? [];
}

export function getSkillNode(growthType: string, nodeId: string): SkillNode | undefined {
  return getSkillNodes(growthType).find(n => n.id === nodeId);
}

/** Calculate cumulative skill node bonuses for a character. */
export function calcSkillBonuses(
  growthType: string,
  unlockedNodes: string[],
): { hp: number; str: number; mag: number; atbExtra: number } {
  const nodes = getSkillNodes(growthType);
  let hp = 0, str = 0, mag = 0, atbExtra = 0;

  for (const nodeId of unlockedNodes) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;
    if (node.effect.type === 'stat_boost') {
      if (node.effect.stat === 'hp')  hp  += node.effect.value;
      if (node.effect.stat === 'str') str += node.effect.value;
      if (node.effect.stat === 'mag') mag += node.effect.value;
    }
    if (node.effect.type === 'atb_expand') atbExtra += 1;
  }
  return { hp, str, mag, atbExtra };
}
