import type { BattleState, DropItem } from '../../types';
import { getEnemyById } from '../../data/enemies';
import { getMaterialById, getEquipmentById } from '../../data/equipment';

interface ResultScreenProps {
  state: BattleState;
  gil: number;
  drops: DropItem[];
  onContinue: () => void;
  onRetry: () => void;
}

function calcGil(state: BattleState): number {
  let total = 0;
  for (const enemy of state.enemies) {
    const data = getEnemyById(enemy.dataId);
    if (data && enemy.currentHP <= 0) {
      total += data.gilReward;
    }
  }
  const breakBonus = state.breakCount * 50;
  const speedBonus = state.elapsed < 30 ? 200 : state.elapsed < 60 ? 100 : 0;
  return total + breakBonus + speedBonus;
}

export function ResultScreen({ state, gil, drops, onContinue, onRetry }: ResultScreenProps) {
  const isVictory = state.phase === 'victory';
  const computedGil = gil || calcGil(state);

  return (
    <div className="result-screen">
      <h2 className={isVictory ? 'victory-title' : 'defeat-title'}>
        {isVictory ? '🎉 勝利!' : '💀 敗北...'}
      </h2>

      {isVictory && (
        <div className="rewards">
          <div className="reward-gil">
            💰 獲得Gil: <strong>{computedGil.toLocaleString()}</strong>
          </div>
          {drops.length > 0 && (
            <div className="drops">
              <h3>ドロップアイテム</h3>
              {drops.map((drop, i) => {
                const name = drop.type === 'material'
                  ? getMaterialById(drop.itemId)?.name
                  : getEquipmentById(drop.itemId)?.name;
                return (
                  <div key={i} className="drop-item">
                    {name ?? drop.itemId} ×{drop.quantity}
                  </div>
                );
              })}
            </div>
          )}
          <div className="result-stats">
            <div>撃破数: {state.enemies.filter(e => e.currentHP <= 0).length}</div>
            <div>ブレイク: {state.breakCount}回</div>
            <div>経過時間: {Math.floor(state.elapsed)}秒</div>
          </div>
        </div>
      )}

      <div className="result-actions">
        {isVictory ? (
          <button className="btn-primary" onClick={onContinue}>ホームへ</button>
        ) : (
          <>
            <button className="btn-primary" onClick={onRetry}>リトライ</button>
            <button className="btn-secondary" onClick={onContinue}>ホームへ</button>
          </>
        )}
      </div>
    </div>
  );
}
