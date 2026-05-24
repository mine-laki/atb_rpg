import type { EnemyData } from '../types';

export const ENEMIES: EnemyData[] = [
  // ---- 通常戦 ----
  {
    id: 'zako_a', emoji: '👾', name: 'ザコA',
    maxHP: 45000, str: 80, mag: 60,
    weaknesses: ['fire'],
    resistances: [],
    physDef: 0, magDef: 0,
    gilReward: 100, debuffSuccessRate: 85,
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
    maxHP: 30000, str: 60, mag: 50,
    weaknesses: ['fire', 'thunder'],
    resistances: [],
    physResist: 0.3,
    physDef: 0, magDef: 0,
    gilReward: 80, debuffSuccessRate: 90,
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
    maxHP: 150000, str: 140, mag: 130,
    weaknesses: ['fire'],
    resistances: ['ice'],
    physDef: 10, magDef: 20,
    gilReward: 250, debuffSuccessRate: 65,
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
    maxHP: 100000, str: 160, mag: 80,
    weaknesses: ['ice'],
    resistances: ['thunder'],
    physDef: 0, magDef: 15,
    gilReward: 220, debuffSuccessRate: 70,
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
    maxHP: 130000, str: 180, mag: 60,
    weaknesses: ['holy'],
    resistances: ['dark'],
    physDef: 30, magDef: 5,
    gilReward: 240, debuffSuccessRate: 60,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 0.95 }],
      uncommon: [{ itemId: 'crystal_atk', rate: 0.45 }, { itemId: 'fragment_ifu', rate: 0.38 }, { itemId: 'fragment_fa', rate: 0.35 }],
      rare:     [{ itemId: 'acc_dark_stone', rate: 0.30 }, { itemId: 'fragment_voru', rate: 0.22 }],
    },
    actions: [
      { id: 'ds_slash',   name: 'ダークスラッシュ', power: 1.3, element: 'dark', cooldown: 3.5 },
      { id: 'ds_shadow',  name: 'シャドウブレイク', power: 1.0, cooldown: 5.0 },
      { id: 'ds_curse',   name: 'ダークカース',     power: 0, debuff: 'deshell', cooldown: 9.0 },
    ],
  },
  {
    id: 'golem', emoji: '🪨⚙️🪨', name: 'ゴーレム',
    maxHP: 220000, str: 120, mag: 40,
    weaknesses: ['thunder', 'water'],
    resistances: [],
    physResist: 0.4,
    physDef: 60, magDef: 5,
    gilReward: 280, debuffSuccessRate: 30,
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
    id: 'wolf', emoji: '🐺', name: 'ウルフ',
    maxHP: 60000, str: 100, mag: 40,
    weaknesses: ['fire'],
    resistances: [],
    physDef: 0, magDef: 0,
    gilReward: 120, debuffSuccessRate: 80,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_atk', rate: 0.40 }, { itemId: 'fragment_fa', rate: 0.35 }],
      rare:     [{ itemId: 'fragment_rai', rate: 0.22 }, { itemId: 'fragment_tora', rate: 0.18 }],
    },
    actions: [
      { id: 'wf_bite',  name: 'バイト',      power: 0.9, cooldown: 2.0 },
      { id: 'wf_howl',  name: 'ハウリング',  power: 0.7, aoe: true, cooldown: 6.0 },
    ],
  },
  {
    id: 'bat', emoji: '🦇', name: 'バット',
    maxHP: 40000, str: 50, mag: 80,
    weaknesses: ['fire', 'holy'],
    resistances: ['dark'],
    physDef: 0, magDef: 10,
    gilReward: 90, debuffSuccessRate: 85,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_bla', rate: 0.38 }, { itemId: 'fragment_daku', rate: 0.32 }],
      rare:     [{ itemId: 'fragment_ho', rate: 0.20 }],
    },
    actions: [
      { id: 'bt_scratch', name: 'スクラッチ',  power: 0.6, cooldown: 2.5 },
      { id: 'bt_sonic',   name: '超音波',      power: 0.5, aoe: true, cooldown: 7.0 },
    ],
  },
  {
    id: 'scorpion', emoji: '🦂', name: 'スコーピオン',
    maxHP: 80000, str: 110, mag: 70,
    weaknesses: ['ice', 'water'],
    resistances: [],
    physDef: 10, magDef: 0,
    gilReward: 150, debuffSuccessRate: 70,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_jam', rate: 0.42 }, { itemId: 'fragment_kaze', rate: 0.35 }],
      rare:     [{ itemId: 'fragment_voru', rate: 0.22 }, { itemId: 'acc_dark_stone', rate: 0.15 }],
    },
    actions: [
      { id: 'sc_sting',  name: 'スティング',   power: 1.0, cooldown: 3.0 },
      { id: 'sc_venom',  name: 'ベノムテイル', power: 0.8, debuff: 'poison', cooldown: 7.0 },
      { id: 'sc_deprot', name: '鎧砕き',       power: 0, debuff: 'deprot', cooldown: 10.0 },
    ],
  },
  {
    id: 'snake', emoji: '🐍', name: 'スネーク',
    maxHP: 50000, str: 90, mag: 85,
    weaknesses: ['ice'],
    resistances: [],
    physDef: 0, magDef: 5,
    gilReward: 110, debuffSuccessRate: 75,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_normal', rate: 1.0 }],
      uncommon: [{ itemId: 'crystal_jam', rate: 0.38 }, { itemId: 'fragment_kuri', rate: 0.32 }],
      rare:     [{ itemId: 'fragment_bom', rate: 0.20 }],
    },
    actions: [
      { id: 'sn_bite',   name: '毒牙',      power: 0.8, cooldown: 3.0 },
      { id: 'sn_coil',   name: '締め付け',  power: 1.2, cooldown: 6.0 },
    ],
  },
  {
    id: 'dragon', emoji: '🐉', name: 'ドラゴン',
    maxHP: 180000, str: 150, mag: 120,
    weaknesses: ['ice'],
    resistances: ['fire'],
    physDef: 20, magDef: 0,
    gilReward: 300, debuffSuccessRate: 55,
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
    maxHP: 120000, str: 130, mag: 80,
    weaknesses: ['thunder'],
    resistances: [],
    physResist: 0.5,
    physDef: 50, magDef: 10,
    gilReward: 200, debuffSuccessRate: 20,
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
    maxHP: 1000000, str: 200, mag: 250,
    chainResistMax: 500, chainBuildRate: 1.0,  // 普通
    weaknesses: ['holy'],
    resistances: ['dark'],
    physDef: 30, magDef: 30,
    gilReward: 2000, debuffSuccessRate: 45,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_bla', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_dark_stone', rate: 0.35 }, { itemId: 'fragment_en', rate: 0.55 }, { itemId: 'fragment_jio', rate: 0.50 }],
      rare:     [{ itemId: 'acc_dark_stone', rate: 0.25 }, { itemId: 'fragment_doc', rate: 0.42 }, { itemId: 'fragment_roku', rate: 0.38 }, { itemId: 'relic_lich', rate: 0.06, dropType: 'equipment' as const }],
    },
    actions: [
      { id: 'dl_dark',    name: 'ダーク',       power: 1.2, element: 'dark',  cooldown: 3.0 },
      { id: 'dl_darkga',  name: 'ダークガ',     power: 2.0, element: 'dark', aoe: true, cooldown: 8.0 },
      { id: 'dl_curse',   name: 'カース',       power: 0, debuff: 'curse', cooldown: 10.0 },
      { id: 'dl_shell',   name: '闇の障壁',     power: 0, selfBuff: ['shell', 'prot'], cooldown: 20.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.5, buffSelf: ['haste'], newActions: ['dl_darkga'] },
    ],
  },
  {
    id: 'chaos_knight', emoji: '👑💀⚔️💀👑', name: 'カオスナイト',
    maxHP: 1200000, str: 270, mag: 200,
    chainResistMax: 900, chainBuildRate: 2.0,  // 高閾値・上がりやすい
    weaknesses: ['holy'],
    resistances: ['dark'],
    physDef: 40, magDef: 20,
    gilReward: 3000, debuffSuccessRate: 35,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_atk', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_dark_stone', rate: 0.40 }, { itemId: 'fragment_ifu', rate: 0.55 }, { itemId: 'fragment_fa', rate: 0.50 }],
      rare:     [{ itemId: 'dragon_fang', rate: 0.35 }, { itemId: 'fragment_gar', rate: 0.40 }, { itemId: 'fragment_ryo', rate: 0.30 }, { itemId: 'relic_chaos', rate: 0.07, dropType: 'equipment' as const }],
    },
    actions: [
      { id: 'ck_slash',    name: 'カオスブレイド',  power: 1.5, element: 'dark', cooldown: 3.5 },
      { id: 'ck_roar',     name: '戦慄の雄叫び',   power: 0.8, aoe: true, cooldown: 6.0 },
      { id: 'ck_dark',     name: 'ダークグレイブ',  power: 2.2, element: 'dark', cooldown: 9.0 },
      { id: 'ck_deshell',  name: '魔法の盾砕き',   power: 0, debuff: 'deshell', cooldown: 12.0 },
      { id: 'ck_bravery',  name: '暗黒の奮起',     power: 0, selfBuff: ['bravery', 'prot'], cooldown: 22.0, condition: 'phase2' },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.5, buffSelf: ['haste', 'prot'] },
    ],
  },
  {
    id: 'arch_lich', emoji: '💀🔮✨🔮💀', name: 'アーチリッチ',
    maxHP: 1400000, str: 150, mag: 350,
    chainResistMax: 250, chainBuildRate: 0.4,  // 低閾値・上がりにくい
    weaknesses: ['holy', 'fire'],
    resistances: ['dark', 'ice'],
    physDef: 10, magDef: 50,
    gilReward: 3500, debuffSuccessRate: 30,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_bla', rate: 1.0 }],
      uncommon: [{ itemId: 'acc_dark_stone', rate: 0.45 }, { itemId: 'fragment_daku', rate: 0.55 }, { itemId: 'fragment_jio', rate: 0.50 }],
      rare:     [{ itemId: 'god_proof', rate: 0.20 }, { itemId: 'fragment_ran', rate: 0.42 }, { itemId: 'fragment_bom', rate: 0.38 }, { itemId: 'relic_lich', rate: 0.08, dropType: 'equipment' as const }],
    },
    actions: [
      { id: 'al_dark',    name: 'ダークフレア',    power: 1.8, element: 'dark', cooldown: 4.0 },
      { id: 'al_curaga',  name: 'ダーク回復',      power: 0, selfBuff: ['shell', 'faith'], cooldown: 14.0 },
      { id: 'al_death',   name: 'デス',            power: 2.5, aoe: true, cooldown: 10.0 },
      { id: 'al_deshell', name: '魔法封じ',        power: 0, debuff: 'deshell', aoe: true, cooldown: 15.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.6, buffSelf: ['faith'] },
      { phaseId: 'phase3', triggerHPPercent: 0.3, buffSelf: ['faith', 'haste'] },
    ],
  },
  {
    id: 'chaosgod', emoji: '🌋🔥🌋', name: 'カオスゴッド',
    maxHP: 1600000, str: 240, mag: 280,
    chainResistMax: 200, chainBuildRate: 0.4,  // 低閾値・上がりにくい
    weaknesses: [],
    resistances: ['fire', 'ice', 'thunder'],
    physDef: 30, magDef: 30,
    gilReward: 4000, debuffSuccessRate: 15,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }],
      uncommon: [{ itemId: 'god_proof', rate: 0.20 }, { itemId: 'fragment_ran', rate: 0.55 }, { itemId: 'fragment_hana', rate: 0.55 }, { itemId: 'fragment_kou', rate: 0.50 }],
      rare:     [{ itemId: 'god_proof', rate: 0.30 }, { itemId: 'fragment_roza', rate: 0.45 }, { itemId: 'fragment_cho', rate: 0.45 }, { itemId: 'fragment_kika', rate: 0.40 }],
    },
    actions: [
      { id: 'cg_quake',   name: 'クエイク',     power: 1.5, element: 'earth', aoe: true, cooldown: 5.0 },
      { id: 'cg_deprote', name: 'デプロテ',     power: 0, debuff: 'deprot', aoe: true, cooldown: 8.0 },
      { id: 'cg_chaos',   name: 'カオスブレス', power: 2.0, aoe: true, cooldown: 10.0 },
      { id: 'cg_slow',    name: 'タイムストップ', power: 0, debuff: 'slow', aoe: true, cooldown: 18.0, condition: 'phase2' },
      { id: 'cg_prot',    name: 'カオスの守護', power: 0, selfBuff: ['prot'], cooldown: 16.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.6, buffSelf: ['prot'] },
      { phaseId: 'phase3', triggerHPPercent: 0.3, buffSelf: ['haste', 'prot'] },
    ],
  },
  {
    id: 'sky_behemoth', emoji: '🌩️🦬💥🦬🌩️', name: 'スカイベヒーモス',
    maxHP: 1800000, str: 320, mag: 200,
    chainResistMax: 850, chainBuildRate: 1.8,  // 高閾値・上がりやすい
    weaknesses: [],
    resistances: [],
    physResist: 0.3,
    physDef: 50, magDef: 20,
    gilReward: 5000, debuffSuccessRate: 40,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_def', rate: 1.0 }],
      uncommon: [{ itemId: 'god_proof', rate: 0.25 }, { itemId: 'fragment_ryu', rate: 0.55 }, { itemId: 'fragment_ste', rate: 0.50 }],
      rare:     [{ itemId: 'god_proof', rate: 0.35 }, { itemId: 'fragment_baru', rate: 0.45 }, { itemId: 'fragment_pose', rate: 0.40 }, { itemId: 'relic_guardian', rate: 0.08, dropType: 'equipment' as const }],
    },
    actions: [
      { id: 'sb_charge',  name: 'チャージ',           power: 2.0, cooldown: 4.0 },
      { id: 'sb_thunder', name: 'サンダーブレス',      power: 1.5, element: 'thunder', aoe: true, cooldown: 7.0 },
      { id: 'sb_mega',    name: 'メガトンクラッシュ',  power: 3.0, aoe: true, cooldown: 12.0 },
      { id: 'sb_roar',    name: '威圧の咆哮',          power: 0, debuff: 'deprot', aoe: true, cooldown: 14.0 },
      { id: 'sb_bravery', name: '暴走モード',          power: 0, selfBuff: ['bravery', 'haste'], cooldown: 20.0, condition: 'phase2' },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.5, buffSelf: ['haste', 'prot'] },
    ],
  },
  {
    id: 'finalboss', emoji: '✨👑🌟👑✨', name: 'ラスボス',
    maxHP: 2400000, str: 300, mag: 320,
    chainResistMax: 600, chainBuildRate: 1.0,  // 普通
    weaknesses: [],
    resistances: [],
    physDef: 30, magDef: 30,
    gilReward: 8000, debuffSuccessRate: 10,
    isBoss: true,
    dropTable: {
      common:   [{ itemId: 'enhance_stone_rare', rate: 1.0 }, { itemId: 'crystal_all', rate: 1.0 }],
      uncommon: [{ itemId: 'god_proof', rate: 0.35 }, { itemId: 'fragment_ryu', rate: 0.60 }, { itemId: 'fragment_ste', rate: 0.60 }, { itemId: 'fragment_baru', rate: 0.55 }],
      rare:     [{ itemId: 'god_proof', rate: 0.50 }, { itemId: 'fragment_pose', rate: 0.55 }, { itemId: 'fragment_gan', rate: 0.55 }, { itemId: 'relic_seraph', rate: 0.10, dropType: 'equipment' as const }, { itemId: 'relic_omega', rate: 0.08, dropType: 'equipment' as const }],
    },
    actions: [
      { id: 'fb_doom',    name: '運命の宣告',   power: 0, powerPercent: 0.99, aoe: true, cooldown: 120.0 },
      { id: 'fb_fire',    name: 'ファイガ',     power: 2.0, element: 'fire',    cooldown: 4.0 },
      { id: 'fb_ice',     name: 'ブリザガ',     power: 2.0, element: 'ice',     cooldown: 4.0 },
      { id: 'fb_thunder', name: 'サンダガ',     power: 2.0, element: 'thunder', cooldown: 4.0 },
      { id: 'fb_omega',   name: 'オメガフレア', power: 3.5, aoe: true, cooldown: 12.0 },
      { id: 'fb_deprot',  name: '終焉の呪い',   power: 0, debuff: 'deprot', aoe: true, cooldown: 18.0 },
      { id: 'fb_faith',   name: '闇の信仰',     power: 0, selfBuff: ['faith', 'shell'], cooldown: 25.0 },
    ],
    phases: [
      { phaseId: 'phase2', triggerHPPercent: 0.66 },
      { phaseId: 'phase3', triggerHPPercent: 0.33, buffSelf: ['haste', 'faith'] },
    ],
  },
];

// ステージ構成
export const STAGE_WAVES: { stageId: number; waves: string[][] }[] = [
  { stageId: 1, waves: [['slime', 'bat', 'slime'], ['wolf', 'wolf', 'bat'], ['dragon']] },
  { stageId: 2, waves: [['wolf', 'snake', 'zako_a'], ['ice_wyvern', 'thunder_hawk'], ['machine']] },
  { stageId: 3, waves: [['scorpion', 'golem', 'scorpion'], ['dark_soldier', 'dark_soldier'], ['deathord']] },
  { stageId: 4, waves: [['ice_wyvern', 'dark_soldier', 'thunder_hawk'], ['chaos_knight'], ['arch_lich']] },
  { stageId: 5, waves: [['golem', 'dark_soldier', 'machine'], ['sky_behemoth'], ['finalboss']] },
];

export function getEnemyById(id: string): EnemyData | undefined {
  return ENEMIES.find(e => e.id === id);
}
