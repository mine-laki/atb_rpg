import type { EnemyInstance } from '../../types';
import { getEnemyById } from '../../data/enemies';
import { ChainGauge } from '../ChainGauge';

interface EnemyCardProps {
  enemy: EnemyInstance;
}

export function EnemyCard({ enemy }: EnemyCardProps) {
  const data = getEnemyById(enemy.dataId);
  if (!data) return null;

  const isDead = enemy.currentHP <= 0;
  const hpRatio = isDead ? 0 : enemy.currentHP / enemy.maxHP;

  return (
    <div className={`enemy-card ${isDead ? 'enemy-dead' : ''}`}>
      <div className="enemy-header">
        <span className="enemy-emoji">{data.emoji}</span>
        <span className="enemy-name">{data.name}</span>
        {data.isBoss && !isDead && <span className="boss-badge">BOSS</span>}
        {isDead && <span className="enemy-defeated-badge">DEFEAT</span>}
      </div>

      <div className="enemy-hp">
        <div className="hp-bar enemy">
          <div
            className="hp-fill"
            style={{
              width: `${hpRatio * 100}%`,
              backgroundColor: hpRatio > 0.5 ? '#cc4444' : hpRatio > 0.25 ? '#ff8800' : '#ff0000',
            }}
          />
        </div>
        <span className="hp-text">
          {isDead ? '0' : enemy.currentHP.toLocaleString()}/{data.maxHP.toLocaleString()}
        </span>
      </div>

      {!isDead && <ChainGauge enemy={enemy} breakThreshold={data.breakThreshold} />}

      {!isDead && data.weaknesses.length > 0 && (
        <div className="enemy-weaknesses">
          弱点: {data.weaknesses.map(w => getElementEmoji(w)).join(' ')}
        </div>
      )}

      {!isDead && (
        <div className="enemy-status">
          {enemy.statusEffects.map(eff => (
            <span key={eff.id} className={`status-badge ${eff.type}`}>
              {eff.id} ({eff.duration.toFixed(1)}s)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function getElementEmoji(el: string): string {
  const map: Record<string, string> = {
    fire: '🔥', ice: '🧊', thunder: '⚡', wind: '🌀',
    water: '🌊', earth: '🌍', holy: '✨', dark: '🌑',
  };
  return map[el] ?? el;
}
