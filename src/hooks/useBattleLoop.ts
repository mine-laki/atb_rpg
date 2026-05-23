import { useEffect, useRef, useCallback } from 'react';
import type { BattleState, CharacterInstance, ActionLogEntry, BattlePhase } from '../types';
import { updateATB, updateStatusEffects, consumeATB, hasEnoughATB } from '../systems/atb';
import { updateChain } from '../systems/chain';
import { aiSelectAction } from '../systems/ai';
import { executeAttack, executeHeal, executeRevive, calcEnemyDamage } from '../systems/combat';
import { getEnemyById } from '../data/enemies';
import { getEquipmentById, ENHANCE_MULTIPLIERS } from '../data/equipment';
import { CHARACTERS } from '../data/characters';

const MAX_LOG = 30;
let logSeq = 0;
const logId = () => `l${++logSeq}`;

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

    const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = timestamp;
    const now = timestamp / 1000;

    onStateUpdate(prev => {
      if (prev.phase !== 'battle') return prev;

      // Working copies — we mutate these throughout the tick
      let party: CharacterInstance[] = prev.party.map(char => {
        const updated = {
          ...updateATB(char, delta),
          statusEffects: updateStatusEffects(char.statusEffects, delta),
        };

        // Regen: heal 2% max HP per second while regen buff is active
        if (updated.isAlive && updated.statusEffects.some(e => e.id === 'regen')) {
          const heal = Math.floor(updated.maxHP * 0.02 * delta);
          updated.currentHP = Math.min(updated.maxHP, updated.currentHP + heal);
        }

        // Equipment auto_regen effect (passive, always-on)
        if (updated.isAlive) {
          let autoRegenRate = 0;
          for (const inst of [updated.equipment.weapon, updated.equipment.accessory1, updated.equipment.accessory2]) {
            if (!inst) continue;
            const d = getEquipmentById(inst.itemId);
            if (!d) continue;
            const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1.0;
            for (const eff of d.effects) {
              if (eff.type === 'auto_regen') autoRegenRate += eff.value * mult;
            }
          }
          if (autoRegenRate > 0) {
            const heal = Math.floor(updated.maxHP * autoRegenRate * delta);
            updated.currentHP = Math.min(updated.maxHP, updated.currentHP + heal);
          }
        }
        return updated;
      });

      let enemies = prev.enemies.map(e => updateChain(e, delta, now));

      const newLogs: ActionLogEntry[] = [];

      // ── 3. AI actions (sequential so each char sees up-to-date party/enemies) ──
      for (let charIdx = 0; charIdx < party.length; charIdx++) {
        const char = party[charIdx];
        if (!char.isAlive) continue;

        const decision = aiSelectAction(char, party, enemies, []);
        if (!decision) continue;

        const { ability, targetCharIdx, targetEnemyIdx } = decision;
        if (!hasEnoughATB(char, ability.cost)) continue;

        const charData = CHARACTERS.find(c => c.id === char.dataId);
        const actorEmoji = charData?.emoji ?? '';
        const actorName  = charData?.name  ?? char.dataId;

        // Consume ATB for this character
        party[charIdx] = consumeATB(char, ability.cost);

        // ── Execute ability ──
        if (ability.healPercent && (ability.id.includes('raise') || ability.id.includes('arise'))) {
          // Revive
          const tIdx = targetCharIdx ?? party.findIndex(p => !p.isAlive);
          const targetChar = party[tIdx];
          if (targetChar && !targetChar.isAlive) {
            const { newTarget, log } = executeRevive(party[charIdx], ability, targetChar);
            log.actorEmoji = actorEmoji;
            log.actorName  = actorName;
            log.targetName = CHARACTERS.find(c => c.id === targetChar.dataId)?.name ?? targetChar.dataId;
            newLogs.push(log);
            party[tIdx] = newTarget;
          }

        } else if (ability.healValue || ability.healPercent) {
          // Heal
          const healAll = ability.aoe;
          const tIdx = targetCharIdx ?? charIdx;
          const targets = healAll
            ? party.filter(p => p.isAlive)
            : [party[tIdx]].filter(Boolean) as CharacterInstance[];

          const { newTargets, logs } = executeHeal(party[charIdx], ability, targets);
          logs.forEach(l => {
            l.actorEmoji = actorEmoji;
            l.actorName  = actorName;
            l.targetName = healAll ? 'パーティ' : (CHARACTERS.find(c => c.id === targets[0]?.dataId)?.name ?? '');
          });
          newLogs.push(...logs);
          // Apply heals back to party
          for (const healed of newTargets) {
            const pi = party.findIndex(p => p.id === healed.id);
            if (pi >= 0) party[pi] = healed;
          }

        } else if (ability.buff && ability.buff.length > 0) {
          // Buff
          const buffAll = ability.aoe;
          const tIdx = targetCharIdx ?? charIdx;
          const targets = buffAll
            ? party.filter(p => p.isAlive)
            : [party[tIdx]].filter(Boolean) as CharacterInstance[];

          // ENH role level bonus: +5% buff duration per level
          const enhRoleLv = party[charIdx].currentRole === 'ENH'
            ? (party[charIdx].roleLevels?.['ENH'] ?? 1) : 0;
          const buffDurationMult = 1 + enhRoleLv * 0.05;

          for (const bt of targets) {
            const pi = party.findIndex(p => p.id === bt.id);
            if (pi < 0) continue;
            const newEffects = [...party[pi].statusEffects];
            for (const buffId of ability.buff!) {
              const baseDuration = buffId === 'haste' ? 20 : buffId === 'faith' ? 25 : buffId === 'regen' ? 30 : 30;
              const duration = Math.round(baseDuration * buffDurationMult);
              const existing = newEffects.findIndex(e => e.id === buffId);
              const effect = { id: buffId as any, type: 'buff' as const, duration, value: 1 };
              if (existing >= 0) newEffects[existing] = effect;
              else newEffects.push(effect);
            }
            party[pi] = { ...party[pi], statusEffects: newEffects };
          }

          newLogs.push({
            id: logId(), timestamp: now,
            actorEmoji, actorName,
            targetName: buffAll ? 'パーティ' : (CHARACTERS.find(c => c.id === targets[0]?.dataId)?.name ?? ''),
            abilityName: ability.name,
            value: 0, type: 'buff',
          });

        } else if (ability.debuff && ability.debuff.length > 0) {
          // Debuff enemy
          const eIdx = targetEnemyIdx ?? enemies.findIndex(e => e.currentHP > 0);
          if (eIdx >= 0 && enemies[eIdx]) {
            // JAM role level bonus: +5% debuff duration per level
            const jamRoleLv = party[charIdx].currentRole === 'JAM'
              ? (party[charIdx].roleLevels?.['JAM'] ?? 1) : 0;
            const debuffDurationMult = 1 + jamRoleLv * 0.05;

            const newEffects = [...enemies[eIdx].statusEffects];
            for (const debuffId of ability.debuff!) {
              const baseDuration = debuffId === 'stop' ? 5 : debuffId === 'slow' ? 20 : 25;
              const duration = Math.round(baseDuration * debuffDurationMult);
              const existing = newEffects.findIndex(e => e.id === debuffId);
              const effect = { id: debuffId as any, type: 'debuff' as const, duration, value: 0.3 };
              if (existing >= 0) newEffects[existing] = effect;
              else newEffects.push(effect);
            }
            enemies[eIdx] = { ...enemies[eIdx], statusEffects: newEffects };
            const eData = getEnemyById(enemies[eIdx].dataId);
            newLogs.push({
              id: logId(), timestamp: now,
              actorEmoji, actorName,
              targetName: eData?.name ?? enemies[eIdx].dataId,
              abilityName: ability.name,
              value: 0, type: 'debuff',
            });
          }

        } else if (ability.power !== undefined) {
          // Attack
          const eIdx = targetEnemyIdx ?? enemies.findIndex(e => e.currentHP > 0);
          if (eIdx >= 0 && enemies[eIdx]?.currentHP > 0) {
            const wasBreaking = enemies[eIdx].isBreaking;
            const { newTarget, logs } = executeAttack(party[charIdx], ability, enemies[eIdx], prev, now);
            const eData = getEnemyById(newTarget.dataId);
            logs.forEach(l => {
              l.actorEmoji = actorEmoji;
              l.actorName  = actorName;
              l.targetName = eData?.name ?? newTarget.dataId;
              l.isBreak    = newTarget.isBreaking && !wasBreaking;
            });
            newLogs.push(...logs);
            enemies[eIdx] = newTarget;
          }

        } else {
          // Misc ability (chain boost, dispel, etc.)
          newLogs.push({
            id: logId(), timestamp: now,
            actorEmoji, actorName,
            targetName: 'パーティ',
            abilityName: ability.name,
            value: 0, type: 'buff',
          });
        }
      }

      // ── 4. Enemy actions ──
      for (let eIdx = 0; eIdx < enemies.length; eIdx++) {
        const enemy = enemies[eIdx];
        if (enemy.currentHP <= 0) continue;

        // ブレイク中は行動しない（クールダウンは進める）
        if (enemy.isBreaking) {
          const newCooldowns: Record<string, number> = {};
          for (const [k, v] of Object.entries(enemy.actionCooldowns)) {
            newCooldowns[k] = Math.max(0, v - delta);
          }
          enemies[eIdx] = { ...enemy, actionCooldowns: newCooldowns };
          continue;
        }

        const enemyData = getEnemyById(enemy.dataId);
        if (!enemyData) continue;

        // Tick cooldowns
        const newCooldowns: Record<string, number> = {};
        for (const [k, v] of Object.entries(enemy.actionCooldowns)) {
          newCooldowns[k] = Math.max(0, v - delta);
        }

        // Phase transitions
        let currentPhase = enemy.currentPhase;
        const hpRatio = enemy.currentHP / enemy.maxHP;
        if (enemyData.phases) {
          for (let ph = enemyData.phases.length - 1; ph >= 0; ph--) {
            if (hpRatio <= enemyData.phases[ph].triggerHPPercent && currentPhase <= ph) {
              currentPhase = ph + 1;
            }
          }
        }

        // Select and execute one action this tick
        let didAct = false;
        for (const action of enemyData.actions) {
          if (didAct) break;

          const cd = newCooldowns[action.id] ?? 0;
          if (cd > 0) continue;

          if (action.condition) {
            const m = action.condition.match(/phase(\d)/);
            if (m && currentPhase < parseInt(m[1]) - 1) continue;
          }

          const aliveParty = party.filter(p => p.isAlive);
          if (!aliveParty.length) break;

          newCooldowns[action.id] = action.cooldown * 2;
          didAct = true;

          const targets = action.aoe ? aliveParty : [aliveParty[Math.floor(Math.random() * aliveParty.length)]];
          for (const target of targets) {
            const damage = calcEnemyDamage(enemyData, action.power, target);
            const newHP = Math.max(0, target.currentHP - damage);
            const pi = party.findIndex(p => p.id === target.id);
            if (pi >= 0) party[pi] = { ...party[pi], currentHP: newHP, isAlive: newHP > 0 };

            newLogs.push({
              id: logId(), timestamp: now,
              actorEmoji: enemyData.emoji,
              actorName:  enemyData.name,
              targetName: CHARACTERS.find(c => c.id === target.dataId)?.name ?? target.dataId,
              abilityName: action.name,
              value: damage,
              type: 'damage',
            });
          }
        }

        enemies[eIdx] = { ...enemy, actionCooldowns: newCooldowns, currentPhase };
      }

      // ── 5. Battle end check ──
      const allEnemiesDead = enemies.every(e => e.currentHP <= 0);
      const allPartyDead   = party.every(p => !p.isAlive);
      let phase: BattlePhase = prev.phase;
      if (allEnemiesDead) phase = 'victory';
      if (allPartyDead)   phase = 'defeat';

      const newActionLog = [...newLogs.reverse(), ...prev.actionLog].slice(0, MAX_LOG);

      const newBreaks = enemies.filter((e, i) => e.isBreaking && !prev.enemies[i]?.isBreaking).length;

      return {
        ...prev,
        party,
        enemies,
        phase,
        actionLog: newActionLog,
        elapsed: prev.elapsed + delta,
        breakCount: prev.breakCount + newBreaks,
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
