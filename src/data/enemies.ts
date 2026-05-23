import type { EnemyData } from '../types';

export const ENEMIES: EnemyData[] = [
  // ---- 通常戦 ----
  {
    id: 'zako_a', emoji: '👾', name: 'ザコA',
    maxHP: 3000, str: 80, mag: 60,
    breakThreshold: 200,
    weaknesses: ['fire'],
    resistances: [],
    physDef: 0, magDef: 0,
    gilReward: 100,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_atk', rate: 0.45 }, { itemId: 'fragment_kuri', rate: 0.40 }, { itemId: 'fragment_kaze', rate: 0.35 }],
      rare:     [{ itemId: 'crystal_atk', rate: 0.30 }, { itemId: 'fragment_taka', rate: 0.25 }],
    },
    actions: [
      { id: 'za_attack', name: 'たたかう', power: 0.8, cooldown: 2.5 },
      { id: 'za_rush',   name: 'ラッシュ', power: 0.5, cooldown: 5.0 },
    ],
  },
  {
    id: 'slime', emoji: '(ﾉ◕ヮ◕)ﾉ', name: 'スライム',
    maxHP: 2000, str: 60, mag: 50,
    breakThreshold: 150,
    weaknesses: ['fire', 'thunder'],
    resistances: [],
    physResist: 0.3,
    physDef: 0, magDef: 0,
    gilReward: 80,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_bla', rate: 0.40 }, { itemId: 'fragment_ho', rate: 0.35 }],
      rare:     [{ itemId: 'fragment_va', rate: 0.25 }, { itemId: 'fragment_en', rate: 0.20 }],
    },
    actions: [
      { id: 'sl_bounce', name: 'バウンス', power: 0.6, cooldown: 3.0 },
      { id: 'sl_absorb', name: 'アブソーブ', power: 0.4, cooldown: 6.0 },
    ],
  },
  {
    id: 'ice_wyvern', emoji: '❄️🐲❄️', name: 'アイスワイバーン',
    maxHP: 10000, str: 140, mag: 130,
    breakThreshold: 450,
    weaknesses: ['fire'],
    resistances: ['ice'],
    physDef: 10, magDef: 20,
    gilReward: 250,
    dropTable: {
      common:   [{ itemId: 'dragon_scale', rate: 0.95 }],
      uncommon: [{ itemId: 'acc_ice_amulet', rate: 0.45 }, { itemId: 'fragment_kuri', rate: 0.40 }],
      rare:     [{ itemId: 'dragon_fang', rate: 0.30 }, { itemId: 'fragment_ho', rate: 0.22 }],
    },
    actions: [
      { id: 'iw_claw',    name: 'アイスクロー',   power: 1.0, cooldown: 3.0 },
      { id: 'iw_breath',  name: 'ブリザードブレス', power: 1.2, element: 'ice', aoe: true, cooldown: 7.0 },
    ],
  },
  {
    id: 'thunder_hawk', emoji: '⚡🦅⚡', name: 'サンダーホーク',
    maxHP: 7000, str: 160, mag: 80,
    breakThreshold: 350,
    weaknesses: ['ice'],
    resistances: ['thunder'],
    physDef: 0, magDef: 15,
    gilReward: 220,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_thunder_amulet', rate: 0.45 }, { itemId: 'fragment_taka', rate: 0.40 }, { itemId: 'fragment_kaze', rate: 0.35 }],
      rare:     [{ itemId: 'crystal_atk', rate: 0.28 }, { itemId: 'fragment_rai', rate: 0.22 }],
    },
    actions: [
      { id: 'th_dive',     name: 'ダイブアタック', power: 1.1, cooldown: 3.0 },
      { id: 'th_thunder',  name: 'サンダーストライク', power: 1.3, element: 'thunder', cooldown: 6.0 },
    ],
  },
  {
    id: 'dark_soldier', emoji: '🌑⚔️🌑', name: 'ダークソルジャー',
    maxHP: 9000, str: 180, mag: 60,
    breakThreshold: 420,
    weaknesses: ['holy'],
    resistances: ['dark'],
    physDef: 30, magDef: 5,
    gilReward: 240,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 0.95 }],
      uncommon: [{ itemId: 'crystal_atk', rate: 0.45 }, { itemId: 'fragment_ifu', rate: 0.38 }, { itemId: 'fragment_fa', rate: 0.35 }],
      rare:     [{ itemId: 'acc_dark_stone', rate: 0.30 }, { itemId: 'fragment_voru', rate: 0.22 }],
    },
    actions: [
      { id: 'ds_slash',   name: 'ダークスラッシュ', power: 1.3, element: 'dark', cooldown: 3.5 },
      { id: 'ds_shadow',  name: 'シャドウブレイク',  power: 1.0, cooldown: 5.0 },
    ],
  },
  {
    id: 'golem', emoji: '🪨⚙️🪨', name: 'ゴーレム',
    maxHP: 15000, str: 120, mag: 40,
    breakThreshold: 600,
    weaknesses: ['thunder', 'water'],
    resistances: [],
    physResist: 0.4,
    physDef: 60, magDef: 5,
    gilReward: 280,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_def', rate: 0.50 }, { itemId: 'fragment_gar', rate: 0.42 }, { itemId: 'fragment_roku', rate: 0.38 }],
      rare:     [{ itemId: 'fragment_ryu', rate: 0.28 }, { itemId: 'fragment_tora', rate: 0.22 }],
    },
    actions: [
      { id: 'go_smash',   name: 'ロックスマッシュ', power: 1.5, cooldown: 4.5 },
      { id: 'go_stomp',   name: 'ストンプ',          power: 1.0, aoe: true, cooldown: 8.0 },
    ],
  },
  {
    id: 'dragon', emoji: '🐉', name: 'ドラゴン',
    maxHP: 12000, str: 150, mag: 120,
    breakThreshold: 500,
    weaknesses: ['ice'],
    resistances: ['fire'],
    physDef: 20, magDef: 0,
    gilReward: 300,
    dropTable: {
      common:   [{ itemId: 'dragon_scale', rate: 0.95 }],
      uncommon: [{ itemId: 'acc_ice_amulet', rate: 0.45 }, { itemId: 'fragment_tora', rate: 0.40 }, { itemId: 'fragment_voru', rate: 0.35 }],
      rare:     [{ itemId: 'dragon_fang', rate: 0.32 }, { itemId: 'fragment_reo', rate: 0.25 }],
    },
    actions: [
      { id: 'dr_bite',    name: 'バイト',     power: 1.2, cooldown: 3.0 },
      { id: 'dr_breath',  name: 'ドラゴンブレス', power: 1.0, element: 'fire', aoe: true, cooldown: 7.0 },
    ],
  },
  {
    id: 'machine', emoji: '🤖', name: 'マシン',
    maxHP: 8000, str: 130, mag: 80,
    breakThreshold: 400,
    weaknesses: ['thunder'],
    resistances: [],
    physResist: 0.5,
    physDef: 50, magDef: 10,
    gilReward: 200,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_bla', rate: 0.48 }, { itemId: 'fragment_bom', rate: 0.40 }, { itemId: 'fragment_sac', rate: 0.35 }],
      rare:     [{ itemId: 'acc_thunder_amulet', rate: 0.32 }, { itemId: 'fragment_daku', rate: 0.25 }],
    },
    actions: [
      { id: 'mc_laser',   name: 'レーザー',   power: 1.0, element: 'thunder', cooldown: 3.0 },
      { id: 'mc_missile', name: 'ミサイル',   power: 1.5, cooldown: 6.0 },
    ],
  },

  // ---- ボス戦 ----
  {
    id: 'deathord', emoji: '💀👑💀', name: 'デスロード',
    maxHP: 50000, str: 200, mag: 250,
    breakThreshold: 600,
    weaknesses: ['holy'],
    resistances: ['dark'],
    physDef: 30, magDef: 30,
    gilReward: 2000,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_bla', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_dark_stone', rate: 0.35 }, { itemId: 'fragment_en', rate: 0.55 }, { itemId: 'fragment_jio', rate: 0.50 }],
      rare:     [{ itemId: 'acc_dark_stone', rate: 0.25 }, { itemId: 'fragment_doc', rate: 0.42 }, { itemId: 'fragment_roku', rate: 0.38 }],
    },
    actions: [
      { id: 'dl_dark',    name: 'ダーク',     power: 1.2, element: 'dark',  cooldown: 3.0 },
      { id: 'dl_darkga',  name: 'ダークガ',   power: 2.0, element: 'dark', aoe: true, cooldown: 8.0 },
      { id: 'dl_curse',   name: 'カース',     power: 0,   debuff: 'curse', cooldown: 10.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.5, buffSelf: ['haste'], newActions: ['dl_darkga'] },
    ],
  },
  {
    id: 'chaos_knight', emoji: '👑💀⚔️💀👑', name: 'カオスナイト',
    maxHP: 60000, str: 270, mag: 200,
    breakThreshold: 650,
    weaknesses: ['holy'],
    resistances: ['dark'],
    physDef: 40, magDef: 20,
    gilReward: 3000,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_atk', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_dark_stone', rate: 0.40 }, { itemId: 'fragment_ifu', rate: 0.55 }, { itemId: 'fragment_fa', rate: 0.50 }],
      rare:     [{ itemId: 'dragon_fang', rate: 0.35 }, { itemId: 'fragment_gar', rate: 0.40 }, { itemId: 'fragment_ryo', rate: 0.30 }],
    },
    actions: [
      { id: 'ck_slash',   name: 'カオスブレイド',  power: 1.5, element: 'dark', cooldown: 3.5 },
      { id: 'ck_roar',    name: '戦慄の雄叫び',   power: 0.8, aoe: true, cooldown: 6.0 },
      { id: 'ck_dark',    name: 'ダークグレイブ',  power: 2.2, element: 'dark', cooldown: 9.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.5, buffSelf: ['haste', 'prot'] },
    ],
  },
  {
    id: 'arch_lich', emoji: '💀🔮✨🔮💀', name: 'アーチリッチ',
    maxHP: 70000, str: 150, mag: 350,
    breakThreshold: 700,
    weaknesses: ['holy', 'fire'],
    resistances: ['dark', 'ice'],
    physDef: 10, magDef: 50,
    gilReward: 3500,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_bla', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_dark_stone', rate: 0.45 }, { itemId: 'fragment_daku', rate: 0.55 }, { itemId: 'fragment_jio', rate: 0.50 }],
      rare:     [{ itemId: 'god_proof', rate: 0.20 }, { itemId: 'fragment_ran', rate: 0.42 }, { itemId: 'fragment_bom', rate: 0.38 }],
    },
    actions: [
      { id: 'al_dark',    name: 'ダークフレア',    power: 1.8, element: 'dark',  cooldown: 4.0 },
      { id: 'al_curaga',  name: 'ダーク回復',      power: 0,   cooldown: 12.0 },
      { id: 'al_death',   name: 'デス',            power: 2.5, aoe: true, cooldown: 10.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.6, buffSelf: ['faith'] },
      { phaseId: 'phase3', triggerHPPercent: 0.3, buffSelf: ['faith', 'haste'] },
    ],
  },
  {
    id: 'chaosgod', emoji: '🌋🔥🌋', name: 'カオスゴッド',
    maxHP: 80000, str: 240, mag: 280,
    breakThreshold: 700,
    weaknesses: [],
    resistances: ['fire', 'ice', 'thunder'],
    physDef: 30, magDef: 30,
    gilReward: 4000,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }],
      uncommon: [{ itemId: 'god_proof', rate: 0.20 }, { itemId: 'fragment_ran', rate: 0.55 }, { itemId: 'fragment_hana', rate: 0.55 }, { itemId: 'fragment_kou', rate: 0.50 }],
      rare:     [{ itemId: 'god_proof', rate: 0.30 }, { itemId: 'fragment_roza', rate: 0.45 }, { itemId: 'fragment_cho', rate: 0.45 }, { itemId: 'fragment_kika', rate: 0.40 }],
    },
    actions: [
      { id: 'cg_quake',   name: 'クエイク',   power: 1.5, element: 'earth', aoe: true, cooldown: 5.0 },
      { id: 'cg_deprote', name: 'デプロテ',   power: 0,   debuff: 'deprot', cooldown: 6.0 },
      { id: 'cg_chaos',   name: 'カオスブレス', power: 2.0, aoe: true, cooldown: 10.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.6, buffSelf: ['prot'] },
      { phaseId: 'phase3', triggerHPPercent: 0.3, buffSelf: ['haste', 'prot'] },
    ],
  },
  {
    id: 'sky_behemoth', emoji: '🌩️🦬💥🦬🌩️', name: 'スカイベヒーモス',
    maxHP: 90000, str: 320, mag: 200,
    breakThreshold: 750,
    weaknesses: [],
    resistances: [],
    physResist: 0.3,
    physDef: 50, magDef: 20,
    gilReward: 5000,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_def', rate: 1.0 }],
      uncommon: [{ itemId: 'god_proof', rate: 0.25 }, { itemId: 'fragment_ryu', rate: 0.55 }, { itemId: 'fragment_ste', rate: 0.50 }],
      rare:     [{ itemId: 'god_proof', rate: 0.35 }, { itemId: 'fragment_baru', rate: 0.45 }, { itemId: 'fragment_pose', rate: 0.40 }],
    },
    actions: [
      { id: 'sb_charge',  name: 'チャージ',        power: 2.0, cooldown: 4.0 },
      { id: 'sb_thunder', name: 'サンダーブレス',   power: 1.5, element: 'thunder', aoe: true, cooldown: 7.0 },
      { id: 'sb_mega',    name: 'メガトンクラッシュ', power: 3.0, aoe: true, cooldown: 12.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.5, buffSelf: ['haste', 'prot'] },
    ],
  },
  {
    id: 'finalboss', emoji: '✨👑🌟👑✨', name: 'ラスボス',
    maxHP: 120000, str: 300, mag: 320,
    breakThreshold: 800,
    weaknesses: [],
    resistances: [],
    physDef: 30, magDef: 30,
    gilReward: 8000,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_all', rate: 1.0 }],
      uncommon: [{ itemId: 'god_proof', rate: 0.35 }, { itemId: 'fragment_ryu', rate: 0.60 }, { itemId: 'fragment_ste', rate: 0.60 }, { itemId: 'fragment_baru', rate: 0.55 }],
      rare:     [{ itemId: 'god_proof', rate: 0.50 }, { itemId: 'fragment_pose', rate: 0.55 }, { itemId: 'fragment_gan', rate: 0.55 }],
    },
    actions: [
      { id: 'fb_fire',    name: 'ファイガ',   power: 2.0, element: 'fire',    cooldown: 4.0 },
      { id: 'fb_ice',     name: 'ブリザガ',   power: 2.0, element: 'ice',     cooldown: 4.0 },
      { id: 'fb_thunder', name: 'サンダガ',   power: 2.0, element: 'thunder', cooldown: 4.0 },
      { id: 'fb_omega',   name: 'オメガフレア', power: 3.5, aoe: true, cooldown: 12.0 },
      { id: 'fb_regen',   name: '自己回復',   power: 0, cooldown: 15.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.66 },
      { phaseId: 'phase3', triggerHPPercent: 0.33, buffSelf: ['haste', 'faith'] },
    ],
  },
];

// ステージ構成
export const STAGE_WAVES: { stageId: number; waves: string[][] }[] = [
  { stageId: 1, waves: [['zako_a', 'zako_a', 'zako_a'], ['zako_a', 'zako_a'], ['dragon']] },
  { stageId: 2, waves: [['zako_a', 'zako_a', 'zako_a'], ['machine'], ['dragon', 'dragon']] },
  { stageId: 3, waves: [['machine', 'machine'], ['dragon'], ['deathord']] },
  { stageId: 4, waves: [['dragon', 'dragon', 'dragon'], ['machine', 'machine'], ['chaosgod']] },
  { stageId: 5, waves: [['dragon', 'machine'], ['deathord'], ['finalboss']] },
];

export function getEnemyById(id: string): EnemyData | undefined {
  return ENEMIES.find(e => e.id === id);
}
