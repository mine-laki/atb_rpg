// Core type definitions for EmojiParadigm

export type RoleId = 'ATK' | 'BLA' | 'DEF' | 'HLR' | 'ENH' | 'JAM';
export type Element = 'fire' | 'ice' | 'thunder' | 'wind' | 'water' | 'earth' | 'holy' | 'dark' | 'none';
export type StatId = 'hp' | 'str' | 'mag' | 'def' | 'mdef' | 'spd';
export type BuffId = 'prot' | 'shell' | 'haste' | 'faith' | 'bravery' | 'guard' | 'regen' | 'veil' | 'hguard' | 'barfire' | 'barice' | 'barthunder' | 'barwind';
export type DebuffId = 'deprot' | 'deshell' | 'slow' | 'pain' | 'imperil' | 'curse' | 'stop' | 'poison';

// ---- ATB ----

export interface ATBState {
  current: number;   // 0..maxSegments (float)
  max: number;       // segment count (3-6)
  speedMultiplier: number;  // 1.0 base, modified by haste/slow
}

// ---- Status Effects ----

export interface StatusEffect {
  id: BuffId | DebuffId;
  type: 'buff' | 'debuff';
  duration: number;       // seconds remaining
  value: number;          // effect magnitude
  sourceId?: string;
}

// ---- Auto Ability ----

export type AutoTrigger =
  | { type: 'always' }
  | { type: 'hp_below'; threshold: number }
  | { type: 'hp_above'; threshold: number }
  | { type: 'role_active'; role: RoleId }
  | { type: 'break_active' }
  | { type: 'ally_dead' }
  | { type: 'on_hit' }
  | { type: 'on_damaged' };

export type AutoEffect =
  | { type: 'stat_boost'; stat: StatId; value: number; isPercent: boolean }
  | { type: 'atb_speed'; value: number }
  | { type: 'chain_boost'; value: number }
  | { type: 'damage_boost'; value: number }
  | { type: 'heal_boost'; value: number }
  | { type: 'cost_reduce'; role: RoleId; value: number }
  | { type: 'counter'; ability: string; chance: number }
  | { type: 'auto_regen'; value: number }
  | { type: 'break_extend'; value: number }
  | { type: 'revive_once'; hp: number }
  | { type: 'element_resist'; element: Element; value: number };

export interface AutoAbility {
  id: string;
  name: string;
  description: string;
  trigger: AutoTrigger;
  effect: AutoEffect;
}

// ---- Command Ability ----

export interface CommandAbility {
  id: string;
  name: string;
  role: RoleId;
  cost: number;
  power?: number;
  hits?: number;
  element?: Element;
  healValue?: number;
  healPercent?: number;
  healMissingPercent?: number;  // heal (% of missing HP)
  aoe?: boolean;
  buff?: BuffId[];
  debuff?: DebuffId[];
  chainBonus: number;
  isUnique?: boolean;
  uniqueOwner?: string;
  isUltimate?: boolean;
  allowedFor?: string[];       // char IDs allowed to use this ability
  isAdaptive?: boolean;        // uses max(str, mag) for damage
  usesStr?: boolean;           // uses STR even when element is set (blow spells)
  dispelDebuff?: boolean;      // removes debuffs from target
}

// ---- Character ----

export interface CharacterData {
  id: string;
  emoji: string;
  name: string;
  roles: RoleId[];
  baseHP: number;
  baseSTR: number;
  baseMAG: number;
  atbMax: number;       // 3-6 segments
  autoAbilities: string[];   // AutoAbility IDs
  uniqueAbilities: string[]; // CommandAbility IDs (unique to this char)
  growthType: 'attacker' | 'magic' | 'tank' | 'healer' | 'allround';
  weaponAffinity?: string;
  attackType: 'physical' | 'magical' | 'mixed';
  physDef: number;   // 0-100, default 0
  magDef: number;    // 0-100, default 0
  description?: string;  // キャラクター説明文
  playstyle?: string;    // 得意戦法・運用ヒント
}

