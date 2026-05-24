import type { EnemyInstance } from '../../types';
import { calcChainBonus } from '../../systems/chain';

const DEFAULT_BREAK_AT = 300;

interface ChainGaugeProps {
  enemy: EnemyInstance;
}

export function ChainGauge({ enemy }: ChainGaugeProps) {
  const { chainGauge, isBreaking, breakTimer } = enemy;
  const breakAt = enemy.chainResistMax ?? DEFAULT_BREAK_AT;
  const pct = Math.min(100, (chainGauge / breakAt) * 100);
  const multiplier = calcChainBonus(chainGauge).toFixed(2);

  return (
    <div className={`chain-gauge ${isBreaking ? 'breaking' : ''}`}>
      <div className="chain-label">
        {isBreaking ? (
          <span className="break-text">BREAK! ×{multiplier} ({Math.ceil(breakTimer)}s)</span>
        ) : (
          <span>チェーン {chainGauge.toFixed(0)}% | ×{multiplier}</span>
        )}
      </div>
      <div className="chain-bar">
        <div
          className="chain-fill"
          style={{
            width: `${Math.min(100, pct)}%`,
            backgroundColor: isBreaking ? '#ff6600' : chainGauge >= breakAt * 0.8 ? '#ffcc00' : '#4488ff',
          }}
        />
        <div className="chain-threshold-marker" style={{ left: '100%' }} />
      </div>
    </div>
  );
}
