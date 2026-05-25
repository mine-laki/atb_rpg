import type { ParadigmData } from '../../types';
import { getRoleEmoji } from '../../systems/paradigm';

interface ParadigmPanelProps {
  paradigms: ParadigmData[];
  activeSlot: number;
  onSwitch: (slot: number) => void;
  disabled?: boolean;
}

export function ParadigmPanel({ paradigms, activeSlot, onSwitch, disabled }: ParadigmPanelProps) {
  return (
    <div className="paradigm-panel">
      <div className="paradigm-label">
        作戦切替
        <span className="paradigm-key-hint">1〜6キー</span>
      </div>
      <div className="paradigm-slots">
        {paradigms.map(p => (
          <button
            key={p.slot}
            className={`paradigm-btn ${p.slot === activeSlot ? 'active' : ''}`}
            onClick={() => onSwitch(p.slot)}
            disabled={disabled || p.slot === activeSlot}
          >
            <span className="paradigm-num">{p.slot + 1}</span>
            <span className="paradigm-name">{p.name}</span>
            <span className="paradigm-roles">
              {p.roles.map(r => getRoleEmoji(r)).join('')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
