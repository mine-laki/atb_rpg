import type { CharacterInstance, ParadigmData, RoleId } from '../types';
import { refillATBSegment } from './atb';

export function switchParadigm(
  party: CharacterInstance[],
  paradigm: ParadigmData,
): CharacterInstance[] {
  return party.map((char, idx) => {
    const newRole = paradigm.roles[idx];
    const updatedChar = { ...char, currentRole: newRole as RoleId };
    return refillATBSegment(updatedChar, 1);
  });
}

export function getDefaultParadigms(roles: RoleId[][]): ParadigmData[] {
  return roles.map((roleSet, idx) => ({
    slot: idx,
    name: `作戦${idx + 1}`,
    roles: roleSet as [RoleId, RoleId, RoleId],
  }));
}

export function getRoleEmoji(role: RoleId): string {
  const map: Record<RoleId, string> = {
    ATK: '⚔️', BLA: '🔮', DEF: '🛡️', HLR: '💚', ENH: '✨', JAM: '💜',
  };
  return map[role] ?? '?';
}

export function getRoleLabel(role: RoleId): string {
  const map: Record<RoleId, string> = {
    ATK: 'アタッカー', BLA: 'ブラスター', DEF: 'ディフェンダー',
    HLR: 'ヒーラー',  ENH: 'エンハンサー', JAM: 'ジャマー',
  };
  return map[role] ?? role;
}

export function getParadigmAutoName(roles: [RoleId, RoleId, RoleId]): string {
  const counts: Partial<Record<RoleId, number>> = {};
  for (const r of roles) counts[r] = (counts[r] ?? 0) + 1;

  const atk = counts['ATK'] ?? 0;
  const bla = counts['BLA'] ?? 0;
  const def = counts['DEF'] ?? 0;
  const hlr = counts['HLR'] ?? 0;
  const enh = counts['ENH'] ?? 0;
  const jam = counts['JAM'] ?? 0;

  if (atk + bla === 3) return '総攻撃';
  if (atk + bla >= 2 && hlr >= 1) return atk >= 2 ? '電撃攻撃' : '魔法攻撃';
  if (bla >= 2) return '魔法集中';
  if (enh >= 2) return '強化特化';
  if (def >= 2) return '鉄壁';
  if (hlr >= 2) return '回復重視';
  if (jam >= 1 && atk + bla >= 1) return '陽動作戦';
  if (enh >= 1 && hlr >= 1) return '均衡';
  if (def >= 1 && hlr >= 1) return '防衛体制';
  return '万能';
}
