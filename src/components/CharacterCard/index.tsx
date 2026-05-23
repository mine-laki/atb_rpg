import type { CharacterInstance } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { ATBGauge } from '../ATBGauge';
import { getRoleEmoji } from '../../systems/paradigm';

interface CharacterCardProps {
  char: CharacterInstance;
}

export function CharacterCard({ char }: CharacterCardProps) {
  const data = CHARACTERS.find(c => c.id === char.dataId);
  if (!data) return null;

  const hpRatio = char.currentHP / char.maxHP;
  const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#ffcc00' : '#ff4444';

  return (
    <div className={`character-card ${!char.isAlive ? 'dead' : ''}`}>
      <div className="char-header">
        <span className="char-emoji">{data.emoji}</span>
        <span className="char-name">{data.name}</span>
        <span className="char-role">{getRoleEmoji(char.currentRole)} {char.currentRole}</span>
      </div>

      <div className="char-hp">
        <div className="hp-bar">
          <div className="hp-fill" style={{ width: `${hpRatio * 100}%`, backgroundColor: hpColor }} />
        </div>
        <span className="hp-text">{char.currentHP}/{char.maxHP}</span>
      </div>

      <ATBGauge char={char} />

      <div className="char-status">
        {char.statusEffects.map(eff => (
          <span key={eff.id} className={`status-badge ${eff.type}`} title={`${eff.id} (${eff.duration.toFixed(1)}s)`}>
            {getStatusEmoji(eff.id as string)}
          </span>
        ))}
      </div>

      {char.lastActionName && (
        <div className="char-last-action">
          {char.lastActionCount && char.lastActionCount > 1
            ? `${char.lastActionName} ×${char.lastActionCount}`
            : char.lastActionName}
        </div>
      )}

      {!char.isAlive && <div className="dead-overlay">KO</div>}
    </div>
  );
}

function getStatusEmoji(id: string): string {
  const map: Record<string, string> = {
    prot: '🛡', shell: '🔮', haste: '⚡', faith: '✨', bravery: '⚔',
    guard: '🛡', regen: '🌿', veil: '💫',
    deprot: '💔', deshell: '💢', slow: '🐌', pain: '😣',
    imperil: '🔥', curse: '💀', stop: '⏹',
  };
  return map[id] ?? '?';
}
