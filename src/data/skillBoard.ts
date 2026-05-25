import type { SkillNode, RoleId } from '../types';

// Shared skill board templates by growth type.
// Node IDs are prefixed with growth type so they're unique across templates.
// `requires: []` means the node is always unlockable from the start.

const ATTACKER_NODES: SkillNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'atk_hp1',
    name: 'HP強化 I',
    description: '最大HP +300',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 300 },
  },
  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'atk_hp2',
    name: 'HP強化 II',
    description: '最大HP +500',
    cost: { gil: 800, materials: [{ itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['atk_hp1'],
    effect: { type: 'stat_boost', stat: 'hp', value: 500 },
  },
  {
    id: 'atk_str1',
    name: 'STR強化 I',
    description: 'STR +20',
    cost: { gil: 500, materials: [{ itemId: 'crystal_atk', quantity: 2 }] },
    requires: ['atk_hp1'],
    effect: { type: 'stat_boost', stat: 'str', value: 20 },
  },
  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'atk_hp3',
    name: 'HP強化 III',
    description: '最大HP +700',
    cost: { gil: 1200, materials: [{ itemId: 'enhance_stone_normal', quantity: 4 }, { itemId: 'crystal_atk', quantity: 2 }] },
    requires: ['atk_hp2'],
    effect: { type: 'stat_boost', stat: 'hp', value: 700 },
  },
  {
    id: 'atk_atb',
    name: 'ATB拡張 I',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_atk', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['atk_str1'],
    effect: { type: 'atb_expand' },
  },
  // ── Tier 4 ──────────────────────────────────────────────────────────────
  {
    id: 'atk_str2',
    name: 'STR強化 II',
    description: 'STR +35',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_atk', quantity: 5 }, { itemId: 'dragon_scale', quantity: 1 }] },
    requires: ['atk_atb'],
    effect: { type: 'stat_boost', stat: 'str', value: 35 },
  },
  {
    id: 'atk_rolecap',
    name: 'ATK上限解放',
    description: 'ATKロールレベル上限 +2',
    cost: { gil: 2000, materials: [{ itemId: 'crystal_atk', quantity: 8 }, { itemId: 'dragon_scale', quantity: 3 }] },
    requires: ['atk_atb'],
    effect: { type: 'role_cap_up', role: 'ATK', amount: 2 },
  },
  // ── Tier 5 ──────────────────────────────────────────────────────────────
  {
    id: 'atk_str3',
    name: 'STR強化 III',
    description: 'STR +50',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_atk', quantity: 6 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['atk_str2'],
    effect: { type: 'stat_boost', stat: 'str', value: 50 },
  },
  {
    id: 'atk_auto1',
    name: 'ブレイクハンター',
    description: 'ブレイク中ダメージ+30%を解放',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_atk', quantity: 4 }, { itemId: 'dragon_fang', quantity: 1 }] },
    requires: ['atk_str2'],
    effect: { type: 'unlock_auto', autoId: 'break_hunter' },
  },
  // ── Tier 6 (Deep) ───────────────────────────────────────────────────────
  {
    id: 'atk_atb2',
    name: 'ATB拡張 II',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 2500, materials: [{ itemId: 'crystal_atk', quantity: 5 }, { itemId: 'dragon_scale', quantity: 2 }, { itemId: 'enhance_stone_rare', quantity: 1 }] },
    requires: ['atk_str3'],
    effect: { type: 'atb_expand' },
  },
];