export interface CharacterInstance {
  id: string;
  dataId: string;
  level: number;
  exp: number;
  currentHP: number;
  maxHP: number;
  str: number;
  mag: number;
  currentRole: RoleId;
  atb: ATBState;
  statusEffects: StatusEffect[];
  equipment: {
    weapon: EquipmentInstance | null;
    accessory1: EquipmentInstance | null;
    accessory2: EquipmentInstance | null;
    accessory3: EquipmentInstance | null;
    accessory4: EquipmentInstance | null;
  };
  roleLevels: Partial<Record<RoleId, number>>;
  unlockedSkillNodes: string[];
  autoAbilityIds: string[];     // innate + skill-board-unlocked auto abilities
  isAlive: boolean;
  reviveUsed: boolean;  // for revive_once auto ability
  comboCount?: number;  // consecutive action bonus
  ultimateUsed?: boolean; // once-per-battle ultimate flag
  lastActionName?: string;   // 最後に使ったアビリティ名
  lastActionCount?: number;  // 連続使用回数
}

// ---- Enemy ----

export interface EnemyData {
  id: string;
  emoji: string;
  name: string;
  maxHP: number;
  str: number;
  mag: number;
  weaknesses: Element[];
  resistances: Element[];
  physResist?: number;      // e.g. 0.5 = 50% physical resist
  magResist?: number;
  physDef?: number;         // physical defense reduction %, 0-100
  magDef?: number;          // magic defense reduction %, 0-100
  gilReward: number;
  debuffSuccessRate?: number;  // 0-100 (%) デバフが通る確率。未指定=100%。0=完全耐性(AIが使用しない)
  chainBuildRate?: number;     // chain build speed multiplier (default 1.0)
  chainResistMax?: number;     // chain gauge cap = break trigger (default 300)
  dropTable: DropTable;
  actions: EnemyAction[];
  isBoss?: boolean;
  phases?: BossPhase[];
}

export interface EnemyAction {
  id: string;
  name: string;
  power: number;
  element?: Element;
  aoe?: boolean;
  debuff?: DebuffId;        // applies debuff to target party member(s)
  selfBuff?: BuffId[];      // applies buff to self (the enemy)
  powerPercent?: number;    // deal this % of target's CURRENT HP as damage (ignores power)
  cooldown: number;         // seconds
  postGlobalCooldown?: number;  // after this action, set ALL action cooldowns to this value
  condition?: string;       // e.g. 'phase2'
}

export interface BossPhase {
  phaseId: string;
  triggerHPPercent: number;
  buffSelf?: BuffId[];
  newActions?: string[];  // EnemyAction IDs to unlock
}

// ---- Enemy Instance ----

export interface EnemyInstance {
  id: string;
  dataId: string;
  currentHP: number;
  maxHP: number;
  chainGauge: number;      // 0-999 percent
  isBreaking: boolean;
  breakTimer: number;
  chainDecayTimer: number;
  statusEffects: StatusEffect[];
  currentPhase: number;
  actionCooldowns: Record<string, number>;
  lastHitTime: number;
  statScale?: number;        // NG+ stat multiplier (str/mag scaling)
  chainBuildRate?: number;   // per-enemy chain build multiplier
  chainResistMax?: number;   // per-enemy chain gauge cap
}

// ---- Equipment ----

export interface EquipmentData {
  id: string;
  name: string;
  emoji: string;
  type: 'weapon' | 'accessory';
  weaponType?: 'sword' | 'staff' | 'bow' | 'shield' | 'holy' | 'instrument' | 'cursed';
  preferredRole?: RoleId;
  baseStats: Partial<Record<StatId, number>>;
  effects: EquipmentEffect[];
  unlockStage: number;
  shopPrice: number;       // 0 = not for sale
}

export interface EquipmentEffect {
  type: 'atb_expand' | 'magic_cost_reduce' | 'atb_speed' | 'heal_boost' |
        'buff_extend' | 'debuff_rate' | 'chain_boost' | 'damage_boost' |
        'auto_regen' | 'revive_once' | 'element_resist' | 'auto_buff';
  value: number;
  element?: Element;
  buffId?: BuffId;  // auto_buff 用
}

