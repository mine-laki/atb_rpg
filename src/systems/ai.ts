import type { CharacterInstance, EnemyInstance, CommandAbility } from '../types';
import { getAbilitiesForRole, getAbilityById } from '../data/abilities';
import { getEnemyById } from '../data/enemies';
import { CHARACTERS } from '../data/characters';

function getAbilitiesForChar(char: CharacterInstance): CommandAbility[] {
  return getAbilitiesForRole(char.currentRole, char.dataId, char.level);
}

/** Returns the ultimate ability if it's usable this turn */
function getUltimateIfUsable(char: CharacterInstance): CommandAbility | null {
  if (char.ultimateUsed) return null;
  if (char.level < 40) return null;
  if ((char.roleLevels?.[char.currentRole] ?? 1) < 5) return null;
  if (char.atb.current < char.atb.max - 0.1) return null;  // must be at full ATB

  const charData = CHARACTERS.find(c => c.id === char.dataId);
  if (!charData) return null;
  for (const abId of charData.uniqueAbilities) {
    const ab = getAbilityById(abId);
    if (ab?.isUltimate && ab.role === char.currentRole) return ab;
  }
  return null;
}

function hasBuff(char: CharacterInstance, buffId: string): boolean {
  return char.statusEffects.some(e => e.id === buffId && e.type === 'buff');
}

function hasDebuff(enemy: EnemyInstance, debuffId: string): boolean {
  return enemy.statusEffects.some(e => e.id === debuffId);
}

function lowestHPChar(party: CharacterInstance[]): CharacterInstance | undefined {
  const alive = party.filter(c => c.isAlive);
  if (!alive.length) return undefined;
  return alive.reduce((min, c) => (c.currentHP / c.maxHP < min.currentHP / min.maxHP) ? c : min, alive[0]);
}

function findDeadChar(party: CharacterInstance[]): CharacterInstance | undefined {
  return party.find(c => !c.isAlive);
}

function highestCostAbility(abilities: CommandAbility[], maxATB: number): CommandAbility | undefined {
  return abilities
    .filter(a => a.cost <= maxATB)
    .sort((a, b) => b.cost - a.cost)[0];
}

export interface AIDecision {
  ability: CommandAbility;
  targetCharIdx?: number;   // for HLR targeting party member
  targetEnemyIdx?: number;  // for attack targeting enemy
}

