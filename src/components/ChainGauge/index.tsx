import type { EnemyInstance } from '../../types';
import { calcChainBonus } from '../../systems/chain';

interface ChainGaugeProps {
  enemy: EnemyInstance;
  breakThreshold: number;
}

export function ChainGauge({ enemy, breakThreshold }: ChainGaugeProps) {
  const { chainGauge, isBreaking, breakTimer } = enemy;
  const pct = Math.min(100, (chainGauge / breakThreshold) * 100);
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
            backgroundColor: isBreaking ? '#ff6600' : chainGauge >= breakThreshold * 0.8 ? '#ffcc00' : '#4488ff',
          }}
        />
        <div className="chain-threshold-marker" style={{ left: '100%' }} />
      </div>
    </div>
  );
}
