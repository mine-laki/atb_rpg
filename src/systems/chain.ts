import type { EnemyInstance, CharacterInstance, CommandAbility, Element } from '../types';

const CHAIN_DECAY_RATE = 15;    // %/second
const BREAK_DURATION = 15;      // seconds
const MAX_CHAIN = 999;

export function calcChainBonus(gaugePercent: number): number {
  // chain multiplier: 1.0 at 0%, up to 9.99 at 999%
  return Math.min(9.99, 1.0 + (gaugePercent / 100) * (8.99 / 9.99));
}

export function applyChainHit(
  enemy: EnemyInstance,
  ability: CommandAbility,
  isWeakness: boolean,
  _char: CharacterInstance,
  timestamp: number,
): EnemyInstance {
  let chainIncrease = ability.chainBonus;

  // weakness multiplier
  if (isWeakness) chainIncrease *= 1.5;

  // check char auto abilities for chain_boost
  const newGauge = Math.min(MAX_CHAIN, enemy.chainGauge + chainIncrease);
  const wasBreaking = enemy.isBreaking;
  const nowBreaking = newGauge >= enemy.chainGauge
    ? (enemy.isBreaking || newGauge >= 300)
    : enemy.isBreaking;

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
  if (chainGauge >= 300 && !isBreaking) {
    isBreaking = true;
    breakTimer = BREAK_DURATION;
  }

  return { ...enemy, chainGauge, isBreaking, breakTimer, chainDecayTimer };
}

export function isWeakness(enemyWeaknesses: Element[], element?: Element): boolean {
  if (!element || element === 'none') return false;
  return enemyWeaknesses.includes(element);
}
