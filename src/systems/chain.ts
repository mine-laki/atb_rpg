import type { EnemyInstance, CharacterInstance, CommandAbility, Element } from '../types';
import { getEquipmentById, ENHANCE_MULTIPLIERS } from '../data/equipment';

function getEquipChainBoost(char: CharacterInstance): number {
  let total = 0;
  for (const inst of [char.equipment.weapon, char.equipment.accessory1, char.equipment.accessory2]) {
    if (!inst) continue;
    const d = getEquipmentById(inst.itemId);
    if (!d) continue;
    const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1.0;
    for (const eff of d.effects) {
      if (eff.type === 'chain_boost') total += eff.value * mult;
    }
  }
  return total;
}

const CHAIN_DECAY_RATE = 1;        // %/second
const BREAK_DURATION = 25;          // seconds
const DEFAULT_BREAK_AT = 300;       // default chainResistMax
const CHAIN_BUILD_RATE = 0.2;       // global chain build multiplier
const BREAK_CHAIN_MULT = 2.5;       // chain build rate multiplier during break
export const BREAK_GAUGE_MAX = 999; // gauge can exceed breakAt during break

export function calcChainBonus(gaugePercent: number): number {
  // chain multiplier: 1.0 at 0%, up to 9.99 at 999%
  return Math.min(9.99, 1.0 + (gaugePercent / 100) * (8.99 / 9.99));
}

export function applyChainHit(
  enemy: EnemyInstance,
  ability: CommandAbility,
  isWeakness: boolean,
  char: CharacterInstance,
  timestamp: number,
): EnemyInstance {
  const breakAt = enemy.chainResistMax ?? DEFAULT_BREAK_AT;
  const enemyChainRate = enemy.chainBuildRate ?? 1.0;
  let chainIncrease = ability.chainBonus * CHAIN_BUILD_RATE * enemyChainRate;

  // BLA role level bonus: +3% chain per level
  if (char.currentRole === 'BLA') {
    chainIncrease *= 1 + (char.roleLevels?.['BLA'] ?? 1) * 0.03;
  }

  // Equipment chain_boost
  const equipChain = getEquipChainBoost(char);
  if (equipChain > 0) chainIncrease *= 1 + equipChain;

  // weakness multiplier
  if (isWeakness) chainIncrease *= 1.5;

  // ブレイク中はチェーン増加が加速し、ゲージが更に上昇できる
  const gaugeCap = enemy.isBreaking ? BREAK_GAUGE_MAX : breakAt;
  if (enemy.isBreaking) chainIncrease *= BREAK_CHAIN_MULT;

  const newGauge = Math.min(gaugeCap, enemy.chainGauge + chainIncrease);
  const wasBreaking = enemy.isBreaking;
  const nowBreaking = enemy.isBreaking || newGauge >= breakAt;

  return {
    ...enemy,
    chainGauge: newGauge,
    isBreaking: nowBreaking,
    breakTimer: nowBreaking ? (wasBreaking ? enemy.breakTimer : BREAK_DURATION) : 0,
    lastHitTime: timestamp,
    chainDecayTimer: 0,
  };
}

export function updateChain(enemy: EnemyInstance, delta: number, currentTime: number): EnemyInstance {
  const breakAt = enemy.chainResistMax ?? DEFAULT_BREAK_AT;
  let { chainGauge, isBreaking, breakTimer, lastHitTime, chainDecayTimer } = enemy;

  if (isBreaking) {
    breakTimer -= delta;
    if (breakTimer <= 0) {
      isBreaking = false;
      breakTimer = 0;
      chainGauge = 0;
    }
    return { ...enemy, isBreaking, breakTimer, chainGauge };
  }

  // decay chain gauge if no recent hit
  const timeSinceHit = currentTime - lastHitTime;
  if (timeSinceHit > 0.5) {
    chainDecayTimer += delta;
    const decayAmount = CHAIN_DECAY_RATE * delta;
    chainGauge = Math.max(0, chainGauge - decayAmount);
  }

  // check break trigger
  if (chainGauge >= breakAt && !isBreaking) {
    isBreaking = true;
    breakTimer = BREAK_DURATION;
  }

  return { ...enemy, chainGauge, isBreaking, breakTimer, chainDecayTimer };
}

export function isWeakness(enemyWeaknesses: Element[], element?: Element): boolean {
  if (!element || element === 'none') return false;
  return enemyWeaknesses.includes(element);
}
