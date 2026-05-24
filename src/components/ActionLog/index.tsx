import type { ActionLogEntry } from '../../types';

interface ActionLogProps {
  entries: ActionLogEntry[];
  maxEntries?: number;
}

export function ActionLog({ entries, maxEntries }: ActionLogProps) {
  const shown = maxEntries != null ? entries.slice(0, maxEntries) : entries;
  return (
    <div className="action-log">
      {shown.map(entry => (
        <div key={entry.id} className={`log-entry log-${entry.type}`}>
          <span className="log-actor">{entry.actorEmoji} {entry.actorName}</span>
          {' → '}
          <span className="log-target">{entry.targetName}</span>
          {' '}
          <span className="log-ability">{entry.abilityName}</span>
          {entry.value > 0 && (
            <span className={`log-value ${entry.type}`}>
              {entry.type === 'heal' ? '+' : '-'}
              {entry.value.toLocaleString()}
              {entry.type === 'heal' ? 'HP' : ''}
            </span>
          )}
          {entry.isBreak && <span className="break-badge"> BREAK!</span>}
        </div>
      ))}
    </div>
  );
}