export function aiSelectAction(
  char: CharacterInstance,
  party: CharacterInstance[],
  enemies: EnemyInstance[],
  _enemyWeaknesses: string[],
): AIDecision | null {
  const role = char.currentRole;
  const abilities = getAbilitiesForChar(char);
  if (!abilities.length) return null;

  const aliveEnemies = enemies.filter(e => e.currentHP > 0);
  if (!aliveEnemies.length) return null;

  // pick primary target enemy (lowest HP)
  const targetEnemyIdx = enemies.findIndex(e =>
    e.currentHP === Math.min(...aliveEnemies.map(x => x.currentHP))
  );

  // Check for ultimate ability (opportunistic use)
  const ult = getUltimateIfUsable(char);
  if (ult) {
    if (ult.healPercent) {
      return { ability: ult, targetCharIdx: 0 };
    }
    return { ability: ult, targetEnemyIdx };
  }

  const hpRatio = char.currentHP / char.maxHP;
  const atbSegs = Math.floor(char.atb.current);

  switch (role) {
    case 'ATK': {
      if (hpRatio > 0.7) {
        const braver = abilities.find(a => a.id === 'atk_braver' && a.cost <= atbSegs);
        if (braver) return { ability: braver, targetEnemyIdx };
        const rush = abilities.find(a => a.id === 'atk_rush' && a.cost <= atbSegs);
        if (rush) return { ability: rush, targetEnemyIdx };
      }
      const fight = abilities.find(a => a.id === 'atk_fight' && a.cost <= atbSegs);
      if (fight) return { ability: fight, targetEnemyIdx };
      const best = highestCostAbility(abilities, atbSegs);
      if (best) return { ability: best, targetEnemyIdx };
      return null;
    }

    case 'BLA': {
      const targetEnemy = enemies[targetEnemyIdx];
      const targetEnemyData = targetEnemy ? getEnemyById(targetEnemy.dataId) : undefined;
      const weak = targetEnemyData?.weaknesses ?? [];

      // find weakness ability
      if (weak.length > 0) {
        const weakAb = abilities
          .filter(a => a.element && weak.includes(a.element) && a.cost <= atbSegs)
          .sort((a, b) => b.cost - a.cost)[0];
        if (weakAb) return { ability: weakAb, targetEnemyIdx };
      }

      const fira = abilities.find(a => a.id === 'bla_fira' && a.cost <= atbSegs);
      if (fira) return { ability: fira, targetEnemyIdx };
      const best = highestCostAbility(abilities.filter(a => a.element), atbSegs);
      if (best) return { ability: best, targetEnemyIdx };
      const anyBest = highestCostAbility(abilities, atbSegs);
      if (anyBest) return { ability: anyBest, targetEnemyIdx };
      return null;
    }

    case 'DEF': {
      const fight = abilities.find(a => a.id === 'def_fight' && a.cost <= atbSegs);
      if (fight) return { ability: fight, targetEnemyIdx };
      const best = highestCostAbility(abilities, atbSegs);
      if (best) return { ability: best, targetEnemyIdx };
      return null;
    }

    case 'HLR': {
      // 1. 戦闘不能を最優先でレイズ
      const dead = findDeadChar(party);
      if (dead) {
        const raise = abilities.find(a => (a.id === 'hlr_raise' || a.id === 'hlr_arise') && a.cost <= atbSegs);
        if (raise) return { ability: raise, targetCharIdx: party.indexOf(dead) };
      }

      // 2. HP最低のメンバーを回復（全体回復も考慮）
      const lowest = lowestHPChar(party);
      if (lowest) {
        const lowestRatio = lowest.currentHP / lowest.maxHP;

        // 全体的に低いなら全体回復
        const avgHPRatio = party.filter(p => p.isAlive)
          .reduce((sum, p) => sum + p.currentHP / p.maxHP, 0) / party.filter(p => p.isAlive).length;
        if (avgHPRatio < 0.6) {
          const aoeHeal = abilities.find(a => a.aoe && (a.healValue || a.healPercent) && a.cost <= atbSegs);
          if (aoeHeal) return { ability: aoeHeal };
        }

        if (lowestRatio < 0.5) {
          const curaga = abilities.find(a => a.id === 'hlr_curaga' && a.cost <= atbSegs);
          if (curaga) return { ability: curaga, targetCharIdx: party.indexOf(lowest) };
        }
        if (lowestRatio < 0.8) {
          const cura = abilities.find(a => a.id === 'hlr_cura' && a.cost <= atbSegs);
          if (cura) return { ability: cura, targetCharIdx: party.indexOf(lowest) };
        }
      }
      // 3. ケアルは最低HPのメンバーへ（0番ではなく）
      const cure = abilities.find(a => a.id === 'hlr_cure' && a.cost <= atbSegs);
      if (cure) return { ability: cure, targetCharIdx: party.indexOf(lowestHPChar(party) ?? party[0]) };
      const best = highestCostAbility(abilities, atbSegs);
      if (best) return { ability: best, targetCharIdx: party.indexOf(lowestHPChar(party) ?? party[0]) };
      return null;
    }

    case 'ENH': {
      const buffsToApply = ['haste', 'prot', 'shell', 'faith',] as const;

      // バフ種別ごとに「誰か1人でも未付与なら付与」を優先
      // AoEアビリティが使えれば全体に付与、なければ未付与の最初のメンバーに付与
      for (const buffId of buffsToApply) {
        const needsBuffList = party.filter(p => p.isAlive && !hasBuff(p, buffId));
        if (!needsBuffList.length) continue;

        // AoEバフを優先（全体を一括で）
        const aoeAb = abilities.find(a =>
          a.buff?.includes(buffId as any) && a.aoe && a.cost <= atbSegs
        );
        if (aoeAb) return { ability: aoeAb };  // AoEはtargetCharIdxなし

        // シングルターゲット版で未付与の最初のメンバーへ
        const singleAb = abilities.find(a =>
          a.buff?.includes(buffId as any) && !a.aoe && a.cost <= atbSegs
        );
        if (singleAb) return { ability: singleAb, targetCharIdx: party.indexOf(needsBuffList[0]) };
      }

      // 全バフ適用済み → HP最低メンバーを回復
      const lowest = lowestHPChar(party);
      if (lowest && lowest.currentHP / lowest.maxHP < 0.85) {
        const cure = abilities.find(a => (a.healValue || a.healPercent) && a.cost <= atbSegs);
        if (cure) return { ability: cure, targetCharIdx: party.indexOf(lowest) };
      }
      const best = highestCostAbility(abilities, atbSegs);
      if (best) return { ability: best, targetCharIdx: party.indexOf(lowestHPChar(party) ?? party[0]) };
      return null;
    }

    case 'JAM': {
      const targetEnemy = enemies[targetEnemyIdx];
      const targetEnemyData = targetEnemy ? getEnemyById(targetEnemy.dataId) : undefined;
      const debuffRate = targetEnemyData?.debuffSuccessRate ?? 100;

      // 非デバフアビリティ（汎用攻撃系）
      const nonDebuffAbilities = abilities.filter(a => !a.debuff?.length);

      // 0%完全耐性: デバフ一切使わない
      if (debuffRate === 0) {
        const best = highestCostAbility(nonDebuffAbilities.length ? nonDebuffAbilities : abilities, atbSegs);
        if (best) return { ability: best, targetEnemyIdx };
        return null;
      }

      // 20%超: 通常優先でデバフ付与を狙う
      if (targetEnemy && debuffRate > 20) {
        const debuffsToApply = ['deprot', 'deshell', 'slow', 'pain'] as const;
        for (const debuffId of debuffsToApply) {
          if (!hasDebuff(targetEnemy, debuffId)) {
            const debuffAb = abilities.find(a =>
              a.debuff?.includes(debuffId as any) && a.cost <= atbSegs
            );
            if (debuffAb) return { ability: debuffAb, targetEnemyIdx };
          }
        }
      }

      // 20%以下: まず非デバフ、なければ低優先でデバフ試行
      const bestNonDebuff = highestCostAbility(nonDebuffAbilities, atbSegs);
      if (bestNonDebuff) return { ability: bestNonDebuff, targetEnemyIdx };

      if (targetEnemy && debuffRate > 0) {
        const fallback = highestCostAbility(abilities, atbSegs);
        if (fallback) return { ability: fallback, targetEnemyIdx };
      }

      return null;
    }

    default:
      return null;
  }
}