const MAGIC_NODES: SkillNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'mag_hp1',
    name: 'HP強化 I',
    description: '最大HP +200',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 200 },
  },
  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'mag_hp2',
    name: 'HP強化 II',
    description: '最大HP +300',
    cost: { gil: 800, materials: [{ itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['mag_hp1'],
    effect: { type: 'stat_boost', stat: 'hp', value: 300 },
  },
  {
    id: 'mag_mag1',
    name: 'MAG強化 I',
    description: 'MAG +20',
    cost: { gil: 500, materials: [{ itemId: 'crystal_bla', quantity: 2 }] },
    requires: ['mag_hp1'],
    effect: { type: 'stat_boost', stat: 'mag', value: 20 },
  },
  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'mag_hp3',
    name: 'HP強化 III',
    description: '最大HP +400',
    cost: { gil: 1000, materials: [{ itemId: 'enhance_stone_normal', quantity: 4 }, { itemId: 'crystal_bla', quantity: 2 }] },
    requires: ['mag_hp2'],
    effect: { type: 'stat_boost', stat: 'hp', value: 400 },
  },
  {
    id: 'mag_atb',
    name: 'ATB拡張 I',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_bla', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['mag_mag1'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'mag_auto1',
    name: '属性増幅',
    description: '弱点ヒット時チェーン増加×1.8を解放',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_bla', quantity: 4 }, { itemId: 'dragon_fang', quantity: 1 }] },
    requires: ['mag_mag1'],
    effect: { type: 'unlock_auto', autoId: 'elemental_amp' },
  },
  // ── Tier 4 ──────────────────────────────────────────────────────────────
  {
    id: 'mag_mag2',
    name: 'MAG強化 II',
    description: 'MAG +35',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_bla', quantity: 5 }, { itemId: 'dragon_fang', quantity: 1 }] },
    requires: ['mag_atb'],
    effect: { type: 'stat_boost', stat: 'mag', value: 35 },
  },
  {
    id: 'mag_rolecap',
    name: 'BLA上限解放',
    description: 'BLAロールレベル上限 +2',
    cost: { gil: 2000, materials: [{ itemId: 'crystal_bla', quantity: 8 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['mag_atb'],
    effect: { type: 'role_cap_up', role: 'BLA', amount: 2 },
  },
  // ── Tier 5 ──────────────────────────────────────────────────────────────
  {
    id: 'mag_mag3',
    name: 'MAG強化 III',
    description: 'MAG +50',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_bla', quantity: 6 }, { itemId: 'dragon_fang', quantity: 2 }] },
    requires: ['mag_mag2'],
    effect: { type: 'stat_boost', stat: 'mag', value: 50 },
  },
  // ── Tier 6 (Deep) ───────────────────────────────────────────────────────
  {
    id: 'mag_atb2',
    name: 'ATB拡張 II',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 2500, materials: [{ itemId: 'crystal_bla', quantity: 5 }, { itemId: 'dragon_fang', quantity: 2 }, { itemId: 'enhance_stone_rare', quantity: 1 }] },
    requires: ['mag_mag3'],
    effect: { type: 'atb_expand' },
  },
];

const TANK_NODES: SkillNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'tnk_hp1',
    name: 'HP強化 I',
    description: '最大HP +500',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 500 },
  },
  // ── Tier 2 ──────────────────────────────────────────────────────────────
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
  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'tnk_hp3',
    name: 'HP強化 III',
    description: '最大HP +1200',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_def', quantity: 4 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['tnk_hp2'],
    effect: { type: 'stat_boost', stat: 'hp', value: 1200 },
  },
  {
    id: 'tnk_atb',
    name: 'ATB拡張 I',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_def', quantity: 4 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['tnk_hp2'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'tnk_str2',
    name: 'STR強化 II',
    description: 'STR +20',
    cost: { gil: 800, materials: [{ itemId: 'crystal_def', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['tnk_str1'],
    effect: { type: 'stat_boost', stat: 'str', value: 20 },
  },
  // ── Tier 4 ──────────────────────────────────────────────────────────────
  {
    id: 'tnk_hp4',
    name: 'HP強化 IV',
    description: '最大HP +1500',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_def', quantity: 5 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['tnk_hp3'],
    effect: { type: 'stat_boost', stat: 'hp', value: 1500 },
  },
  {
    id: 'tnk_rolecap',
    name: 'DEF上限解放',
    description: 'DEFロールレベル上限 +2',
    cost: { gil: 2000, materials: [{ itemId: 'crystal_def', quantity: 8 }, { itemId: 'dragon_scale', quantity: 4 }] },
    requires: ['tnk_atb'],
    effect: { type: 'role_cap_up', role: 'DEF', amount: 2 },
  },
  {
    id: 'tnk_auto1',
    name: 'アイアンウィル',
    description: 'HP+20%を解放',
    cost: { gil: 1800, materials: [{ itemId: 'crystal_def', quantity: 5 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['tnk_hp3'],
    effect: { type: 'unlock_auto', autoId: 'iron_will' },
  },
  // ── Tier 5 (Deep) ───────────────────────────────────────────────────────
  {
    id: 'tnk_atb2',
    name: 'ATB拡張 II',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 2500, materials: [{ itemId: 'crystal_def', quantity: 6 }, { itemId: 'dragon_scale', quantity: 3 }, { itemId: 'enhance_stone_rare', quantity: 1 }] },
    requires: ['tnk_hp4'],
    effect: { type: 'atb_expand' },
  },
];

const HEALER_NODES: SkillNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'hlr_hp1',
    name: 'HP強化 I',
    description: '最大HP +200',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 200 },
  },
  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'hlr_hp2',
    name: 'HP強化 II',
    description: '最大HP +300',
    cost: { gil: 800, materials: [{ itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['hlr_hp1'],
    effect: { type: 'stat_boost', stat: 'hp', value: 300 },
  },
  {
    id: 'hlr_mag1',
    name: 'MAG強化 I',
    description: 'MAG +20',
    cost: { gil: 500, materials: [{ itemId: 'crystal_hlr', quantity: 2 }] },
    requires: ['hlr_hp1'],
    effect: { type: 'stat_boost', stat: 'mag', value: 20 },
  },
  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'hlr_hp3',
    name: 'HP強化 III',
    description: '最大HP +400',
    cost: { gil: 1000, materials: [{ itemId: 'enhance_stone_normal', quantity: 4 }, { itemId: 'crystal_hlr', quantity: 2 }] },
    requires: ['hlr_hp2'],
    effect: { type: 'stat_boost', stat: 'hp', value: 400 },
  },
  {
    id: 'hlr_atb',
    name: 'ATB拡張 I',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_hlr', quantity: 3 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['hlr_mag1'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'hlr_auto1',
    name: 'オートリジェネ',
    description: '毎秒HP+0.5%（自動回復）を解放',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_hlr', quantity: 4 }, { itemId: 'enhance_stone_normal', quantity: 4 }] },
    requires: ['hlr_mag1'],
    effect: { type: 'unlock_auto', autoId: 'auto_regen' },
  },
  // ── Tier 4 ──────────────────────────────────────────────────────────────
  {
    id: 'hlr_mag2',
    name: 'MAG強化 II',
    description: 'MAG +35',
    cost: { gil: 1000, materials: [{ itemId: 'crystal_hlr', quantity: 5 }] },
    requires: ['hlr_atb'],
    effect: { type: 'stat_boost', stat: 'mag', value: 35 },
  },
  {
    id: 'hlr_rolecap',
    name: 'HLR上限解放',
    description: 'HLRロールレベル上限 +2',
    cost: { gil: 2000, materials: [{ itemId: 'crystal_hlr', quantity: 8 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['hlr_atb'],
    effect: { type: 'role_cap_up', role: 'HLR', amount: 2 },
  },
  // ── Tier 5 ──────────────────────────────────────────────────────────────
  {
    id: 'hlr_mag3',
    name: 'MAG強化 III',
    description: 'MAG +50',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_hlr', quantity: 6 }, { itemId: 'dragon_fang', quantity: 1 }] },
    requires: ['hlr_mag2'],
    effect: { type: 'stat_boost', stat: 'mag', value: 50 },
  },
  // ── Tier 6 (Deep) ───────────────────────────────────────────────────────
  {
    id: 'hlr_atb2',
    name: 'ATB拡張 II',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 2500, materials: [{ itemId: 'crystal_hlr', quantity: 5 }, { itemId: 'dragon_fang', quantity: 2 }, { itemId: 'enhance_stone_rare', quantity: 1 }] },
    requires: ['hlr_mag3'],
    effect: { type: 'atb_expand' },
  },
];

const ALLROUND_NODES: SkillNode[] = [
  // ── Tier 1 ──────────────────────────────────────────────────────────────
  {
    id: 'all_hp1',
    name: 'HP強化 I',
    description: '最大HP +250',
    cost: { gil: 400, materials: [{ itemId: 'enhance_stone_normal', quantity: 2 }] },
    requires: [],
    effect: { type: 'stat_boost', stat: 'hp', value: 250 },
  },
  // ── Tier 2 ──────────────────────────────────────────────────────────────
  {
    id: 'all_hp2',
    name: 'HP強化 II',
    description: '最大HP +350',
    cost: { gil: 800, materials: [{ itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['all_hp1'],
    effect: { type: 'stat_boost', stat: 'hp', value: 350 },
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
  // ── Tier 3 ──────────────────────────────────────────────────────────────
  {
    id: 'all_hp3',
    name: 'HP強化 III',
    description: '最大HP +500',
    cost: { gil: 1000, materials: [{ itemId: 'enhance_stone_normal', quantity: 4 }, { itemId: 'crystal_atk', quantity: 1 }, { itemId: 'crystal_bla', quantity: 1 }] },
    requires: ['all_hp2'],
    effect: { type: 'stat_boost', stat: 'hp', value: 500 },
  },
  {
    id: 'all_str2',
    name: 'STR強化 II',
    description: 'STR +25',
    cost: { gil: 800, materials: [{ itemId: 'crystal_atk', quantity: 3 }] },
    requires: ['all_str1'],
    effect: { type: 'stat_boost', stat: 'str', value: 25 },
  },
  {
    id: 'all_mag2',
    name: 'MAG強化 II',
    description: 'MAG +25',
    cost: { gil: 800, materials: [{ itemId: 'crystal_bla', quantity: 3 }] },
    requires: ['all_mag1'],
    effect: { type: 'stat_boost', stat: 'mag', value: 25 },
  },
  // ── Tier 4 ──────────────────────────────────────────────────────────────
  {
    id: 'all_atb',
    name: 'ATB拡張 I',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 1200, materials: [{ itemId: 'crystal_atk', quantity: 2 }, { itemId: 'crystal_bla', quantity: 2 }, { itemId: 'enhance_stone_normal', quantity: 3 }] },
    requires: ['all_str1', 'all_mag1'],
    effect: { type: 'atb_expand' },
  },
  {
    id: 'all_rolecap',
    name: 'ATK上限解放',
    description: 'ATKロールレベル上限 +1',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_atk', quantity: 5 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['all_str2'],
    effect: { type: 'role_cap_up', role: 'ATK', amount: 1 },
  },
  {
    id: 'all_rolecap2',
    name: 'BLA上限解放',
    description: 'BLAロールレベル上限 +1',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_bla', quantity: 5 }, { itemId: 'dragon_scale', quantity: 2 }] },
    requires: ['all_mag2'],
    effect: { type: 'role_cap_up', role: 'BLA', amount: 1 },
  },
  // ── Tier 5 ──────────────────────────────────────────────────────────────
  {
    id: 'all_auto1',
    name: 'コンボブースト',
    description: '多段ヒット威力+20%を解放',
    cost: { gil: 1500, materials: [{ itemId: 'crystal_atk', quantity: 2 }, { itemId: 'crystal_bla', quantity: 2 }, { itemId: 'dragon_scale', quantity: 1 }] },
    requires: ['all_atb'],
    effect: { type: 'unlock_auto', autoId: 'combo_boost' },
  },
  // ── Tier 6 (Deep) ───────────────────────────────────────────────────────
  {
    id: 'all_atb2',
    name: 'ATB拡張 II',
    description: 'ATBゲージ +1セグメント',
    cost: { gil: 2500, materials: [{ itemId: 'crystal_atk', quantity: 3 }, { itemId: 'crystal_bla', quantity: 3 }, { itemId: 'enhance_stone_rare', quantity: 1 }] },
    requires: ['all_str2', 'all_mag2'],
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
): { hp: number; str: number; mag: number; atbExtra: number; unlockAutos: string[]; roleCaps: Partial<Record<string, number>> } {
  const nodes = getSkillNodes(growthType);
  let hp = 0, str = 0, mag = 0, atbExtra = 0;
  const unlockAutos: string[] = [];
  const roleCaps: Partial<Record<string, number>> = {};

  for (const nodeId of unlockedNodes) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) continue;
    if (node.effect.type === 'stat_boost') {
      if (node.effect.stat === 'hp')  hp  += node.effect.value;
      if (node.effect.stat === 'str') str += node.effect.value;
      if (node.effect.stat === 'mag') mag += node.effect.value;
    }
    if (node.effect.type === 'atb_expand') atbExtra += 1;
    if (node.effect.type === 'unlock_auto') {
      if (!unlockAutos.includes((node.effect as { type: 'unlock_auto'; autoId: string }).autoId)) {
        unlockAutos.push((node.effect as { type: 'unlock_auto'; autoId: string }).autoId);
      }
    }
    if (node.effect.type === 'role_cap_up') {
      const eff = node.effect as { type: 'role_cap_up'; role: RoleId; amount: number };
      roleCaps[eff.role] = (roleCaps[eff.role] ?? 0) + eff.amount;
    }
  }
  return { hp, str, mag, atbExtra, unlockAutos, roleCaps };
}
