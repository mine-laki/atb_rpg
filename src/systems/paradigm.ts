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

  if (atk === 3) return 'ケルベロス';
  if (atk === 2 && bla === 1) return 'フューリアス';
  if (atk === 2 && def === 1) return '鋼のレギオン';
  if (atk === 2 && jam === 1) return 'アグレッション';
  if (atk === 2 && enh === 1) return '躍動の両雄';
  if (atk === 2 && hlr === 1) return '揺るぎなき覇者';

  if (atk === 1 && bla === 2) return 'ラッシュアサルト';
  if (atk === 1 && bla === 1 && def === 1) return 'デルタアタック';
  if (atk === 1 && bla === 1 && enh === 1) return '風雲の龍虎';
  if (atk === 1 && bla === 1 && jam === 1) return '撃滅の戦鬼';
  if (atk === 1 && bla === 1 && hlr === 1) return '勇戦の凱歌';

  if (atk === 1 && def === 2) return 'イングレナブル';
  if (atk === 1 && def === 1 && enh === 1) return '奮起の挑戦者';
  if (atk === 1 && def === 1 && jam === 1) return 'リベリオン';
  if (atk === 1 && def === 1 && hlr === 1) return '勝利への決意';

  if (atk === 1 && jam === 2) return 'カラミティサーカス';
  if (atk === 1 && jam === 1 && enh === 1) return '逆襲の魁';
  if (atk === 1 && jam === 1 && hlr === 1) return '狩人への祝福';

  if (atk === 1 && enh === 2) return '獅子心王';
  if (atk === 1 && enh === 1 && hlr === 1) return '不屈の戦士';

  if (atk === 1 && hlr === 2) return '青雲の志士';

  if (bla === 3) return 'トライディザスター';
  if (bla === 2 && def === 1) return 'ヴァンガード';
  if (bla === 2 && enh === 1) return '魔道のパレード';
  if (bla === 2 && jam === 1) return 'カタストロフィ';
  if (bla === 2 && hlr === 1) return '精霊のオラトリオ';

  if (bla === 1 && def === 2) return 'インターセプト';
  if (bla === 1 && def === 1 && jam === 1) return 'マタドール';
  if (bla === 1 && def === 1 && enh === 1) return '迎撃のマーチ';
  if (bla === 1 && def === 1 && hlr === 1) return '抗戦の讃歌';

  if (bla === 1 && jam === 2) return 'カラミティサーカス';
  if (bla === 1 && jam === 1 && enh === 1) return '謀略のラプソディ';
  if (bla === 1 && jam === 1 && hlr === 1) return 'デクスタラス';

  if (bla === 1 && enh === 2) return '無双のフォース';
  if (bla === 1 && enh === 1 && hlr === 1) return 'プレイヴァリー';

  if (bla === 1 && hlr === 2) return '不死の魔神';

  if (def === 3) return 'グレートウォール';
  if (def === 2 && jam === 1) return 'フォートレス';
  if (def === 2 && enh === 1) return '鉄の双璧';
  if (def === 2 && hlr === 1) return '不落の砦';

  if (def === 1 && jam === 2) return '策謀の復讐者';
  if (def === 1 && jam === 1 && enh === 1) return '反撃の狼煙';
  if (def === 1 && jam === 1 && hlr === 1) return 'レジスタンス';

  if (def === 1 && enh === 2) return 'マイティガード';
  if (def === 1 && enh === 1 && hlr === 1) return '忍耐の守護者';

  if (def === 1 && hlr === 2) return 'フェニックス';

  if (jam === 3) return 'アシュラ';
  if (jam === 2 && enh === 1) return '無慈悲なる災厄';
  if (jam === 2 && hlr === 1) return '冥界のコーラス';

  if (jam === 1 && enh === 2) return 'フォーミダブル';
  if (jam === 1 && enh === 1 && hlr === 1) return 'トリニティユニオン';

  if (jam === 1 && hlr === 2) return '執拗なる計略';

  if (enh === 3) return 'トリスメギストス';
  if (enh === 2 && hlr === 1) return 'ホワイトウィンド';
  if (enh === 1 && hlr === 2) return '恵みの慈雨';

  if (hlr === 3) return 'アスクレピオス';

  return '万能';
}
