import { useEffect, useRef, useCallback } from 'react';
import type { BattleState, CharacterInstance, ActionLogEntry, BattlePhase } from '../types';
import { updateATB, updateStatusEffects, consumeATB, hasEnoughATB } from '../systems/atb';
import { updateChain } from '../systems/chain';
import { aiSelectAction } from '../systems/ai';
import { executeAttack, executeHeal, executeRevive, calcEnemyDamage } from '../systems/combat';
import { getEnemyById } from '../data/enemies';
import { CHARACTERS } from '../data/characters';

const MAX_LOG = 30;

interface UseBattleLoopOptions {
  state: BattleState;
  onStateUpdate: (updater: (prev: BattleState) => BattleState) => void;
  isRunning: boolean;
}

export function useBattleLoop({ state, onStateUpdate, isRunning }: UseBattleLoopOptions) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const stateRef = useRef<BattleState>(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const tick = useCallback((timestamp: number) => {
    if (!isRunning) return;

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1); // cap at 100ms
    lastTimeRef.current = timestamp;
    const now = timestamp / 1000;

    onStateUpdate(prev => {
      if (prev.phase !== 'battle') return prev;

      let party = prev.party;
      let enemies = prev.enemies;
      const newLogs: ActionLogEntry[] = [];

      // 1. update ATB gauges + status effects
      party = party.map(char => {
        const withATB = updateATB(char, delta);
        return { ...withATB, statusEffects: updateStatusEffects(char.statusEffects, delta) };
      });

      // 2. update chain gauge decay
      enemies = enemies.map(e => updateChain(e, delta, now));

      // 3. AI actions
      party = party.map((char, charIdx) => {
        if (!char.isAlive) return char;
        const decision = aiSelectAction(char, party, enemies, []);
        if (!decision) return char;

        const { ability, targetCharIdx, targetEnemyIdx } = decision;
        if (!hasEnoughATB(char, ability.cost)) return char;

        let updatedChar = consumeATB(char, ability.cost);

        const charData = CHARACTERS.find(c => c.id === char.dataId);

        if (ability.healValue || ability.healPercent) {
          // healing ability
          const isRevive = ability.id.includes('raise') || ability.id.includes('arise');
          if (isRevive) {
            const targetChar = party[targetCharIdx ?? 0];
            if (targetChar && !targetChar.isAlive) {
              const { newTarget, log } = executeRevive(char, ability, targetChar);
              log.actorEmoji = charData?.emoji ?? '';
              log.actorName = charData?.name ?? char.dataId;
              newLogs.push(log);
              party = party.map((p, i) => i === (targetCharIdx ?? 0) ? newTarget : p);
            }
          } else {
            const healTargets = ability.aoe
              ? party.filter(p => p.isAlive)
              : [party[targetCharIdx ?? charIdx]].filter(Boolean) as CharacterInstance[];

            const { newTargets, logs } = executeHeal(updatedChar, ability, healTargets);
            logs.forEach(l => { l.actorEmoji = charData?.emoji ?? ''; l.actorName = charData?.name ?? char.dataId; });
            newLogs.push(...logs);

            party = party.map(p => {
              const updated = newTargets.find(nt => nt.id === p.id);
              return updated ?? p;
            });
          }
        } else if (ability.buff && ability.buff.length > 0) {
          // buff ability
          const buffTargets = ability.aoe
            ? party.filter(p => p.isAlive)
            : [party[targetCharIdx ?? charIdx]].filter(Boolean) as CharacterInstance[];

          party = party.map(p => {
            if (!buffTargets.some(bt => bt.id === p.id)) return p;
            const newEffects = [...p.statusEffects];
            for (const buffId of ability.buff!) {
              const duration = buffId === 'haste' ? 20 : buffId === 'faith' ? 25 : 30;
              const existing = newEffects.findIndex(e => e.id === buffId);
              const effect = { id: buffId as any, type: 'buff' as const, duration, value: 1 };
              if (existing >= 0) newEffects[existing] = effect;
              else newEffects.push(effect);
            }
            return { ...p, statusEffects: newEffects };
          });

          newLogs.push({
            id: `log_${Date.now()}_${Math.random()}`,
            timestamp: now,
            actorEmoji: charData?.emoji ?? '',
            actorName: charData?.name ?? char.dataId,
            targetName: ability.aoe ? 'パーティ' : (party[targetCharIdx ?? charIdx]?.dataId ?? ''),
            abilityName: ability.name,
            value: 0,
            type: 'buff',
          });
        } else if (ability.debuff && ability.debuff.length > 0) {
          // debuff ability
          const targetEnemyIdx2 = targetEnemyIdx ?? 0;
          const targetEnemy = enemies[targetEnemyIdx2];
          if (targetEnemy) {
            const newEffects = [...targetEnemy.statusEffects];
            for (const debuffId of ability.debuff!) {
              const duration = debuffId === 'stop' ? 5 : debuffId === 'slow' ? 20 : 25;
              const existing = newEffects.findIndex(e => e.id === debuffId);
              const effect = { id: debuffId as any, type: 'debuff' as const, duration, value: 0.3 };
              if (existing >= 0) newEffects[existing] = effect;
              else newEffects.push(effect);
            }
            enemies = enemies.map((e, i) => i === targetEnemyIdx2 ? { ...e, statusEffects: newEffects } : e);
          }
          newLogs.push({
            id: `log_${Date.now()}_${Math.random()}`,
            timestamp: now,
            actorEmoji: charData?.emoji ?? '',
            actorName: charData?.name ?? char.dataId,
            targetName: enemies[targetEnemyIdx2]?.dataId ?? '',
            abilityName: ability.name,
            value: 0,
            type: 'debuff',
          });
        } else if (ability.power !== undefined) {
          // attack ability
          const targetEnemyIdx2 = targetEnemyIdx ?? 0;
          const targetEnemy = enemies[targetEnemyIdx2];
          if (targetEnemy && targetEnemy.currentHP > 0) {
            const prevBreaking = targetEnemy.isBreaking;
            const { newTarget, logs } = executeAttack(updatedChar, ability, targetEnemy, prev, now);
            logs.forEach(l => {
              l.actorEmoji = charData?.emoji ?? '';
              l.actorName = charData?.name ?? char.dataId;
              const enemyData2 = getEnemyById(newTarget.dataId);
              l.targetName = enemyData2?.name ?? newTarget.dataId;
              l.isBreak = newTarget.isBreaking && !prevBreaking;
            });
            newLogs.push(...logs);
            enemies = enemies.map((e, i) => i === targetEnemyIdx2 ? newTarget : e);
          }
        } else {
          // special ability (chain boost etc)
          newLogs.push({
            id: `log_${Date.now()}_${Math.random()}`,
            timestamp: now,
            actorEmoji: charData?.emoji ?? '',
            actorName: charData?.name ?? char.dataId,
            targetName: 'パーティ',
            abilityName: ability.name,
            value: 0,
            type: 'buff',
          });
        }

        return updatedChar;
      });

      // 4. enemy actions
      enemies = enemies.map(enemy => {
        if (enemy.currentHP <= 0) return enemy;
        const enemyData = getEnemyById(enemy.dataId);
        if (!enemyData) return enemy;

        const newCooldowns = { ...enemy.actionCooldowns };
        for (const key of Object.keys(newCooldowns)) {
          newCooldowns[key] = Math.max(0, newCooldowns[key] - delta);
        }

        for (const action of enemyData.actions) {
          const cooldown = newCooldowns[action.id] ?? 0;
          if (cooldown > 0) continue;

          // check phase condition
          if (action.condition) {
            const phaseMatch = action.condition.match(/phase(\d)/);
            if (phaseMatch && enemy.currentPhase < parseInt(phaseMatch[1]) - 1) continue;
          }

          newCooldowns[action.id] = action.cooldown;
          const aliveParty = party.filter(p => p.isAlive);
          if (!aliveParty.length) break;

          const targets = action.aoe ? aliveParty : [aliveParty[Math.floor(Math.random() * aliveParty.length)]];
          for (const target of targets) {
            const damage = calcEnemyDamage(enemyData, action.power, target);
            const newHP = Math.max(0, target.currentHP - damage);
            party = party.map(p => {
              if (p.id !== target.id) return p;
              return { ...p, currentHP: newHP, isAlive: newHP > 0 };
            });
            newLogs.push({
              id: `log_${Date.now()}_${Math.random()}`,
              timestamp: now,
              actorEmoji: enemyData.emoji,
              actorName: enemyData.name,
              targetName: CHARACTERS.find(c => c.id === target.dataId)?.name ?? target.dataId,
              abilityName: action.name,
              value: damage,
              type: 'damage',
            });
          }
          break; // one action per tick per enemy
        }

        // phase transitions
        let currentPhase = enemy.currentPhase;
        const hpRatio = enemy.currentHP / enemy.maxHP;
        if (enemyData.phases) {
          for (let ph = enemyData.phases.length - 1; ph >= 0; ph--) {
            if (hpRatio <= enemyData.phases[ph].triggerHPPercent && currentPhase <= ph) {
              currentPhase = ph + 1;
            }
          }
        }

        return { ...enemy, actionCooldowns: newCooldowns, currentPhase };
      });

      // 5. check battle end
      const allEnemiesDead = enemies.every(e => e.currentHP <= 0);
      const allPartyDead = party.every(p => !p.isAlive);
      let phase: BattlePhase = prev.phase;
      if (allEnemiesDead) phase = 'victory';
      if (allPartyDead) phase = 'defeat';

      const newActionLog = [...newLogs, ...prev.actionLog].slice(0, MAX_LOG);

      return {
        ...prev,
        party,
        enemies,
        phase,
        actionLog: newActionLog,
        elapsed: prev.elapsed + delta,
        breakCount: prev.breakCount + enemies.filter((e, i) => e.isBreaking && !prev.enemies[i]?.isBreaking).length,
      };
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [isRunning, onStateUpdate]);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, tick]);
}
