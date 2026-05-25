import type { EnemyInstance } from '../../types';
import { calcChainBonus, getChainTier, BREAK_GAUGE_MAX, CHAIN_TIERS } from '../../systems/chain';

const DEFAULT_BREAK_AT = 300;

interface ChainGaugeProps {
  enemy: EnemyInstance;
}

export function ChainGauge({ enemy }: ChainGaugeProps) {
  const { chainGauge, isBreaking, breakTimer } = enemy;
  const breakAt = enemy.chainResistMax ?? DEFAULT_BREAK_AT;

  const pct = isBreaking
    ? (chainGauge / BREAK_GAUGE_MAX) * 100
    : Math.min(100, (chainGauge / breakAt) * 100);

  const multiplier = calcChainBonus(chainGauge).toFixed(2);
  const tier = getChainTier(chainGauge);

  // ブレイク中: 段階に応じた色、通常: 段階色 or 青
  const fillColor = isBreaking ? tier.color : (chainGauge >= breakAt * 0.8 ? '#ffcc00' : '#4488ff');

  return (
    <div className={`chain-gauge ${isBreaking ? 'breaking' : ''} chain-tier-${tier.tier}`}>
      <div className="chain-label">
        {isBreaking ? (
          <span className="break-text">
            BREAK! ×{multiplier} ({Math.ceil(breakTimer)}s)
            {tier.tier > 0 && <span className="chain-tier-badge" style={{ color: tier.color }}> [{tier.label}]</span>}
          </span>
        ) : (
          <span>チェーン {chainGauge.toFixed(0)}% | ×{multiplier}</span>
        )}
      </div>
      <div className="chain-bar">
        <div
          className="chain-fill"
          style={{ width: `${Math.min(100, pct)}%`, backgroundColor: fillColor }}
        />
        {/* ブレイク中: 段階閾値マーカー */}
        {isBreaking && CHAIN_TIERS.slice(0, -1).map(t => (
          <div
            key={t.tier}
            className="chain-tier-marker"
            style={{ left: `${(t.threshold / BREAK_GAUGE_MAX) * 100}%`, borderColor: t.color }}
          />
        ))}
        <div className="chain-threshold-marker" style={{ left: '100%' }} />
      </div>
    </div>
  );
}
