export interface BattleItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  healPercent?: number;
  aoe?: boolean;
}

export const BATTLE_ITEMS: BattleItem[] = [
  { id: 'potion',    name: 'ポーション',    emoji: '🧪', description: 'パーティ全体のHP20%回復', healPercent: 0.20, aoe: true },
  { id: 'hi_potion', name: 'ハイポーション', emoji: '💊', description: 'パーティ全体のHP50%回復', healPercent: 0.50, aoe: true },
];

export function getItemById(id: string): BattleItem | undefined {
  return BATTLE_ITEMS.find(i => i.id === id);
}
