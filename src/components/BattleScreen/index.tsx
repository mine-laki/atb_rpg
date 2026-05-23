import { useState, useCallback } from 'react';
import type { BattleState } from '../../types';
import { CharacterCard } from '../CharacterCard';
import { EnemyCard } from '../EnemyCard';
import { ParadigmPanel } from '../ParadigmPanel';
import { ActionLog } from '../ActionLog';
import { useBattleLoop } from '../../hooks/useBattleLoop';
import { switchParadigm } from '../../systems/paradigm';

interface BattleScreenProps {
  initialState: BattleState;
  onVictory: (state: BattleState) => void;
  onDefeat: () => void;
  onEscape: () => void;
}

export function BattleScreen({ initialState, onVictory, onDefeat, onEscape }: BattleScreenProps) {
  const [state, setState] = useState<BattleState>(initialState);
  const [isRunning, setIsRunning] = useState(true);

  const handleStateUpdate = useCallback((updater: (prev: BattleState) => BattleState) => {
    setState(prev => {
      const next = updater(prev);
      if (next.phase === 'victory' && prev.phase !== 'victory') {
        setTimeout(() => onVictory(next), 1500);
        setIsRunning(false);
      }
      if (next.phase === 'defeat' && prev.phase !== 'defeat') {
        setTimeout(() => onDefeat(), 1500);
        setIsRunning(false);
      }
      return next;
    });
  }, [onVictory, onDefeat]);

  useBattleLoop({ state, onStateUpdate: handleStateUpdate, isRunning });

  const handleParadigmSwitch = useCallback((slot: number) => {
    setState(prev => {
      const paradigm = prev.paradigms[slot];
      if (!paradigm) return prev;
      const newParty = switchParadigm(prev.party, paradigm);
      return { ...prev, party: newParty, activeParadigm: slot };
    });
  }, []);

  const aliveEnemies = state.enemies.filter(e => e.currentHP > 0);

  return (
    <div className="battle-screen">
      {/* Phase overlay */}
      {state.phase === 'victory' && (
        <div className="phase-overlay victory">勝利!</div>
      )}
      {state.phase === 'defeat' && (
        <div className="phase-overlay defeat">敗北...</div>
      )}

      {/* Party area */}
      <div className="party-area">
        {state.party.map(char => (
          <CharacterCard key={char.id} char={char} />
        ))}
      </div>

      {/* Enemy area */}
      <div className="enemy-area">
        {aliveEnemies.map(enemy => (
          <EnemyCard key={enemy.id} enemy={enemy} />
        ))}
        {aliveEnemies.length === 0 && state.phase === 'battle' && (
          <div className="loading-text">次の波を準備中...</div>
        )}
      </div>

      {/* Paradigm panel */}
      <ParadigmPanel
        paradigms={state.paradigms}
        activeSlot={state.activeParadigm}
        onSwitch={handleParadigmSwitch}
        disabled={state.phase !== 'battle'}
      />

      {/* Action log */}
      <ActionLog entries={state.actionLog} />

      {/* Battle controls */}
      <div className="battle-controls">
        <button
          className="btn-escape"
          onClick={() => { setIsRunning(false); onEscape(); }}
        >
          逃げる
        </button>
        <button
          className="btn-pause"
          onClick={() => setIsRunning(r => !r)}
        >
          {isRunning ? '一時停止' : '再開'}
        </button>
        <div className="battle-timer">
          {Math.floor(state.elapsed / 60).toString().padStart(2, '0')}:
          {Math.floor(state.elapsed % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
