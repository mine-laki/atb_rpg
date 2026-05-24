import type {
  CharacterInstance, EnemyInstance, CommandAbility, ActionLogEntry, BattleState,
} from '../types';
import { calcChainBonus, isWeakness, applyChainHit } from './chain';
import { getEnemyById } from '../data/enemies';
import { getEquipmentById, ENHANCE_MULTIPLIERS } from '../data/equipment';

/** Sum a specific effect type across all equipped items. */
function sumEquipEffect(char: CharacterInstance, effectType: string): number {
  let total = 0;
  for (const inst of [char.equipment.weapon, char.equipment.accessory1, char.equipment.accessory2]) {
    if (!inst) continue;
    const d = getEquipmentById(inst.itemId);
    if (!d) continue;
    const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1.0;
    for (const eff of d.effects) {
      if (eff.type === effectType) total += eff.value * mult;
    }
  }
  return total;
}

let logIdCounter = 0;

function makeLogId(): string {
  return `log_${++logIdCounter}`;
}

function getRoleLevelBonus(char: CharacterInstance): number {
  const roleLv = (char.roleLevels?.[char.currentRole] ?? 1);
  switch (char.currentRole) {
    case 'ATK': return roleLv * 0.10;  // +10% physical damage per level (up to +50% at lv 5)
    case 'BLA': return roleLv * 0.10;  // +10% magic damage per level
    default:    return 0;
  }
}

/** Returns +0.15 if any other alive party member has ATK role lv >= 3 and this char is ATK */
export function getAllyATKBonus(char: CharacterInstance, party: CharacterInstance[]): number {
  if (char.currentRole !== 'ATK') return 0;
  const hasHighLvATKAlly = party.some(p =>
    p.id !== char.id &&
    p.isAlive &&
    p.currentRole === 'ATK' &&
    (p.roleLevels?.['ATK'] ?? 1) >= 3
  );
  return hasHighLvATKAlly ? 0.15 : 0;
}

function calcDamageBoosts(char: CharacterInstance, ability: CommandAbility, enemy: EnemyInstance, party?: CharacterInstance[]): number {
  let mult = 1.0;

  // Role level bonus (ATK = physical, BLA = magic/elemental)
  const roleLvBonus = getRoleLevelBonus(char);
  if (ability.power !== undefined) {
    if (!ability.element && char.currentRole === 'ATK') mult += roleLvBonus;
    if ( ability.element && char.currentRole === 'BLA') mult += roleLvBonus;
  }

  // Ally ATK bonus
  if (party) {
    mult += getAllyATKBonus(char, party);
  }

  // Combo count bonus (+5% per chain, max +25% at 5 chains)
  if (char.comboCount && char.comboCount > 0) {
    mult += char.comboCount * 0.05;
  }

  // Equipment damage_boost effect
  mult += sumEquipEffect(char, 'damage_boost');

  for (const eff of char.statusEffects) {
    if (eff.id === 'bravery' && ability.power && !ability.healValue) mult += 0.30;
    if (eff.id === 'faith'   && ability.element)                     mult += 0.30;
  }

  for (const eff of enemy.statusEffects) {
    // Debuffs on enemy increase player damage
    if (eff.id === 'deprot'  && !ability.element) mult += 0.30;
    if (eff.id === 'deshell' && ability.element)  mult += 0.30;
    if (eff.id === 'imperil')                     mult += 0.30;
    if (eff.id === 'pain')                        mult += 0.20;
    // Buffs on enemy reduce player damage
    if (eff.id === 'prot'    && !ability.element) mult *= 0.7;
    if (eff.id === 'shell'   && ability.element)  mult *= 0.7;
  }

  if (enemy.isBreaking) {
    mult *= calcChainBonus(enemy.chainGauge);
  }

  return mult;
}

