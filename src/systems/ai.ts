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
  // +0.1 tolerance to handle floating-point ATB accumulation
  // e.g. ATB=2.95 with max=3 should count as 3 segments
  const atbSegs = Math.floor(char.atb.current + 0.1);

  switch (role) {
    case 'ATK': {
      const targetEnemy = enemies[targetEnemyIdx];
      // 複数敵がいてターゲットがブレイク中でない場合はAoEを優先
      const useAoe = aliveEnemies.length > 1 && !targetEnemy?.isBreaking;

      if (hpRatio > 0.7) {
        // AoE優先: 複数敵でブレイク中でない場合
        if (useAoe) {
          const areablast = abilities.find(a => a.id === 'atk_areablast' && a.cost <= atbSegs);
          if (areablast) return { ability: areablast, targetEnemyIdx };
        }
        const braver = abilities.find(a => a.id === 'atk_braver' && a.cost <= atbSegs);
        if (braver) return { ability: braver, targetEnemyIdx };
        const rush = abilities.find(a => a.id === 'atk_rush' && a.cost <= atbSegs);
        if (rush) return { ability: rush, targetEnemyIdx };
      }
      // ルイン uses max(str, mag) — always at least as good as fight
      const ruin = abilities.find(a => a.id === 'atk_ruin' && a.cost <= atbSegs);
      if (ruin) return { ability: ruin, targetEnemyIdx };
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
      // 複数敵がいてターゲットがブレイク中でない場合はAoEを優先
      const useAoe = aliveEnemies.length > 1 && !targetEnemy?.isBreaking;

      // AoE魔法優先（複数敵 & ブレイク中でない場合）
      if (useAoe) {
        const aoeSpell = abilities
          .filter(a => a.aoe && a.element && a.cost <= atbSegs)
          .sort((a, b) => b.cost - a.cost)[0];
        if (aoeSpell) return { ability: aoeSpell, targetEnemyIdx };
      }

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
      // At low HP, prefer heavy guard for maximum protection
      if (hpRatio < 0.4) {
        const hguard = abilities.find(a => a.id === 'def_heavyguard' && a.cost <= atbSegs);
        if (hguard) return { ability: hguard };
      }
      // Prefer regen guard for sustained protection + healing
      const regenGuard = abilities.find(a => a.id === 'def_regenguard' && a.cost <= atbSegs);
      if (regenGuard) return { ability: regenGuard };
      const guard = abilities.find(a => a.id === 'def_guard' && a.cost <= atbSegs);
      if (guard) return { ability: guard };
      const best = highestCostAbility(abilities, atbSegs);
      if (best) return { ability: best };
      return null;
    }

    case 'HLR': {
      // 1. 戦闘不能を最優先でレイズ
      const dead = findDeadChar(party);
      if (dead) {
        const raise = abilities.find(a => (a.id === 'hlr_raise' || a.id === 'hlr_arise') && a.cost <= atbSegs);
        if (raise) return { ability: raise, targetCharIdx: party.indexOf(dead) };
      }

      // 2. デバフ解除（エスナ）
      const charWithDebuff = party.find(p => p.isAlive && p.statusEffects.some(e => e.type === 'debuff'));
      if (charWithDebuff) {
        const esuna = abilities.find(a => a.dispelDebuff && a.cost <= atbSegs);
        if (esuna) return { ability: esuna, targetCharIdx: party.indexOf(charWithDebuff) };
      }

      // 3. HP最低のメンバーを回復（全体回復も考慮）
      const lowest = lowestHPChar(party);
      if (lowest) {
        const lowestRatio = lowest.currentHP / lowest.maxHP;

        // 全体的に低いなら全体回復
        const aliveMembers = party.filter(p => p.isAlive);
        const avgHPRatio = aliveMembers.reduce((sum, p) => sum + p.currentHP / p.maxHP, 0) / aliveMembers.length;
        if (avgHPRatio < 0.6) {
          const aoeHeal = abilities.find(a => a.aoe && (a.healValue || a.healPercent) && a.cost <= atbSegs);
          if (aoeHeal) return { ability: aoeHeal };
        }

        // ケアルア（欠損HP回復）：HP大幅低下時に優先
        if (lowestRatio < 0.4) {
          const curaa = abilities.find(a => a.healMissingPercent && a.cost <= atbSegs);
          if (curaa) return { ability: curaa, targetCharIdx: party.indexOf(lowest) };
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
      // 4. ケアルは最低HPのメンバーへ
      const cure = abilities.find(a => a.id === 'hlr_cure' && a.cost <= atbSegs);
      if (cure) return { ability: cure, targetCharIdx: party.indexOf(lowestHPChar(party) ?? party[0]) };
      const best = highestCostAbility(abilities, atbSegs);
      if (best) return { ability: best, targetCharIdx: party.indexOf(lowestHPChar(party) ?? party[0]) };
      return null;
    }

    case 'ENH': {
      const buffsToApply = ['haste', 'prot', 'shell', 'faith'] as const;

      // バフ種別ごとに「誰か1人でも未付与なら付与」を優先
      for (const buffId of buffsToApply) {
        const needsBuffList = party.filter(p => p.isAlive && !hasBuff(p, buffId));
        if (!needsBuffList.length) continue;

        const aoeAb = abilities.find(a =>
          a.buff?.includes(buffId as any) && a.aoe && a.cost <= atbSegs
        );
        if (aoeAb) return { ability: aoeAb };

        const singleAb = abilities.find(a =>
          a.buff?.includes(buffId as any) && !a.aoe && a.cost <= atbSegs
        );
        if (singleAb) return { ability: singleAb, targetCharIdx: party.indexOf(needsBuffList[0]) };
      }

      // ヴェイル：デバフ耐性（全員未付与なら付与）
      const needsVeil = party.find(p => p.isAlive && !hasBuff(p, 'veil'));
      if (needsVeil) {
        const veilAb = abilities.find(a => a.buff?.includes('veil' as any) && a.cost <= atbSegs);
        if (veilAb) return { ability: veilAb, targetCharIdx: party.indexOf(needsVeil) };
      }

      // 属性バフ（敵の使う属性に応じて）
      const enemyElements = new Set(
        aliveEnemies.flatMap(e => {
          const eData = getEnemyById(e.dataId);
          return (eData?.actions ?? []).map(a => a.element).filter(Boolean) as string[];
        })
      );
      const barBuffMap: [string, string][] = [
        ['fire', 'barfire'], ['ice', 'barice'], ['thunder', 'barthunder'], ['wind', 'barwind'],
      ];
      for (const [element, barBuff] of barBuffMap) {
        if (!enemyElements.has(element)) continue;
        const needsBar = party.find(p => p.isAlive && !hasBuff(p, barBuff));
        if (!needsBar) continue;
        const barAb = abilities.find(a => a.buff?.includes(barBuff as any) && a.cost <= atbSegs);
        if (barAb) return { ability: barAb, targetCharIdx: party.indexOf(needsBar) };
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
        // 複数の敵がいる場合はAoEデバフを優先
        if (aliveEnemies.length > 1) {
          const aoeDebuffAb = abilities.find(a =>
            a.aoe && a.debuff?.length && a.cost <= atbSegs
          );
          if (aoeDebuffAb) {
            // 全敵にまだかかっていないデバフがあれば使う
            const debuffId = aoeDebuffAb.debuff![0];
            const anyNeedsDebuff = aliveEnemies.some(e => !hasDebuff(e, debuffId));
            if (anyNeedsDebuff) return { ability: aoeDebuffAb, targetEnemyIdx };
          }
        }

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
