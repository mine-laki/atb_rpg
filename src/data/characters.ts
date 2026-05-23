import type { CharacterData } from '../types';

export const CHARACTERS: CharacterData[] = [
  // ---- 攻撃系 10体 ----
  {
    id: 'rai', emoji: '⚡', name: 'ライ',
    roles: ['ATK', 'BLA'],
    baseHP: 1800, baseSTR: 180, baseMAG: 160, atbMax: 4,
    autoAbilities: ['speed_up', 'brave_heart'],
    uniqueAbilities: ['atk_blitz', 'atk_tkick'],
    growthType: 'attacker',
  },
  {
    id: 'ifu', emoji: '🔥', name: 'イフ',
    roles: ['ATK', 'BLA', 'DEF'],
    baseHP: 2600, baseSTR: 220, baseMAG: 80, atbMax: 5,
    autoAbilities: ['battle_cry', 'last_stand'],
    uniqueAbilities: ['atk_omega', 'atk_berserk'],
    growthType: 'attacker',
  },
  {
    id: 'fa', emoji: '🐺', name: 'ファ',
    roles: ['ATK', 'DEF'],
    baseHP: 2500, baseSTR: 210, baseMAG: 90, atbMax: 5,
    autoAbilities: ['chain_master', 'counter'],
    uniqueAbilities: ['atk_twinfang'],
    growthType: 'attacker',
  },
  {
    id: 'kuri', emoji: '🧊', name: 'クリ',
    roles: ['ATK', 'BLA'],
    baseHP: 1600, baseSTR: 150, baseMAG: 180, atbMax: 4,
    autoAbilities: ['elemental_amp', 'arcane_mind'],
    uniqueAbilities: ['atk_iceedge', 'bla_blizzaja'],
    growthType: 'magic',
  },
  {
    id: 'kaze', emoji: '🌀', name: 'カゼ',
    roles: ['ATK', 'BLA', 'JAM'],
    baseHP: 1700, baseSTR: 170, baseMAG: 150, atbMax: 4,
    autoAbilities: ['combo_boost', 'speed_up'],
    uniqueAbilities: ['atk_whirlwind', 'bla_aeroga', 'jam_dispel'],
    growthType: 'allround',
  },
  {
    id: 'tora', emoji: '🐯', name: 'トラ',
    roles: ['ATK', 'DEF'],
    baseHP: 2400, baseSTR: 205, baseMAG: 70, atbMax: 5,
    autoAbilities: ['battle_cry', 'provoke_plus'],
    uniqueAbilities: [],
    growthType: 'tank',
  },
  {
    id: 'taka', emoji: '🦅', name: 'タカ',
    roles: ['ATK', 'BLA'],
    baseHP: 1500, baseSTR: 190, baseMAG: 140, atbMax: 5,
    autoAbilities: ['speed_up', 'combo_boost'],
    uniqueAbilities: ['atk_whirlwind'],
    growthType: 'attacker',
  },
  {
    id: 'voru', emoji: '🌋', name: 'ヴォル',
    roles: ['ATK', 'JAM'],
    baseHP: 2000, baseSTR: 195, baseMAG: 120, atbMax: 4,
    autoAbilities: ['last_stand', 'sacrifice'],
    uniqueAbilities: ['atk_berserk'],
    growthType: 'attacker',
  },
  {
    id: 'reo', emoji: '🦁', name: 'レオ',
    roles: ['ATK', 'BLA', 'DEF'],
    baseHP: 2300, baseSTR: 200, baseMAG: 100, atbMax: 4,
    autoAbilities: ['guardian', 'break_hunter'],
    uniqueAbilities: ['atk_omega'],
    growthType: 'attacker',
  },
  {
    id: 'bom', emoji: '💥', name: 'ボム',
    roles: ['ATK', 'BLA'],
    baseHP: 1400, baseSTR: 130, baseMAG: 200, atbMax: 4,
    autoAbilities: ['break_hunter', 'elemental_amp'],
    uniqueAbilities: ['bla_magicburst'],
    growthType: 'magic',
  },

  // ---- 魔法・支援系 10体 ----
  {
    id: 'ho', emoji: '🌙', name: 'ホー',
    roles: ['BLA', 'HLR'],
    baseHP: 1400, baseSTR: 70, baseMAG: 210, atbMax: 3,
    autoAbilities: ['arcane_mind', 'magic_save'],
    uniqueAbilities: ['bla_tridisaster'],
    growthType: 'magic',
  },
  {
    id: 'sac', emoji: '🌊', name: 'サッ',
    roles: ['ENH', 'BLA'],
    baseHP: 1500, baseSTR: 100, baseMAG: 170, atbMax: 4,
    autoAbilities: ['speed_up', 'enhance_ex'],
    uniqueAbilities: ['bla_waterga', 'enh_faithall'],
    growthType: 'magic',
  },
  {
    id: 'va', emoji: '🌿', name: 'ヴァ',
    roles: ['HLR', 'ENH'],
    baseHP: 1600, baseSTR: 80, baseMAG: 190, atbMax: 3,
    autoAbilities: ['medic_plus', 'enhance_ex'],
    uniqueAbilities: ['hlr_curaall', 'hlr_regen'],
    growthType: 'healer',
  },
  {
    id: 'daku', emoji: '🌑', name: 'ダク',
    roles: ['BLA', 'JAM'],
    baseHP: 1500, baseSTR: 90, baseMAG: 200, atbMax: 3,
    autoAbilities: ['arcane_mind', 'jam_boost'],
    uniqueAbilities: ['bla_darkflare', 'jam_imperil', 'jam_curse', 'jam_stop'],
    growthType: 'magic',
  },
  {
    id: 'en', emoji: '✨', name: 'エン',
    roles: ['ENH', 'BLA', 'HLR'],
    baseHP: 1600, baseSTR: 85, baseMAG: 185, atbMax: 3,
    autoAbilities: ['enhance_ex', 'medic_plus'],
    uniqueAbilities: ['bla_holy', 'enh_bravery', 'hlr_arise'],
    growthType: 'healer',
  },
  {
    id: 'jio', emoji: '🌍', name: 'ジオ',
    roles: ['BLA', 'JAM'],
    baseHP: 1700, baseSTR: 120, baseMAG: 175, atbMax: 4,
    autoAbilities: ['elemental_amp', 'jam_boost'],
    uniqueAbilities: ['bla_quake', 'jam_gravity'],
    growthType: 'magic',
  },
  {
    id: 'doc', emoji: '💊', name: 'ドク',
    roles: ['HLR', 'ENH'],
    baseHP: 1500, baseSTR: 75, baseMAG: 195, atbMax: 3,
    autoAbilities: ['medic_plus', 'enhance_ex'],
    uniqueAbilities: ['hlr_curaja', 'hlr_esuna', 'enh_veil'],
    growthType: 'healer',
  },
  {
    id: 'ran', emoji: '🎲', name: 'ラン',
    roles: ['BLA', 'ENH', 'JAM'],
    baseHP: 1450, baseSTR: 90, baseMAG: 180, atbMax: 4,
    autoAbilities: ['elemental_amp', 'combo_boost'],
    uniqueAbilities: ['bla_magicburst', 'enh_chainboost', 'jam_gravity'],
    growthType: 'magic',
  },
  {
    id: 'hana', emoji: '🌸', name: 'ハナ',
    roles: ['HLR', 'ENH'],
    baseHP: 1550, baseSTR: 80, baseMAG: 175, atbMax: 3,
    autoAbilities: ['medic_plus', 'auto_regen'],
    uniqueAbilities: ['hlr_curaall'],
    growthType: 'healer',
  },
  {
    id: 'kou', emoji: '🌈', name: 'コウ',
    roles: ['BLA', 'ENH'],
    baseHP: 1480, baseSTR: 95, baseMAG: 185, atbMax: 4,
    autoAbilities: ['arcane_mind', 'enhance_ex'],
    uniqueAbilities: ['bla_tridisaster'],
    growthType: 'magic',
  },

  // ---- 防衛・万能系 10体 ----
  {
    id: 'gar', emoji: '🛡️', name: 'ガー',
    roles: ['DEF', 'HLR'],
    baseHP: 2800, baseSTR: 130, baseMAG: 130, atbMax: 4,
    autoAbilities: ['guardian', 'provoke_plus'],
    uniqueAbilities: ['atk_psrike'],
    growthType: 'tank',
  },
  {
    id: 'roku', emoji: '🏔️', name: 'ロク',
    roles: ['DEF', 'ATK'],
    baseHP: 2600, baseSTR: 190, baseMAG: 80, atbMax: 4,
    autoAbilities: ['iron_will', 'guardian'],
    uniqueAbilities: [],
    growthType: 'tank',
  },
  {
    id: 'roza', emoji: '🌺', name: 'ロザ',
    roles: ['ATK', 'BLA', 'HLR'],
    baseHP: 1800, baseSTR: 155, baseMAG: 155, atbMax: 4,
    autoAbilities: ['brave_heart', 'medic_plus'],
    uniqueAbilities: [],
    growthType: 'allround',
  },
  {
    id: 'cho', emoji: '🦋', name: 'チョ',
    roles: ['ATK', 'BLA', 'ENH', 'JAM'],
    baseHP: 1600, baseSTR: 140, baseMAG: 160, atbMax: 4,
    autoAbilities: ['speed_up', 'chain_master'],
    uniqueAbilities: ['enh_chainboost'],
    growthType: 'allround',
  },
  {
    id: 'ryu', emoji: '🐲', name: 'リュ',
    roles: ['ATK', 'DEF', 'HLR'],
    baseHP: 2200, baseSTR: 185, baseMAG: 110, atbMax: 4,
    autoAbilities: ['iron_will', 'counter'],
    uniqueAbilities: [],
    growthType: 'tank',
  },
  {
    id: 'kika', emoji: '⚙️', name: 'キカ',
    roles: ['ENH', 'JAM'],
    baseHP: 1700, baseSTR: 110, baseMAG: 160, atbMax: 4,
    autoAbilities: ['enhance_ex', 'jam_boost'],
    uniqueAbilities: ['enh_veil', 'jam_imperil'],
    growthType: 'healer',
  },
  {
    id: 'ste', emoji: '🌟', name: 'ステ',
    roles: ['ATK', 'BLA', 'HLR'],
    baseHP: 1750, baseSTR: 160, baseMAG: 165, atbMax: 4,
    autoAbilities: ['break_hunter', 'solidarity'],
    uniqueAbilities: [],
    growthType: 'allround',
  },
  {
    id: 'baru', emoji: '🎵', name: 'バル',
    roles: ['ENH', 'HLR', 'BLA'],
    baseHP: 1500, baseSTR: 80, baseMAG: 170, atbMax: 3,
    autoAbilities: ['enhance_ex', 'medic_plus'],
    uniqueAbilities: ['enh_chainboost', 'hlr_arise'],
    growthType: 'healer',
  },
  {
    id: 'pose', emoji: '🔱', name: 'ポセ',
    roles: ['ATK', 'BLA', 'JAM'],
    baseHP: 1900, baseSTR: 170, baseMAG: 155, atbMax: 4,
    autoAbilities: ['elemental_amp', 'chain_master'],
    uniqueAbilities: ['bla_waterga', 'jam_gravity'],
    growthType: 'allround',
  },
  {
    id: 'gan', emoji: '👁️', name: 'ガン',
    roles: ['ATK', 'BLA', 'ENH', 'JAM'],
    baseHP: 1650, baseSTR: 155, baseMAG: 170, atbMax: 5,
    autoAbilities: ['battle_cry', 'last_stand'],
    uniqueAbilities: ['bla_magicburst', 'jam_imperil'],
    growthType: 'allround',
  },
];

export const INITIAL_UNLOCKED = ['rai', 'va', 'fa', 'ho', 'gar', 'ifu'];
export const INITIAL_PARTY: [string, string, string] = ['rai', 'va', 'fa'];

export function getCharacterById(id: string): CharacterData | undefined {
  return CHARACTERS.find(c => c.id === id);
}

const GROWTH_RATES: Record<string, { hp: number; str: number; mag: number }> = {
  attacker: { hp: 60, str: 5, mag: 2 },
  magic:    { hp: 40, str: 2, mag: 5 },
  tank:     { hp: 80, str: 4, mag: 2 },
  healer:   { hp: 45, str: 2, mag: 4 },
  allround: { hp: 50, str: 3, mag: 3 },
};

export function getStatsAtLevel(charData: CharacterData, level: number) {
  const growth = GROWTH_RATES[charData.growthType];
  return {
    hp:  charData.baseHP  + growth.hp  * (level - 1),
    str: charData.baseSTR + growth.str * (level - 1),
    mag: charData.baseMAG + growth.mag * (level - 1),
  };
}

export function levelUpCost(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.18, currentLevel - 1));
}
