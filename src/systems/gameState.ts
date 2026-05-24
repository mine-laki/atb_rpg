import type {
  CharacterInstance, EnemyInstance, SaveData,
  CharacterSaveData, ProgressData, EquipmentInstance, Inventory,
} from '../types';
import { CHARACTERS, INITIAL_PARTY, INITIAL_UNLOCKED, getStatsAtLevel } from '../data/characters';
import { ENEMIES } from '../data/enemies';
import { getEquipmentById, ENHANCE_MULTIPLIERS } from '../data/equipment';
import { calcSkillBonuses } from '../data/skillBoard';

export function createCharacterInstance(
  charId: string,
  save?: CharacterSaveData,
  inventory?: Inventory,
): CharacterInstance {
  const data = CHARACTERS.find(c => c.id === charId);
  if (!data) throw new Error(`Unknown character: ${charId}`);

  const level = save?.level ?? 1;
  const stats = getStatsAtLevel(data, level);

  // Resolve EquipmentInstances from save instance IDs
  const resolveInst = (id: string | null | undefined): EquipmentInstance | null => {
    if (!id || !inventory) return null;
    return inventory.equipments.find(e => e.instanceId === id) ?? null;
  };

  const weaponInst    = resolveInst(save?.equipment?.weapon);
  const accessory1Inst = resolveInst(save?.equipment?.accessory1);
  const accessory2Inst = resolveInst(save?.equipment?.accessory2);

  const eq = {
    weapon:     weaponInst,
    accessory1: accessory1Inst,
    accessory2: accessory2Inst,
    accessory3: resolveInst(save?.equipment?.accessory3),
    accessory4: resolveInst(save?.equipment?.accessory4),
  };

  // Apply equipment stat bonuses
  let bonusHP = 0, bonusSTR = 0, bonusMAG = 0;
  let bonusATB = 0, bonusATBSpeed = 0;

  for (const inst of [weaponInst, accessory1Inst, accessory2Inst, eq.accessory3, eq.accessory4]) {
    if (!inst) continue;
    const eData = getEquipmentById(inst.itemId);
    if (!eData) continue;
    const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1.0;
    bonusHP  += Math.floor((eData.baseStats.hp  ?? 0) * mult);
    bonusSTR += Math.floor((eData.baseStats.str ?? 0) * mult);
    bonusMAG += Math.floor((eData.baseStats.mag ?? 0) * mult);
    for (const eff of eData.effects) {
      if (eff.type === 'atb_expand') bonusATB += eff.value;
      if (eff.type === 'atb_speed')  bonusATBSpeed += eff.value;
    }
  }

  // Skill board bonuses
  const skillBonuses = calcSkillBonuses(data.growthType, save?.unlockedSkillNodes ?? []);
  const totalHP  = stats.hp  + bonusHP  + skillBonuses.hp;
  const totalSTR = stats.str + bonusSTR + skillBonuses.str;
  const totalMAG = stats.mag + bonusMAG + skillBonuses.mag;
  const levelATBBonus = (level >= 15 ? 1 : 0) + (level >= 30 ? 1 : 0);
  const totalATB = data.atbMax + bonusATB + skillBonuses.atbExtra + levelATBBonus;

  return {
    id: `${charId}_${Date.now()}_${Math.random()}`,
    dataId: charId,
    level,
    exp: save?.exp ?? 0,
    currentHP: totalHP,
    maxHP: totalHP,
    str: totalSTR,
    mag: totalMAG,
    currentRole: data.roles[0],
    atb: { current: 0, max: totalATB, speedMultiplier: 1.0 + bonusATBSpeed },
    statusEffects: (() => {
      // auto_buff 効果を持つ装備から戦闘開始バフを付与
      const startBuffs: import('../types').StatusEffect[] = [];
      for (const inst of [weaponInst, accessory1Inst, accessory2Inst, eq.accessory3, eq.accessory4]) {
        if (!inst) continue;
        const eData = getEquipmentById(inst.itemId);
        if (!eData) continue;
        for (const eff of eData.effects) {
          if (eff.type === 'auto_buff' && eff.buffId) {
            startBuffs.push({ id: eff.buffId, type: 'buff', duration: eff.value, value: 1 });
          }
        }
      }
      return startBuffs;
    })(),
    equipment: eq,
    roleLevels: save?.roleLevels ?? {},
    unlockedSkillNodes: save?.unlockedSkillNodes ?? [],
    isAlive: true,
    reviveUsed: false,
    comboCount: 0,
    ultimateUsed: false,
  };
}

export function createEnemyInstance(enemyId: string, idx: number, ngPlus: number = 0): EnemyInstance {
  const data = ENEMIES.find((e) => e.id === enemyId);
  if (!data) throw new Error(`Unknown enemy: ${enemyId}`);

  const hpScale  = 1 + 1.0 * ngPlus;
  const strScale = 1 + 0.6 * ngPlus;
  const scaledHP = Math.floor(data.maxHP * hpScale);

  return {
    id: `${enemyId}_${idx}`,
    dataId: enemyId,
    currentHP: scaledHP,
    maxHP: scaledHP,
    chainGauge: 0,
    isBreaking: false,
    breakTimer: 0,
    chainDecayTimer: 0,
    statusEffects: [],
    currentPhase: 0,
    actionCooldowns: {},
    lastHitTime: 0,
    statScale: ngPlus > 0 ? strScale : undefined,
    chainBuildRate: data.chainBuildRate,
    chainResistMax: data.chainResistMax,
  };
}

export function buildInitialSaveData(): SaveData {
  const rosterSaves: CharacterSaveData[] = CHARACTERS.map(c => ({
    id: c.id,
    level: 1,
    exp: 0,
    equipment: { weapon: null, accessory1: null, accessory2: null, accessory3: null, accessory4: null },
    unlockedRoles: [c.roles[0]],
    roleLevels: {},
    unlockedSkillNodes: [],
  }));

  const progress: ProgressData = {
    currentStage: 1,
    clearedStages: [],
    inventory: {
      gil: 500,
      equipments: [],
      materials: [],
      battleItems: [{ itemId: 'potion', quantity: 3 }],
    },
    playTime: 0,
    unlockedShopStage: 0,
    unlockedCharacters: INITIAL_UNLOCKED,
    encounteredEnemies: [],
  };

  return {
    version: '1.0.0',
    savedAt: new Date().toISOString(),
    player: {
      party: INITIAL_PARTY,
      roster: rosterSaves,
    },
    progress,
    paradigms: [
      { slot: 0, name: 'ラッシュアサルト',  roles: ['BLA', 'BLA', 'ATK'] },
      { slot: 1, name: '勇戦の凱歌',    roles: ['BLA', 'HLR', 'ATK'] },
      { slot: 2, name: 'デルタアタック',      roles: ['ATK', 'BLA', 'DEF'] },
      { slot: 3, name: '撃滅の戦鬼',  roles: ['BLA', 'JAM', 'ATK'] },
      { slot: 4, name: '勝利への決意',  roles: ['ATK', 'HLR', 'DEF'] },
      { slot: 5, name: 'フューリアス',  roles: ['ATK', 'BLA', 'ATK'] },
    ],
  };
}
