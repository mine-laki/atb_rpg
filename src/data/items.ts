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

// ---- 換金アイテム ----
export interface ValuableItem {
  id: string;
  name: string;
  emoji: string;
  sellValue: number;
}

export const VALUABLE_ITEMS: ValuableItem[] = [
  { id: 'coin_small',  name: '小銭袋',   emoji: '💰', sellValue: 1000 },
  { id: 'coin_medium', name: '札束',     emoji: '💵', sellValue: 10000 },
  { id: 'coin_large',  name: 'おたから', emoji: '💍', sellValue: 50000 },
];

export function getValuableById(id: string): ValuableItem | undefined {
  return VALUABLE_ITEMS.find(v => v.id === id);
}