export interface EquipmentInstance {
  instanceId: string;
  itemId: string;
  enhanceLevel: number;   // 0-10
}

// ---- Drop System ----

export interface DropTable {
  common: { itemId: string; rate: number; dropType?: 'material' | 'equipment' | 'fragment' }[];
  uncommon: { itemId: string; rate: number; dropType?: 'material' | 'equipment' | 'fragment' }[];
  rare: { itemId: string; rate: number; dropType?: 'material' | 'equipment' | 'fragment' }[];  // break-only
}

export interface DropItem {
  type: 'equipment' | 'material' | 'fragment' | 'valuable';
  itemId: string;
  quantity: number;
}

// ---- Paradigm ----

export interface ParadigmData {
  slot: number;        // 0-5
  name: string;
  roles: [RoleId, RoleId, RoleId];
}

// ---- Inventory / Materials ----

export interface MaterialData {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface Inventory {
  gil: number;
  equipments: EquipmentInstance[];
  materials: { itemId: string; quantity: number }[];
  battleItems: { itemId: string; quantity: number }[];
}

// ---- Shop ----

export interface ShopItem {
  itemId: string;
  price: number;
  stock: number | 'unlimited';
  unlockStage: number;
}

// ---- Character Enhancement ----

export interface CharacterEnhancement {
  characterId: string;
  level: number;
  exp: number;
  roleLevels: Partial<Record<RoleId, number>>;
  unlockedSkillNodes: string[];
}

// ---- Skill Board ----

export type SkillEffect =
  | { type: 'atb_expand' }
  | { type: 'unlock_ability'; abilityId: string }
  | { type: 'unlock_auto'; autoId: string }
  | { type: 'stat_boost'; stat: string; value: number }
  | { type: 'role_cap_up'; role: RoleId; amount: number };

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: { gil: number; materials: { itemId: string; quantity: number }[] };
  requires: string[];
  effect: SkillEffect;
}

// ---- Battle State ----

export type BattlePhase = 'idle' | 'battle' | 'victory' | 'defeat' | 'break';

export interface BattleState {
  phase: BattlePhase;
  party: CharacterInstance[];
  enemies: EnemyInstance[];
  paradigms: ParadigmData[];
  activeParadigm: number;
  actionLog: ActionLogEntry[];
  elapsed: number;     // seconds
  waveIndex: number;
  breakCount: number;  // for reward calc
  battleItems: { itemId: string; quantity: number }[];
}

export interface ActionLogEntry {
  id: string;
  timestamp: number;
  actorEmoji: string;
  actorName: string;
  targetName: string;
  abilityName: string;
  value: number;           // damage or heal amount
  isCrit?: boolean;
  isBreak?: boolean;
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'status';
}

// ---- Battle Reward ----

export interface BattleReward {
  gil: number;
  bonusGil: number;
  drops: DropItem[];
}

// ---- Save Data ----

export type EquipmentSlots = {
  weapon: string | null;
  accessory1: string | null;
  accessory2: string | null;
  accessory3: string | null;
  accessory4: string | null;
};

export interface CharacterSaveData {
  id: string;
  level: number;
  exp: number;
  equipment: EquipmentSlots;
  unlockedRoles: RoleId[];
  roleLevels: Partial<Record<RoleId, number>>;
  unlockedSkillNodes: string[];
  equipPresets?: (EquipmentSlots | null)[];  // 3スロット装備プリセット
}

export interface ProgressData {
  currentStage: number;
  clearedStages: number[];
  inventory: Inventory;
  playTime: number;
  unlockedShopStage: number;
  unlockedCharacters: string[];
  selectedStage?: number;
  encounteredEnemies: string[];
}

export interface PlayerSaveData {
  party: [string, string, string];  // character IDs
  roster: CharacterSaveData[];
}

export interface SaveData {
  version: string;
  savedAt: string;
  player: PlayerSaveData;
  progress: ProgressData;
  paradigms: ParadigmData[];
  newGamePlus?: number;
}

// ---- Game Screen ----

export type GameScreen = 'title' | 'home' | 'setup' | 'battle' | 'result' | 'enhance' | 'shop' | 'enemyReport' | 'tutorial';
