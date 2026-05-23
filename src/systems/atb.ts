import type { CharacterInstance, StatusEffect } from '../types';

const SEGMENT_FILL_TIME = 3.0; // seconds per segment

export function getATBSpeedMultiplier(char: CharacterInstance): number {
  let mult = 1.0;
  for (const effect of char.statusEffects) {
    if (effect.id === 'haste')  mult *= 1.5;
    if (effect.id === 'slow')   mult *= 0.5;
    if (effect.id === 'curse')  mult *= (1 - effect.value);
    if (effect.id === 'stop')   mult = 0;
  }
  return mult;
}

export function updateATB(char: CharacterInstance, delta: number): CharacterInstance {
  if (!char.isAlive) return char;

  const speedMult = getATBSpeedMultiplier(char) * char.atb.speedMultiplier;
  // ゲージ最大が多いほど有利：全ゲージ充填時間を一定(3セグ分=9秒)に統一
  // max=3→9秒, max=5→9秒 でどちらも同じ。ゲージ多い方がバーストが強い
  const fillRate = (char.atb.max / 3) * delta / SEGMENT_FILL_TIME * speedMult;
  const newCurrent = Math.min(char.atb.current + fillRate, char.atb.max);

  return {
    ...char,
    atb: { ...char.atb, current: newCurrent },
  };
}

export function consumeATB(char: CharacterInstance, cost: number): CharacterInstance {
  return {
    ...char,
    atb: { ...char.atb, current: Math.max(0, char.atb.current - cost) },
  };
}

export function refillATBSegment(char: CharacterInstance, segments: number = 1): CharacterInstance {
  return {
    ...char,
    atb: { ...char.atb, current: Math.min(char.atb.max, char.atb.current + segments) },
  };
}

export function hasEnoughATB(char: CharacterInstance, cost: number): boolean {
  return char.atb.current >= cost;
}

export function updateStatusEffects(effects: StatusEffect[], delta: number): StatusEffect[] {
  return effects
    .map(e => ({ ...e, duration: e.duration - delta }))
    .filter(e => e.duration > 0);
}
