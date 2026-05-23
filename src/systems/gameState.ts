import type {
  CharacterInstance, EnemyInstance, SaveData,
  CharacterSaveData, ProgressData, EquipmentInstance,
} from '../types';
import { CHARACTERS, INITIAL_PARTY, INITIAL_UNLOCKED, getStatsAtLevel } from '../data/characters';
import { ENEMIES } from '../data/enemies';

export function createCharacterInstance(
  charId: string,
  save?: CharacterSaveData,
): CharacterInstance {
  const data = CHARACTERS.find(c => c.id === charId);
  if (!data) throw new Error(`Unknown character: ${charId}`);

  const level = save?.level ?? 1;
  const stats = getStatsAtLevel(data, level);

  const eq = {
    weapon:     null as EquipmentInstance | null,
    accessory1: null as EquipmentInstance | null,
    accessory2: null as EquipmentInstance | null,
  };

  const bonusATB = 0;

  return {
    id: `${charId}_${Date.now()}_${Math.random()}`,
    dataId: charId,
    level,
    exp: save?.exp ?? 0,
    currentHP: stats.hp,
    maxHP: stats.hp,
    str: stats.str,
    mag: stats.mag,
    currentRole: data.roles[0],
    atb: { current: 0, max: data.atbMax + bonusATB, speedMultiplier: 1.0 },
    statusEffects: [],
    equipment: eq,
    roleLevels: save?.roleLevels ?? {},
    unlockedSkillNodes: save?.unlockedSkillNodes ?? [],
    isAlive: true,
    reviveUsed: false,
  };
}

export function createEnemyInstance(enemyId: string, idx: number): EnemyInstance {
  const data = ENEMIES.find((e) => e.id === enemyId);
  if (!data) throw new Error(`Unknown enemy: ${enemyId}`);

  return {
    id: `${enemyId}_${idx}`,
    dataId: enemyId,
    currentHP: data.maxHP,
    maxHP: data.maxHP,
    chainGauge: 0,
    isBreaking: false,
    breakTimer: 0,
    chainDecayTimer: 0,
    statusEffects: [],
    currentPhase: 0,
    actionCooldowns: {},
    lastHitTime: 0,
  };
}

export function buildInitialSaveData(): SaveData {
  const rosterSaves: CharacterSaveData[] = CHARACTERS.map(c => ({
    id: c.id,
    level: 1,
    exp: 0,
    equipment: { weapon: null, accessory1: null, accessory2: null },
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
    },
    playTime: 0,
    unlockedShopStage: 0,
    unlockedCharacters: INITIAL_UNLOCKED,
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
      { slot: 0, name: '攻撃', roles: ['ATK', 'BLA', 'HLR'] },
      { slot: 1, name: '魔法', roles: ['BLA', 'BLA', 'HLR'] },
      { slot: 2, name: '防衛', roles: ['DEF', 'ENH', 'HLR'] },
      { slot: 3, name: 'ブレイク', roles: ['ATK', 'ATK', 'BLA'] },
      { slot: 4, name: 'バフ', roles: ['ENH', 'ENH', 'HLR'] },
      { slot: 5, name: 'デバフ', roles: ['JAM', 'ATK', 'HLR'] },
    ],
  };
}
