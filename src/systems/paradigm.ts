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