export function executeAttack(
  char: CharacterInstance,
  ability: CommandAbility,
  target: EnemyInstance,
  _state: BattleState,
  timestamp: number,
  party?: CharacterInstance[],
): { newTarget: EnemyInstance; logs: ActionLogEntry[] } {
  const logs: ActionLogEntry[] = [];
  const enemyData = getEnemyById(target.dataId);

  const hits = ability.hits ?? 1;
  let newTarget = target;

  for (let h = 0; h < hits; h++) {
    const weakness = isWeakness(enemyData?.weaknesses ?? [], ability.element);
    // Legacy physResist check (kept for backward compat)
    const physResistMult = !ability.element && enemyData?.physResist ? (1 - (enemyData.physResist ?? 0)) : 1;
    // New physDef/magDef system
    const physDefMult = !ability.element ? (1 - (enemyData?.physDef ?? 0) / 100) : 1;
    const magDefMult  =  ability.element ? (1 - (enemyData?.magDef  ?? 0) / 100) : 1;
    const weakMult = weakness ? 1.5 : 1.0;

    // isAdaptive: use max(str, mag); usesStr: force STR even with element; else: element→mag, phys→str
    const baseStat = ability.isAdaptive
      ? Math.max(char.str, char.mag)
      : (ability.usesStr ? char.str : (ability.element ? char.mag : char.str));
    const rawDamage = baseStat * (ability.power ?? 1.0) * physResistMult * physDefMult * magDefMult * weakMult;
    const boostMult = calcDamageBoosts(char, ability, newTarget, party);
    const damage = Math.floor(rawDamage * boostMult * (0.9 + Math.random() * 0.2));

    newTarget = {
      ...newTarget,
      currentHP: Math.max(0, newTarget.currentHP - damage),
    };

    newTarget = applyChainHit(newTarget, ability, weakness, char, timestamp + h * 0.1);

    logs.push({
      id: makeLogId(),
      timestamp: timestamp + h * 0.1,
      actorEmoji: '',
      actorName: '',
      targetName: newTarget.dataId,
      abilityName: ability.name,
      value: damage,
      isCrit: false,
      isBreak: newTarget.isBreaking && !target.isBreaking,
      type: 'damage',
    });
  }

  return { newTarget, logs };
}

export function executeHeal(
  char: CharacterInstance,
  ability: CommandAbility,
  targets: CharacterInstance[],
): { newTargets: CharacterInstance[]; logs: ActionLogEntry[] } {
  const logs: ActionLogEntry[] = [];
  let healMult = 1.0;

  // HLR role level bonus: +8% heal per level
  if (char.currentRole === 'HLR') {
    healMult += (char.roleLevels?.['HLR'] ?? 1) * 0.08;
  }

  // Equipment heal_boost effect
  healMult += sumEquipEffect(char, 'heal_boost');

  for (const eff of char.statusEffects) {
    if (eff.id === 'faith') healMult += 0.30;
  }

  const newTargets = targets.map(t => {
    let healAmount = 0;
    if (ability.healValue) {
      healAmount = Math.floor(ability.healValue * healMult);
    } else if (ability.healMissingPercent) {
      // ケアルア: heal proportional to missing HP
      healAmount = Math.floor((t.maxHP - t.currentHP) * ability.healMissingPercent * healMult);
    } else if (ability.healPercent) {
      healAmount = Math.floor(t.maxHP * ability.healPercent * healMult);
    }

    const newHP = Math.min(t.maxHP, t.currentHP + healAmount);
    logs.push({
      id: makeLogId(),
      timestamp: Date.now() / 1000,
      actorEmoji: '',
      actorName: '',
      targetName: t.id,
      abilityName: ability.name,
      value: healAmount,
      type: 'heal',
    });

    return { ...t, currentHP: newHP };
  });

  return { newTargets, logs };
}

export function executeRevive(
  _char: CharacterInstance,
  ability: CommandAbility,
  target: CharacterInstance,
): { newTarget: CharacterInstance; log: ActionLogEntry } {
  const reviveHP = Math.floor(target.maxHP * (ability.healPercent ?? 0.3));
  const newTarget = { ...target, currentHP: reviveHP, isAlive: true };
  return {
    newTarget,
    log: {
      id: makeLogId(),
      timestamp: Date.now() / 1000,
      actorEmoji: '',
      actorName: '',
      targetName: target.id,
      abilityName: ability.name,
      value: reviveHP,
      type: 'heal',
    },
  };
}

export function calcEnemyDamage(
  enemyData: { str: number; mag: number },
  power: number,
  target: CharacterInstance,
  element?: import('../types').Element,
): number {
  const raw = enemyData.str * power;
  let mult = 1.0;

  // DEF role level bonus: +2% damage reduction per level
  if (target.currentRole === 'DEF') {
    mult -= (target.roleLevels?.['DEF'] ?? 1) * 0.02;
  }

  for (const eff of target.statusEffects) {
    if (eff.id === 'prot')   mult *= 0.7;
    if (eff.id === 'shell')  mult *= 0.7;
    if (eff.id === 'guard')  mult *= 0.5;
    if (eff.id === 'hguard') mult *= 0.1;   // ヘビーガード: 90% damage reduction
    // Bar elemental resistance: 50% reduction for matching element
    if (element === 'fire'    && eff.id === 'barfire')    mult *= 0.5;
    if (element === 'ice'     && eff.id === 'barice')     mult *= 0.5;
    if (element === 'thunder' && eff.id === 'barthunder') mult *= 0.5;
    if (element === 'wind'    && eff.id === 'barwind')    mult *= 0.5;
  }

  return Math.floor(raw * Math.max(0.05, mult) * (0.9 + Math.random() * 0.2));
}
