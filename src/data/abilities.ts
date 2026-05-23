import type { CommandAbility, AutoAbility } from '../types';

export const COMMAND_ABILITIES: CommandAbility[] = [
  // ---- ATK ----
  { id: 'atk_fight',      name: 'たたかう',       role: 'ATK', cost: 1, power: 1.5,  chainBonus: 20 },
  { id: 'atk_rush',       name: 'ラッシュ',       role: 'ATK', cost: 2, power: 2.0,  hits: 3, chainBonus: 15 },
  { id: 'atk_braver',     name: 'ブレイバー',     role: 'ATK', cost: 3, power: 4,  chainBonus: 25 },
  { id: 'atk_areablast',  name: 'エリアブラスト', role: 'ATK', cost: 3, power: 2.0,  aoe: true, chainBonus: 18 },
  // ATK unique
  { id: 'atk_blitz',      name: 'ブリッツ',       role: 'ATK', cost: 2, power: 3.5,  chainBonus: 30, isUnique: true, uniqueOwner: 'rai' },
  { id: 'atk_omega',      name: 'オメガドライブ', role: 'ATK', cost: 4, power: 5.0,  chainBonus: 20, isUnique: true, uniqueOwner: 'ifu' },
  { id: 'atk_whirlwind',  name: 'ウィンドブレード',role: 'ATK', cost: 3, power: 4.0,  aoe: true, element: 'wind', chainBonus: 22, isUnique: true, uniqueOwner: 'kaze' },
  { id: 'atk_twinfang',   name: 'ツインファング', role: 'ATK', cost: 2, power: 1.5,  hits: 2, chainBonus: 25, isUnique: true, uniqueOwner: 'fa' },
  { id: 'atk_tkick',      name: 'サンダーキック', role: 'ATK', cost: 3, power: 3.5,  element: 'thunder', chainBonus: 28, isUnique: true, uniqueOwner: 'rai' },
  { id: 'atk_iceedge',    name: 'アイスエッジ',   role: 'ATK', cost: 2, power: 2.5,  element: 'ice', chainBonus: 25, isUnique: true, uniqueOwner: 'kuri' },
  { id: 'atk_berserk',    name: 'バーサクブロウ', role: 'ATK', cost: 3, power: 4.0,  chainBonus: 20, isUnique: true, uniqueOwner: 'ifu' },
  { id: 'atk_psrike',     name: '挑発打ち',       role: 'ATK', cost: 1, power: 1,  chainBonus: 15, isUnique: true, uniqueOwner: 'gar' },

  // ---- BLA ----
  { id: 'bla_fire',       name: 'ファイア',       role: 'BLA', cost: 1, power: 1.0,  element: 'fire',    chainBonus: 45 },
  { id: 'bla_fira',       name: 'ファイラ',       role: 'BLA', cost: 2, power: 1.8,  element: 'fire',    chainBonus: 60 },
  { id: 'bla_firaga',     name: 'ファイガ',       role: 'BLA', cost: 4, power: 3.5,  element: 'fire',    chainBonus: 80 },
  { id: 'bla_blizzard',   name: 'ブリザド',       role: 'BLA', cost: 1, power: 1.0,  element: 'ice',     chainBonus: 45 },
  { id: 'bla_blizzara',   name: 'ブリザラ',       role: 'BLA', cost: 2, power: 1.8,  element: 'ice',     chainBonus: 60 },
  { id: 'bla_blizzaga',   name: 'ブリザガ',       role: 'BLA', cost: 4, power: 3.5,  element: 'ice',     chainBonus: 80 },
  { id: 'bla_thunder',    name: 'サンダー',       role: 'BLA', cost: 1, power: 1.0,  element: 'thunder', chainBonus: 45 },
  { id: 'bla_thundara',   name: 'サンダラ',       role: 'BLA', cost: 2, power: 1.8,  element: 'thunder', chainBonus: 60 },
  { id: 'bla_thundaga',   name: 'サンダガ',       role: 'BLA', cost: 4, power: 3.5,  element: 'thunder', chainBonus: 80 },
  { id: 'bla_aero',       name: 'エアロ',         role: 'BLA', cost: 1, power: 1.0,  element: 'wind',    chainBonus: 45 },
  // BLA unique
  { id: 'bla_waterga',    name: 'ウォータガ',     role: 'BLA', cost: 4, power: 3.5,  element: 'water',   chainBonus: 80, isUnique: true, uniqueOwner: 'sac' },
  { id: 'bla_aeroga',     name: 'エアロガ',       role: 'BLA', cost: 4, power: 3.5,  aoe: true, element: 'wind', chainBonus: 75, isUnique: true, uniqueOwner: 'kaze' },
  { id: 'bla_holy',       name: 'ホーリー',       role: 'BLA', cost: 4, power: 4.0,  element: 'holy',    chainBonus: 85, isUnique: true, uniqueOwner: 'en' },
  { id: 'bla_darkflare',  name: 'ダークフレア',   role: 'BLA', cost: 4, power: 3.8,  aoe: true, element: 'dark', chainBonus: 80, isUnique: true, uniqueOwner: 'daku' },
  { id: 'bla_quake',      name: 'クエイク',       role: 'BLA', cost: 3, power: 2.5,  aoe: true, element: 'earth', chainBonus: 65, isUnique: true, uniqueOwner: 'jio' },
  { id: 'bla_blizzaja',   name: 'ブリザジャ',     role: 'BLA', cost: 4, power: 4.5,  element: 'ice',     chainBonus: 90, isUnique: true, uniqueOwner: 'kuri' },
  { id: 'bla_tridisaster',name: 'トライディザスター',role: 'BLA', cost: 4, power: 2.0, hits: 3, aoe: true, chainBonus: 85, isUnique: true, uniqueOwner: 'ho' },
  { id: 'bla_magicburst', name: 'マジックバースト',role: 'BLA', cost: 3, power: 2.5, hits: 2, chainBonus: 70, isUnique: true, uniqueOwner: 'ran' },

  // ---- DEF ----
  { id: 'def_fight',      name: 'たたかう(DEF)',  role: 'DEF', cost: 1, power: 0.6,  chainBonus: 10 },
  { id: 'def_guard',      name: 'ガード',         role: 'DEF', cost: 1, power: 0,    buff: ['guard'], chainBonus: 0 },
  { id: 'def_stabilize',  name: 'スタビライズ',   role: 'DEF', cost: 2, power: 0,    chainBonus: 0 },

  // ---- HLR ----
  { id: 'hlr_cure',       name: 'ケアル',         role: 'HLR', cost: 1, healValue: 200, chainBonus: 0 },
  { id: 'hlr_cura',       name: 'ケアルラ',       role: 'HLR', cost: 2, healValue: 500, chainBonus: 0 },
  { id: 'hlr_curaga',     name: 'ケアルガ',       role: 'HLR', cost: 3, healValue: 1200, chainBonus: 0 },
  { id: 'hlr_raise',      name: 'レイズ',         role: 'HLR', cost: 3, healPercent: 0.3, chainBonus: 0 },
  // HLR unique
  { id: 'hlr_curaall',    name: 'ケアルラオール', role: 'HLR', cost: 3, healValue: 400, aoe: true, chainBonus: 0, isUnique: true, uniqueOwner: 'va' },
  { id: 'hlr_curaja',     name: 'ケアルジャ',     role: 'HLR', cost: 4, healValue: 2000, chainBonus: 0, isUnique: true, uniqueOwner: 'doc' },
  { id: 'hlr_regen',      name: 'リジェネ',       role: 'HLR', cost: 2, buff: ['regen'], chainBonus: 0, isUnique: true, uniqueOwner: 'va' },
  { id: 'hlr_esuna',      name: 'エスナ',         role: 'HLR', cost: 2, chainBonus: 0, isUnique: true, uniqueOwner: 'doc' },
  { id: 'hlr_arise',      name: 'アリアズ',       role: 'HLR', cost: 4, healPercent: 0.8, chainBonus: 0, isUnique: true, uniqueOwner: 'en' },

  // ---- ENH ----
  { id: 'enh_protect',    name: 'プロテス',       role: 'ENH', cost: 2, buff: ['prot'],    chainBonus: 0 },
  { id: 'enh_shell',      name: 'シェル',         role: 'ENH', cost: 2, buff: ['shell'],   chainBonus: 0 },
  { id: 'enh_haste',      name: 'ヘイスト',       role: 'ENH', cost: 2, buff: ['haste'],   chainBonus: 0 },
  { id: 'enh_faith',      name: 'フェイス',       role: 'ENH', cost: 2, buff: ['faith'],   chainBonus: 0 },
  // ENH general (non-unique)
  { id: 'enh_bravall',    name: 'ブレイバリーオール', role: 'ENH', cost: 4, buff: ['bravery'], aoe: true, chainBonus: 0 },
  { id: 'enh_protall',    name: 'プロテスオール',     role: 'ENH', cost: 3, buff: ['prot'],    aoe: true, chainBonus: 0 },
  { id: 'enh_shellall',   name: 'シェルオール',       role: 'ENH', cost: 3, buff: ['shell'],   aoe: true, chainBonus: 0 },
  { id: 'enh_hasteall',   name: 'ヘイストオール',     role: 'ENH', cost: 4, buff: ['haste'],   aoe: true, chainBonus: 0 },
  { id: 'enh_barfire',    name: 'バーファイア',       role: 'ENH', cost: 2, chainBonus: 0 },
  // ENH unique
  { id: 'enh_bravery',    name: 'ブレイバリー',   role: 'ENH', cost: 3, buff: ['bravery'], aoe: true, chainBonus: 0, isUnique: true, uniqueOwner: 'en' },
  { id: 'enh_faithall',   name: 'フェイスオール', role: 'ENH', cost: 3, buff: ['faith'],   aoe: true, chainBonus: 0, isUnique: true, uniqueOwner: 'sac' },
  { id: 'enh_veil',       name: 'ヴェイル',       role: 'ENH', cost: 2, buff: ['veil'],    chainBonus: 0, isUnique: true, uniqueOwner: 'doc' },
  { id: 'enh_chainboost', name: 'チェーンブースト',role: 'ENH', cost: 3,                   chainBonus: 0, isUnique: true, uniqueOwner: 'ran' },

  // ---- JAM ----
  { id: 'jam_deprotect',  name: 'デプロテ',       role: 'JAM', cost: 2, debuff: ['deprot'],  chainBonus: 0 },
  { id: 'jam_deshell',    name: 'デシェル',       role: 'JAM', cost: 2, debuff: ['deshell'], chainBonus: 0 },
  { id: 'jam_slow',       name: 'スロウ',         role: 'JAM', cost: 3, debuff: ['slow'],    chainBonus: 0 },
  { id: 'jam_pain',       name: 'ペイン',         role: 'JAM', cost: 3, debuff: ['pain'],    chainBonus: 0 },
  // JAM general (non-unique)
  { id: 'jam_imperil_g',  name: 'インペリル',     role: 'JAM', cost: 3, debuff: ['imperil'], chainBonus: 0 },
  { id: 'jam_fog',        name: 'フォグ',         role: 'JAM', cost: 2, debuff: ['curse'],   chainBonus: 0 },
  { id: 'jam_poison',     name: 'ポイズン',       role: 'JAM', cost: 2, debuff: ['poison'],  chainBonus: 0 },
  { id: 'jam_instant',    name: 'インスタント',   role: 'JAM', cost: 1, power: 0,            chainBonus: 0 },
  // JAM unique
  { id: 'jam_imperil',    name: 'インペリル',     role: 'JAM', cost: 3, debuff: ['imperil'], chainBonus: 0, isUnique: true, uniqueOwner: 'daku' },
  { id: 'jam_curse',      name: 'カース',         role: 'JAM', cost: 2, debuff: ['curse'],   chainBonus: 0, isUnique: true, uniqueOwner: 'daku' },
  { id: 'jam_dispel',     name: 'ディスペル',     role: 'JAM', cost: 2,                      chainBonus: 0, isUnique: true, uniqueOwner: 'kaze' },
  { id: 'jam_gravity',    name: 'グラビデ',       role: 'JAM', cost: 3,                      chainBonus: 0, isUnique: true, uniqueOwner: 'ran' },
  { id: 'jam_stop',       name: 'ストップ',       role: 'JAM', cost: 4, debuff: ['stop'],    chainBonus: 0, isUnique: true, uniqueOwner: 'daku' },

  // ---- Ultimates (Item 14) ----
  { id: 'rai_ult', name: 'ライトニングスフィア', role: 'ATK', cost: 4, power: 8.0, hits: 3, element: 'thunder', chainBonus: 100, isUnique: true, isUltimate: true, uniqueOwner: 'rai' },
  { id: 'va_ult',  name: '聖なる癒し',           role: 'HLR', cost: 3, healPercent: 1.0, aoe: true, chainBonus: 0, isUnique: true, isUltimate: true, uniqueOwner: 'va' },
  { id: 'fa_ult',  name: '獣王の怒り',           role: 'ATK', cost: 5, power: 12.0, chainBonus: 80, isUnique: true, isUltimate: true, uniqueOwner: 'fa' },
];

