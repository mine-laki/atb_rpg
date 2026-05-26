import type { CharacterData } from '../types';

export const CHARACTERS: CharacterData[] = [
  // ---- 攻撃系 10体 ----
  {
    id: 'rai', emoji: '⚡', name: 'ライ',
    roles: ['ATK', 'BLA', 'HLR'],
    baseHP: 1800, baseSTR: 180, baseMAG: 160, atbMax: 3,
    autoAbilities: ['speed_up', 'brave_heart'],
    uniqueAbilities: ['atk_blitz', 'atk_tkick', 'rai_ult'],
    growthType: 'attacker',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'ifu', emoji: '🔥', name: 'イフ',
    roles: ['ATK', 'BLA', 'ENH'],
    baseHP: 2600, baseSTR: 220, baseMAG: 80, atbMax: 3,
    autoAbilities: ['battle_cry', 'last_stand'],
    uniqueAbilities: ['atk_omega', 'atk_berserk'],
    growthType: 'attacker',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'fa', emoji: '🐺', name: 'ファ',
    roles: ['ATK', 'DEF', 'JAM'],
    baseHP: 2500, baseSTR: 210, baseMAG: 90, atbMax: 3,
    autoAbilities: ['chain_master', 'counter'],
    uniqueAbilities: ['atk_twinfang', 'fa_ult'],
    growthType: 'attacker',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'kuri', emoji: '🧊', name: 'クリ',
    roles: ['ATK', 'BLA', 'ENH'],
    baseHP: 1600, baseSTR: 150, baseMAG: 180, atbMax: 3,
    autoAbilities: ['elemental_amp', 'arcane_mind'],
    uniqueAbilities: ['atk_iceedge', 'bla_blizzaja'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'kaze', emoji: '🌀', name: 'カゼ',
    roles: ['ATK', 'BLA', 'JAM'],
    baseHP: 1700, baseSTR: 170, baseMAG: 150, atbMax: 3,
    autoAbilities: ['combo_boost', 'speed_up'],
    uniqueAbilities: ['atk_whirlwind', 'bla_aeroga', 'jam_dispel'],
    growthType: 'allround',
    weaponAffinity: 'bow',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
  {
    id: 'tora', emoji: '🐯', name: 'トラ',
    roles: ['ATK', 'DEF', 'HLR'],
    baseHP: 2400, baseSTR: 205, baseMAG: 70, atbMax: 3,
    autoAbilities: ['battle_cry', 'provoke_plus'],
    uniqueAbilities: [],
    growthType: 'tank',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'taka', emoji: '🦅', name: 'タカ',
    roles: ['ATK', 'BLA', 'DEF'],
    baseHP: 1500, baseSTR: 190, baseMAG: 140, atbMax: 3,
    autoAbilities: ['speed_up', 'combo_boost'],
    uniqueAbilities: ['atk_whirlwind'],
    growthType: 'attacker',
    weaponAffinity: 'bow',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'voru', emoji: '🌋', name: 'ヴォル',
    roles: ['ATK', 'DEF', 'JAM'],
    baseHP: 2000, baseSTR: 195, baseMAG: 120, atbMax: 3,
    autoAbilities: ['last_stand', 'sacrifice'],
    uniqueAbilities: ['atk_berserk'],
    growthType: 'attacker',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'reo', emoji: '🦁', name: 'レオ',
    roles: ['ATK', 'BLA', 'DEF'],
    baseHP: 2300, baseSTR: 200, baseMAG: 100, atbMax: 3,
    autoAbilities: ['guardian', 'break_hunter'],
    uniqueAbilities: ['atk_omega'],
    growthType: 'attacker',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'bom', emoji: '💥', name: 'ボム',
    roles: ['ATK', 'BLA', 'ENH'],
    baseHP: 1400, baseSTR: 130, baseMAG: 200, atbMax: 3,
    autoAbilities: ['break_hunter', 'elemental_amp'],
    uniqueAbilities: ['bla_magicburst'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },

  // ---- 魔法・支援系 10体 ----
  {
    id: 'ho', emoji: '🌙', name: 'ホー',
    roles: ['BLA', 'HLR', 'ENH'],
    baseHP: 1400, baseSTR: 70, baseMAG: 210, atbMax: 3,
    autoAbilities: ['arcane_mind', 'magic_save'],
    uniqueAbilities: ['bla_tridisaster'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'sac', emoji: '🌊', name: 'サッ',
    roles: ['ENH', 'BLA', 'HLR'],
    baseHP: 1500, baseSTR: 100, baseMAG: 170, atbMax: 3,
    autoAbilities: ['speed_up', 'enhance_ex'],
    uniqueAbilities: ['bla_waterga', 'enh_faithall'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'va', emoji: '🌿', name: 'ヴァ',
    roles: ['BLA', 'JAM', 'HLR'],
    baseHP: 1600, baseSTR: 80, baseMAG: 190, atbMax: 3,
    autoAbilities: ['medic_plus', 'revive_once'],
    uniqueAbilities: ['hlr_curaall', 'hlr_regen', 'va_ult'],
    growthType: 'healer',
    weaponAffinity: 'holy',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'daku', emoji: '🌑', name: 'ダク',
    roles: ['BLA', 'JAM', 'ENH'],
    baseHP: 1500, baseSTR: 90, baseMAG: 200, atbMax: 3,
    autoAbilities: ['arcane_mind', 'jam_boost'],
    uniqueAbilities: ['bla_darkflare', 'jam_imperil', 'jam_curse', 'jam_stop'],
    growthType: 'magic',
    weaponAffinity: 'cursed',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'en', emoji: '✨', name: 'エン',
    roles: ['ENH', 'BLA', 'HLR'],
    baseHP: 1600, baseSTR: 85, baseMAG: 185, atbMax: 3,
    autoAbilities: ['enhance_ex', 'medic_plus'],
    uniqueAbilities: ['bla_holy', 'enh_bravery', 'hlr_arise'],
    growthType: 'healer',
    weaponAffinity: 'holy',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'jio', emoji: '🌍', name: 'ジオ',
    roles: ['BLA', 'JAM', 'ENH'],
    baseHP: 1700, baseSTR: 120, baseMAG: 175, atbMax: 3,
    autoAbilities: ['elemental_amp', 'jam_boost'],
    uniqueAbilities: ['bla_quake', 'jam_gravity'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'doc', emoji: '💊', name: 'ドク',
    roles: ['HLR', 'ENH', 'BLA'],
    baseHP: 1500, baseSTR: 75, baseMAG: 195, atbMax: 3,
    autoAbilities: ['medic_plus', 'enhance_ex'],
    uniqueAbilities: ['hlr_curaja', 'hlr_esuna', 'enh_veil'],
    growthType: 'healer',
    weaponAffinity: 'holy',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'ran', emoji: '🎲', name: 'ラン',
    roles: ['BLA', 'ENH', 'JAM'],
    baseHP: 1450, baseSTR: 90, baseMAG: 180, atbMax: 3,
    autoAbilities: ['elemental_amp', 'combo_boost'],
    uniqueAbilities: ['bla_magicburst', 'enh_chainboost', 'jam_gravity'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'hana', emoji: '🌸', name: 'ハナ',
    roles: ['HLR', 'ENH', 'BLA'],
    baseHP: 1550, baseSTR: 80, baseMAG: 175, atbMax: 3,
    autoAbilities: ['medic_plus', 'auto_regen'],
    uniqueAbilities: ['hlr_curaall'],
    growthType: 'healer',
    weaponAffinity: 'holy',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'kou', emoji: '🌈', name: 'コウ',
    roles: ['BLA', 'ENH', 'HLR'],
    baseHP: 1480, baseSTR: 95, baseMAG: 185, atbMax: 3,
    autoAbilities: ['arcane_mind', 'enhance_ex'],
    uniqueAbilities: ['bla_tridisaster'],
    growthType: 'magic',
    weaponAffinity: 'staff',
    attackType: 'magical', physDef: 0, magDef: 0,
  },

  // ---- 防衛・万能系 10体 ----
  {
    id: 'gar', emoji: '🛡️', name: 'ガー',
    roles: ['ATK', 'BLA', 'DEF'],
    baseHP: 2800, baseSTR: 130, baseMAG: 130, atbMax: 3,
    autoAbilities: ['guardian', 'provoke_plus'],
    uniqueAbilities: ['atk_psrike'],
    growthType: 'tank',
    weaponAffinity: 'shield',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
  {
    id: 'roku', emoji: '🏔️', name: 'ロク',
    roles: ['DEF', 'ATK', 'ENH'],
    baseHP: 2600, baseSTR: 190, baseMAG: 80, atbMax: 3,
    autoAbilities: ['iron_will', 'guardian'],
    uniqueAbilities: [],
    growthType: 'tank',
    weaponAffinity: 'shield',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'roza', emoji: '🌺', name: 'ロザ',
    roles: ['ATK', 'BLA', 'HLR'],
    baseHP: 1800, baseSTR: 155, baseMAG: 155, atbMax: 3,
    autoAbilities: ['brave_heart', 'medic_plus'],
    uniqueAbilities: [],
    growthType: 'allround',
    weaponAffinity: 'bow',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
  {
    id: 'cho', emoji: '🦋', name: 'チョ',
    roles: ['ATK', 'BLA', 'ENH', 'JAM'],
    baseHP: 1600, baseSTR: 140, baseMAG: 160, atbMax: 3,
    autoAbilities: ['speed_up', 'chain_master'],
    uniqueAbilities: ['enh_chainboost'],
    growthType: 'allround',
    weaponAffinity: 'bow',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
  {
    id: 'ryu', emoji: '🐲', name: 'リュ',
    roles: ['ATK', 'DEF', 'HLR'],
    baseHP: 2200, baseSTR: 185, baseMAG: 110, atbMax: 3,
    autoAbilities: ['iron_will', 'counter'],
    uniqueAbilities: [],
    growthType: 'tank',
    weaponAffinity: 'sword',
    attackType: 'physical', physDef: 0, magDef: 0,
  },
  {
    id: 'kika', emoji: '⚙️', name: 'キカ',
    roles: ['ENH', 'JAM', 'BLA'],
    baseHP: 1700, baseSTR: 110, baseMAG: 160, atbMax: 3,
    autoAbilities: ['enhance_ex', 'jam_boost'],
    uniqueAbilities: ['enh_veil', 'jam_imperil'],
    growthType: 'healer',
    weaponAffinity: 'instrument',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'ste', emoji: '🌟', name: 'ステ',
    roles: ['ATK', 'BLA', 'HLR'],
    baseHP: 1750, baseSTR: 160, baseMAG: 165, atbMax: 3,
    autoAbilities: ['break_hunter', 'solidarity'],
    uniqueAbilities: [],
    growthType: 'allround',
    weaponAffinity: 'bow',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
  {
    id: 'baru', emoji: '🎵', name: 'バル',
    roles: ['ENH', 'HLR', 'BLA'],
    baseHP: 1500, baseSTR: 80, baseMAG: 170, atbMax: 3,
    autoAbilities: ['enhance_ex', 'medic_plus'],
    uniqueAbilities: ['enh_chainboost', 'hlr_arise'],
    growthType: 'healer',
    weaponAffinity: 'instrument',
    attackType: 'magical', physDef: 0, magDef: 0,
  },
  {
    id: 'pose', emoji: '🔱', name: 'ポセ',
    roles: ['ATK', 'BLA', 'JAM'],
    baseHP: 1900, baseSTR: 170, baseMAG: 155, atbMax: 3,
    autoAbilities: ['elemental_amp', 'chain_master'],
    uniqueAbilities: ['bla_waterga', 'jam_gravity'],
    growthType: 'allround',
    weaponAffinity: 'staff',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
  {
    id: 'gan', emoji: '👁️', name: 'ガン',
    roles: ['ATK', 'BLA', 'ENH', 'JAM'],
    baseHP: 1650, baseSTR: 155, baseMAG: 170, atbMax: 3,
    autoAbilities: ['battle_cry', 'last_stand'],
    uniqueAbilities: ['bla_magicburst', 'jam_imperil'],
    growthType: 'allround',
    weaponAffinity: 'cursed',
    attackType: 'mixed', physDef: 0, magDef: 0,
  },
];

export const INITIAL_UNLOCKED = ['rai', 'va', 'fa', 'ho', 'gar', 'ifu'];
export const INITIAL_PARTY: [string, string, string] = ['rai', 'va', 'fa'];

// ─── 追加解放ロールのアビリティ白リスト ─────────────────────────────
// キャラクターの固有ロール以外で解放した場合に使えるアビリティを指定。
// 未設定のロールはデフォルト（全アビリティ）が適用される。
// 固有ロールには影響しない（固有ロールはそのまま abilities.ts の allowedFor で制御）。
const ROLE_ABILITIES_MAP: Record<string, Partial<Record<import('../types').RoleId, string[]>>> = {
  // ---- 攻撃系 ----
  rai: { // 固有: ATK/BLA/HLR
    DEF: ['def_guard', 'def_stabilize'],
    ENH: ['enh_protect', 'enh_shell'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  ifu: { // 固有: ATK/BLA/ENH
    DEF: ['def_guard', 'def_heavyguard'],
    HLR: ['hlr_cure', 'hlr_cura'],
    JAM: ['jam_deprotect'],
  },
  fa: { // 固有: ATK/DEF/JAM
    BLA: ['bla_fire', 'bla_thunder'],
    HLR: ['hlr_cure'],
    ENH: ['enh_protect', 'enh_haste'],
  },
  kuri: { // 固有: ATK/BLA/ENH
    DEF: ['def_guard', 'def_stabilize'],
    HLR: ['hlr_cure', 'hlr_cura'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  kaze: { // 固有: ATK/BLA/JAM
    DEF: ['def_guard'],
    HLR: ['hlr_cure'],
    ENH: ['enh_protect', 'enh_haste'],
  },
  tora: { // 固有: ATK/DEF/HLR
    BLA: ['bla_fire', 'bla_thunder'],
    ENH: ['enh_protect'],
    JAM: ['jam_deprotect'],
  },
  taka: { // 固有: ATK/BLA/DEF
    HLR: ['hlr_cure'],
    ENH: ['enh_protect', 'enh_haste'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  voru: { // 固有: ATK/DEF/JAM
    BLA: ['bla_fire', 'bla_thunder'],
    HLR: ['hlr_cure'],
    ENH: ['enh_protect'],
  },
  reo: { // 固有: ATK/BLA/DEF
    HLR: ['hlr_cure', 'hlr_cura'],
    ENH: ['enh_protect', 'enh_shell'],
    JAM: ['jam_deprotect'],
  },
  bom: { // 固有: ATK/BLA/ENH
    DEF: ['def_guard'],
    HLR: ['hlr_cure', 'hlr_cura'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  // ---- 魔法・支援系 ----
  ho: { // 固有: BLA/HLR/ENH
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard', 'def_regenguard'],
    JAM: ['jam_deprotect', 'jam_deshell', 'jam_slow'],
  },
  sac: { // 固有: ENH/BLA/HLR
    ATK: ['atk_fight'],
    DEF: ['def_guard', 'def_stabilize'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  va: { // 固有: BLA/JAM/HLR
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard', 'def_stabilize'],
    ENH: ['enh_protect', 'enh_shell', 'enh_haste'],
  },
  daku: { // 固有: BLA/JAM/ENH
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard'],
    HLR: ['hlr_cure'],
  },
  en: { // 固有: ENH/BLA/HLR
    ATK: ['atk_fight'],
    DEF: ['def_guard', 'def_regenguard'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  jio: { // 固有: BLA/JAM/ENH
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard', 'def_heavyguard'],
    HLR: ['hlr_cure'],
  },
  doc: { // 固有: HLR/ENH/BLA
    ATK: ['atk_fight'],
    DEF: ['def_guard', 'def_stabilize'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  ran: { // 固有: BLA/ENH/JAM
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard'],
    HLR: ['hlr_cure', 'hlr_cura'],
  },
  hana: { // 固有: HLR/ENH/BLA
    ATK: ['atk_fight'],
    DEF: ['def_guard', 'def_regenguard'],
    JAM: ['jam_deprotect'],
  },
  kou: { // 固有: BLA/ENH/HLR
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  // ---- 防衛・万能系 ----
  gar: { // 固有: ATK/BLA/DEF
    HLR: ['hlr_cure', 'hlr_cura'],
    ENH: ['enh_protect', 'enh_shell'],
    JAM: ['jam_deprotect'],
  },
  roku: { // 固有: DEF/ATK/ENH
    BLA: ['bla_fire', 'bla_thunder'],
    HLR: ['hlr_cure'],
    JAM: ['jam_deprotect'],
  },
  roza: { // 固有: ATK/BLA/HLR
    DEF: ['def_guard', 'def_stabilize'],
    ENH: ['enh_protect', 'enh_haste'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  cho: { // 固有: ATK/BLA/ENH/JAM（4ロール）
    DEF: ['def_guard', 'def_regenguard'],
    HLR: ['hlr_cure', 'hlr_cura'],
  },
  ryu: { // 固有: ATK/DEF/HLR
    BLA: ['bla_fire', 'bla_thunder'],
    ENH: ['enh_protect', 'enh_shell'],
    JAM: ['jam_deprotect'],
  },
  kika: { // 固有: ENH/JAM/BLA
    ATK: ['atk_fight', 'atk_rush'],
    DEF: ['def_guard', 'def_stabilize'],
    HLR: ['hlr_cure', 'hlr_cura'],
  },
  ste: { // 固有: ATK/BLA/HLR
    DEF: ['def_guard', 'def_regenguard'],
    ENH: ['enh_protect', 'enh_shell', 'enh_haste'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  baru: { // 固有: ENH/HLR/BLA
    ATK: ['atk_fight'],
    DEF: ['def_guard', 'def_stabilize'],
    JAM: ['jam_deprotect', 'jam_deshell'],
  },
  pose: { // 固有: ATK/BLA/JAM
    DEF: ['def_guard', 'def_stabilize'],
    HLR: ['hlr_cure', 'hlr_cura'],
    ENH: ['enh_protect', 'enh_shell'],
  },
  gan: { // 固有: ATK/BLA/ENH/JAM（4ロール）
    DEF: ['def_guard', 'def_stabilize'],
    HLR: ['hlr_cure', 'hlr_cura'],
  },
};

// CHARACTERS への roleAbilities 適用
for (const char of CHARACTERS) {
  const override = ROLE_ABILITIES_MAP[char.id];
  if (override) char.roleAbilities = override;
}

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
  const n = level - 1;
  // 二次曲線加速成長: レベルが上がるほど1レベルごとの上昇量も増える
  // 上昇量 at lv n→n+1 = growth * (1 + (2n+1)/100) なので Lv.50付近で約2倍、Lv.100付近で約3倍
  return {
    hp:  Math.floor(charData.baseHP  + growth.hp  * n * (1 + n / 100)),
    str: Math.floor(charData.baseSTR + growth.str * n * (1 + n / 100)),
    mag: Math.floor(charData.baseMAG + growth.mag * n * (1 + n / 100)),
  };
}

export function levelUpCost(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.18, currentLevel - 1));
}

// ─── キャラクタープロフィール ─────────────────────────────
export interface CharProfile {
  description: string;
  playstyle: string;
}

const CHARACTER_PROFILES: Record<string, CharProfile> = {
  rai:  { description: '電光石火の剣士。ATBゲージが早く回転し、素早いコンボで敵のチェーンを稼ぐ。',     playstyle: 'ATKで物理コンボ→BLAで追い打ち。ヘイスト状態との相性抜群。' },
  ifu:  { description: '炎を纏う重戦士。圧倒的なSTRで敵を粉砕するが、魔法耐性はやや低め。',           playstyle: 'ブレイク後のATKで最大火力を出す。ラストスタンドで瀕死時の逆転も狙える。' },
  fa:   { description: '野生の本能を持つ双剣士。チェーン構築とデバフを両立できるオールラウンダー。', playstyle: 'DEFでタンク役もこなしつつ、JAMでデバフをかけてATKに繋ぐ。' },
  kuri: { description: '氷魔法の使い手。高いMAGと属性攻撃で弱点を突くエレメンタルスペシャリスト。', playstyle: 'BLAで氷弱点の敵に集中。ENHでフェイスを付与して魔法倍率を上げよう。' },
  kaze: { description: '風を操る弓使い。物理・魔法どちらもこなせる万能型。スピードも高い。',         playstyle: '状況に応じてATK/BLAを使い分け。JAMのディスペルが厄介なバフ持ち敵に刺さる。' },
  tora: { description: '猛虎の如き近接戦士。高HPと物理攻撃を兼ね備えた前衛の要。',                   playstyle: 'DEFで挑発して味方を守りつつATKで殴り続ける守りながら攻めるスタイル。' },
  taka: { description: '鋭い眼を持つ弓兵。高いSTRで遠距離から連続攻撃を繰り出す。',                 playstyle: 'ATKのコンボで安定してチェーンを稼ぐ。DEFで急な防御切替も可能。' },
  voru: { description: '火山の化身。狂戦士スタイルで自らを傷つけながら爆発的ダメージを叩き出す。', playstyle: 'バーサク状態での超火力が真骨頂。回復役との連携で瀕死をキープして戦え。' },
  reo:  { description: '百獣の王。高いHPと攻撃力でブレイク中に最大火力を発揮するブレイクハンター。', playstyle: 'DEFで粘り強く耐えつつブレイクを待つ。ブレイク直後にATKで奥義を叩き込め。' },
  bom:  { description: '爆発魔法のエキスパート。低HPだが高MAGで敵の弱点を連続爆撃する火力特化型。', playstyle: 'BLAで弱点を突いてチェーンを伸ばしブレイクを狙う。ENHでフェイスをかけてから攻めると吉。' },
  ho:   { description: '月の魔導師。攻撃・回復・強化を器用にこなす全方位魔法使い。',                 playstyle: 'BLAで牽制しつつHLRで回復。ENHの強化バフを序盤に展開するのが基本。' },
  sac:  { description: '海の歌姫。流水のような素早い動きでENHを得意とし、味方全体を底上げする。',   playstyle: 'ENHでプロテス・シェル・ヘイストを素早く展開。BLAも高水準でサブ火力にもなれる。' },
  va:   { description: '自然の力を宿す治癒者。高い回復量と独自のリジェネ系スキルで味方を支える。', playstyle: 'HLRで安定回復を担い、JAMで敵にデバフをかけながら戦況をコントロール。' },
  daku: { description: '闇の魔術師。強力なデバフと闇属性攻撃で敵の弱点を突く邪悪な戦略家。',       playstyle: 'JAMでストップ・カース等の凶悪デバフを叩き込みBLAで追い打ち。対ボス最強格。' },
  en:   { description: '聖なる光の使い手。回復と強化を高次元で両立し、パーティを完璧に支援する。', playstyle: 'ENHでバフ展開しHLRで回復。アライズ持ちなので戦闘不能時の立て直しが得意。' },
  jio:  { description: '大地の巨人。地属性魔法と重力で敵の動きを縛る変則的な魔法使い。',           playstyle: 'JAMのグラビラで敵HPを割合削りBLAの地震で一掃。ENHでデバフ効果を延長。' },
  doc:  { description: '薬師。ケアルジャによる大回復とエスナでの状態異常解除が専門。',               playstyle: 'HLRで全体回復とエスナをメインに担当。ENHのヴェイルで状態異常を防ぐ先手も有効。' },
  ran:  { description: 'サイコロを転がす変則魔法使い。チェーンブーストと魔法爆発が真骨頂。',       playstyle: 'ENHでチェーンブーストをかけてからBLAで一気にブレイク。JAMのグラビラも便利。' },
  hana: { description: '花の癒し手。リジェネ系スキルで継続回復を重視した持久戦型サポート。',       playstyle: 'HLRでリジェネを維持しながらENHでバフ展開。長期戦で最も輝くキャラ。' },
  kou:  { description: '虹色の魔導師。トライディザスターで複数属性を同時に扱える万能攻撃型。',     playstyle: 'BLAで多属性カバー、ENHで強化を素早く展開。弱点が分からない敵に特に有効。' },
  gar:  { description: '鉄壁の守護者。盾を持つ防衛のエース。高HPで味方を守りながら攻撃もこなす。', playstyle: 'DEFで挑発して被弾を引き受け、ATKで反撃。バランス型パーティの中核として活躍。' },
  roku: { description: '山岳の鬼神。不動の守護者として高い物理防御を活かし最前線に立ち続ける。',   playstyle: 'DEFで壁を務めATKで反撃。ENHで仲間にバフをかけつつ陣形を安定させるのが理想。' },
  roza: { description: '戦乙女の弓手。ATKとHLRを兼ね備えた攻守バランス型の弓使い。',               playstyle: 'BLAで牽制しATKで追撃。パーティが安定していればHLRでサポートにも回れる。' },
  cho:  { description: '蝶のように舞う奇術師。ATK/BLA/ENH/JAMの4ロールで状況適応力が最高峰。',    playstyle: '固有のチェーンブーストでブレイクを後押し。4ロールを使い分ける立ち回りが重要。' },
  ryu:  { description: '龍騎士。防御と回復を兼備した自己完結型の前衛で、単独でも粘り強く戦える。', playstyle: 'ATKとDEFを切り替えながら自立して戦える。HLRで自分を回復しつつ持久戦に持ち込む。' },
  kika: { description: '機械仕掛けの楽師。ENHとJAMで味方強化と敵弱体を同時進行する戦略家。',       playstyle: 'ヴェイルとインペリルを素早く展開。属性弱点持ちの敵にはインペリルが驚異的に機能する。' },
  ste:  { description: '輝く星の戦士。仲間と連携することで真価を発揮するソリダリティスペシャリスト。', playstyle: 'ATKでブレイクハンターを活かしつつ、味方との連携シナジーを意識して立ち回る。' },
  baru: { description: '演奏で仲間を鼓舞する楽師。チェーンブーストとアライズで戦局を動かす。',     playstyle: 'ENHのチェーンブーストで全体チェーンを加速。アライズで戦闘不能から即時復活させる。' },
  pose: { description: '海神の申し子。水属性と重力で場を支配し、攻撃とデバフを同時にこなす。',     playstyle: 'BLAのウォータガで水弱点を突きつつJAMのグラビラでHP割合ダメージ。チェーン構築も速い。' },
  gan:  { description: '闇眼の魔人。ATK/BLA/ENH/JAMの4ロールを使いこなす万能の野心家。',          playstyle: '固有のマジックバーストとインペリルで被ダメージを爆発的に増幅する戦術が強力。' },
};

export function getCharProfile(id: string): CharProfile | undefined {
  return CHARACTER_PROFILES[id];
}
