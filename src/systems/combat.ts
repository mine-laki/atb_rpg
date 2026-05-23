import type {
  CharacterInstance, EnemyInstance, CommandAbility, ActionLogEntry, BattleState,
} from '../types';
import { calcChainBonus, isWeakness, applyChainHit } from './chain';
import { getEnemyById } from '../data/enemies';

let logIdCounter = 0;

function makeLogId(): string {
  return `log_${++logIdCounter}`;
}

function calcDamageBoosts(char: CharacterInstance, ability: CommandAbility, enemy: EnemyInstance): number {
  let mult = 1.0;

  for (const eff of char.statusEffects) {
    if (eff.id === 'bravery' && ability.power && !ability.healValue) mult += 0.30;
    if (eff.id === 'faith'   && ability.element)                     mult += 0.30;
  }

  for (const eff of enemy.statusEffects) {
    if (eff.id === 'deprot'  && !ability.element) mult += 0.30;
    if (eff.id === 'deshell' && ability.element)  mult += 0.30;
    if (eff.id === 'imperil')                     mult += 0.30;
    if (eff.id === 'pain')                        mult += 0.20;
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
): { newTarget: EnemyInstance; logs: ActionLogEntry[] } {
  const logs: ActionLogEntry[] = [];
  const enemyData = getEnemyById(target.dataId);

  const hits = ability.hits ?? 1;
  let newTarget = target;

  for (let h = 0; h < hits; h++) {
    const weakness = isWeakness(enemyData?.weaknesses ?? [], ability.element);
    const physMult = !ability.element && enemyData?.physResist ? (1 - (enemyData.physResist ?? 0)) : 1;
    const weakMult = weakness ? 1.5 : 1.0;

    const baseStat = ability.element ? char.mag : char.str;
    const rawDamage = baseStat * (ability.power ?? 1.0) * physMult * weakMult;
    const boostMult = calcDamageBoosts(char, ability, newTarget);
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

  for (const eff of char.statusEffects) {
    if (eff.id === 'faith') healMult += 0.30;
  }

  const newTargets = targets.map(t => {
    let healAmount = 0;
    if (ability.healValue) {
      healAmount = Math.floor(ability.healValue * healMult);
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
): number {
  const raw = enemyData.str * power;
  let mult = 1.0;

  for (const eff of target.statusEffects) {
    if (eff.id === 'prot')  mult *= 0.7;
    if (eff.id === 'shell') mult *= 0.7;
    if (eff.id === 'guard') mult *= 0.5;
  }

  return Math.floor(raw * mult * (0.9 + Math.random() * 0.2));
}