export const AUTO_ABILITIES: AutoAbility[] = [
  { id: 'brave_heart',  name: 'ブレイブハート',  description: '物理ATK+15%',        trigger: { type: 'always' }, effect: { type: 'damage_boost', value: 0.15 } },
  { id: 'arcane_mind',  name: 'アルケインマインド',description: '魔法ATK+15%',      trigger: { type: 'always' }, effect: { type: 'damage_boost', value: 0.15 } },
  { id: 'iron_will',    name: 'アイアンウィル',  description: 'HP+20%',             trigger: { type: 'always' }, effect: { type: 'stat_boost', stat: 'hp', value: 0.20, isPercent: true } },
  { id: 'speed_up',     name: 'スピードアップ',  description: 'ATB充填速度+20%',    trigger: { type: 'always' }, effect: { type: 'atb_speed', value: 0.20 } },
  { id: 'chain_master', name: 'ハイテンション',description: 'チェーン増加量+25%', trigger: { type: 'always' }, effect: { type: 'chain_boost', value: 0.25 } },
  { id: 'break_hunter', name: 'ブレイクハンター',description: 'ブレイク中ダメージ+30%', trigger: { type: 'break_active' }, effect: { type: 'damage_boost', value: 0.30 } },
  { id: 'break_extend', name: 'ブレイク延長',    description: 'ブレイク時間+5秒',   trigger: { type: 'break_active' }, effect: { type: 'break_extend', value: 5 } },
  { id: 'battle_cry',   name: 'ハイボルテージ',    description: 'HP>70%時 ATK+20%',  trigger: { type: 'hp_above', threshold: 0.70 }, effect: { type: 'damage_boost', value: 0.20 } },
  { id: 'last_stand',   name: 'ラストスタンド',  description: 'HP<30%時 全ダメージ+40%', trigger: { type: 'hp_below', threshold: 0.30 }, effect: { type: 'damage_boost', value: 0.40 } },
  { id: 'phoenix_will', name: 'フェニックスウィル', description: 'HP<30%時 ATB速度+30%', trigger: { type: 'hp_below', threshold: 0.30 }, effect: { type: 'atb_speed', value: 0.30 } },
  { id: 'guardian',     name: 'ガーディアン',    description: 'DEFロール時 被ダメ-20%', trigger: { type: 'role_active', role: 'DEF' }, effect: { type: 'stat_boost', stat: 'def', value: 0.20, isPercent: true } },
  { id: 'provoke_plus', name: '挑発強化',        description: 'ヘイト生成量+50%',   trigger: { type: 'role_active', role: 'DEF' }, effect: { type: 'damage_boost', value: 0.50 } },
  { id: 'medic_plus',   name: 'メディックプラス',description: 'HLRロール時 回復量+25%', trigger: { type: 'role_active', role: 'HLR' }, effect: { type: 'heal_boost', value: 0.25 } },
  { id: 'auto_regen',   name: 'オートリジェネ',  description: '毎秒HP+0.5%',        trigger: { type: 'always' }, effect: { type: 'auto_regen', value: 0.005 } },
  { id: 'counter',      name: 'カウンター',      description: '被攻撃時30%で反撃',  trigger: { type: 'on_damaged' }, effect: { type: 'counter', ability: 'atk_fight', chance: 0.30 } },
  { id: 'magic_save',   name: 'マジックセーブ',  description: 'BLAロール時 魔法コスト-1', trigger: { type: 'role_active', role: 'BLA' }, effect: { type: 'cost_reduce', role: 'BLA', value: 1 } },
  { id: 'enhance_ex',   name: 'エンハンスEX',    description: 'ENHロール時 バフ効果+50%', trigger: { type: 'role_active', role: 'ENH' }, effect: { type: 'atb_speed', value: 0.10 } },
  { id: 'jam_boost',    name: 'ジャムブースト',  description: 'JAMロール時 デバフ成功率+30%', trigger: { type: 'role_active', role: 'JAM' }, effect: { type: 'damage_boost', value: 0.10 } },
  { id: 'combo_boost',  name: 'コンボブースト',  description: '多段ヒット威力+20%', trigger: { type: 'always' }, effect: { type: 'damage_boost', value: 0.20 } },
  { id: 'elemental_amp',name: '属性増幅',        description: '弱点ヒット時 チェーン増加×1.8', trigger: { type: 'on_hit' }, effect: { type: 'chain_boost', value: 0.80 } },
  { id: 'sacrifice',    name: '自己犠牲',        description: '味方戦闘不能時 ATK+50%', trigger: { type: 'ally_dead' }, effect: { type: 'damage_boost', value: 0.50 } },
  { id: 'solidarity',   name: '連帯感',          description: '味方HP<50%の人数×ATK+8%', trigger: { type: 'always' }, effect: { type: 'damage_boost', value: 0.08 } },
  { id: 'revive_once',  name: '不死鳥の加護',   description: '戦闘不能時HP30%で自動復活', trigger: { type: 'on_damaged' }, effect: { type: 'revive_once', hp: 0.30 } },
  { id: 'fire_resist',  name: '炎耐性',          description: '火属性被ダメ-30%',    trigger: { type: 'always' }, effect: { type: 'element_resist', element: 'fire', value: 0.30 } },
  { id: 'ice_resist',   name: '氷耐性',          description: '氷属性被ダメ-30%',    trigger: { type: 'always' }, effect: { type: 'element_resist', element: 'ice', value: 0.30 } },
  { id: 'thunder_resist',name: '雷耐性',         description: '雷属性被ダメ-30%',    trigger: { type: 'always' }, effect: { type: 'element_resist', element: 'thunder', value: 0.30 } },
];

export const ABILITIES_BY_ROLE: Record<string, CommandAbility[]> = {};
for (const ab of COMMAND_ABILITIES) {
  if (!ABILITIES_BY_ROLE[ab.role]) ABILITIES_BY_ROLE[ab.role] = [];
  ABILITIES_BY_ROLE[ab.role].push(ab);
}

export function getAbilityById(id: string): CommandAbility | undefined {
  return COMMAND_ABILITIES.find(a => a.id === id);
}

export function getAutoById(id: string): AutoAbility | undefined {
  return AUTO_ABILITIES.find(a => a.id === id);
}

export function getAbilitiesForRole(role: string, charId?: string): CommandAbility[] {
  return COMMAND_ABILITIES.filter(ab =>
    ab.role === role && (!ab.isUnique || ab.uniqueOwner === charId)
  );
}
