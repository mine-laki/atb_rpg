import { useState, useCallback, useRef } from 'react';
import type { BattleState } from '../../types';
import { CharacterCard } from '../CharacterCard';
import { EnemyCard } from '../EnemyCard';
import { ParadigmPanel } from '../ParadigmPanel';
import { ActionLog } from '../ActionLog';
import { useBattleLoop } from '../../hooks/useBattleLoop';
import { switchParadigm } from '../../systems/paradigm';
import { createEnemyInstance } from '../../systems/gameState';
import { getItemById } from '../../data/items';

interface BattleScreenProps {
  initialState: BattleState;
  waveEnemyIds: string[][];  // wave[i] = list of enemy IDs
  onVictory: (state: BattleState) => void;
  onDefeat: () => void;
  onEscape: () => void;
}

export function BattleScreen({ initialState, waveEnemyIds, onVictory, onDefeat, onEscape }: BattleScreenProps) {
  const [state, setState] = useState<BattleState>(initialState);
  const [isRunning, setIsRunning] = useState(true);
  const [waveTransition, setWaveTransition] = useState(false);
  const resultCalledRef = useRef(false);

  const handleStateUpdate = useCallback((updater: (prev: BattleState) => BattleState) => {
    setState(prev => {
      const next = updater(prev);

      if (next.phase === 'victory' && prev.phase !== 'victory') {
        setIsRunning(false);
        const nextWave = next.waveIndex + 1;

        if (nextWave < waveEnemyIds.length) {
          // load next wave after 2s
          setWaveTransition(true);
          setTimeout(() => {
            const enemies = waveEnemyIds[nextWave].map((id, i) => createEnemyInstance(id, i));
            setState(s => ({
              ...s,
              phase: 'battle',
              enemies,
              waveIndex: nextWave,
              actionLog: [
                {
                  id: `wave_${nextWave}`,
                  timestamp: s.elapsed,
                  actorEmoji: '⚔️',
                  actorName: 'Wave',
                  targetName: '',
                  abilityName: `Wave ${nextWave + 1} 開始!`,
                  value: 0,
                  type: 'status' as const,
                },
                ...s.actionLog,
              ].slice(0, 30),
            }));
            setWaveTransition(false);
            setIsRunning(true);
          }, 2000);
        } else if (!resultCalledRef.current) {
          resultCalledRef.current = true;
          setTimeout(() => onVictory(next), 1500);
        }
      }

      if (next.phase === 'defeat' && prev.phase !== 'defeat' && !resultCalledRef.current) {
        resultCalledRef.current = true;
        setIsRunning(false);
        setTimeout(() => onDefeat(), 1500);
      }

      return next;
    });
  }, [waveEnemyIds, onVictory, onDefeat]);

  useBattleLoop({ state, onStateUpdate: handleStateUpdate, isRunning });

  const handleParadigmSwitch = useCallback((slot: number) => {
    setState(prev => {
      const paradigm = prev.paradigms[slot];
      if (!paradigm) return prev;
      const newParty = switchParadigm(prev.party, paradigm);
      return { ...prev, party: newParty, activeParadigm: slot };
    });
  }, []);

  const handleUseItem = useCallback((itemId: string) => {
    setState(prev => {
      if (prev.phase !== 'battle') return prev;
      const itemEntry = prev.battleItems.find(b => b.itemId === itemId);
      if (!itemEntry || itemEntry.quantity <= 0) return prev;
      const itemData = getItemById(itemId);
      if (!itemData || !itemData.healPercent) return prev;

      // Heal all alive party members
      const newParty = prev.party.map(char => {
        if (!char.isAlive) return char;
        const heal = Math.floor(char.maxHP * itemData.healPercent!);
        return { ...char, currentHP: Math.min(char.maxHP, char.currentHP + heal) };
      });

      // Decrement item quantity
      const newBattleItems = prev.battleItems.map(b =>
        b.itemId === itemId ? { ...b, quantity: b.quantity - 1 } : b
      );

      return { ...prev, party: newParty, battleItems: newBattleItems };
    });
  }, []);

  const aliveEnemies = state.enemies.filter(e => e.currentHP > 0);
  const totalWaves = waveEnemyIds.length;

  return (
    <div className="battle-screen">
      {/* Wave indicator */}
      <div className="wave-indicator">
        Wave {state.waveIndex + 1} / {totalWaves}
        {waveTransition && <span className="wave-transition"> — 次の波...</span>}
      </div>

      {state.phase === 'victory' && !waveTransition && (
        <div className="phase-overlay victory">勝利!</div>
      )}
      {state.phase === 'defeat' && (
        <div className="phase-overlay defeat">敗北...</div>
      )}
      {waveTransition && (
        <div className="phase-overlay wave-clear">Wave クリア!</div>
      )}

      <div className="enemy-area">
        {aliveEnemies.map(enemy => (
          <EnemyCard key={enemy.id} enemy={enemy} />
        ))}
        {aliveEnemies.length === 0 && state.phase === 'battle' && (
          <div className="loading-text">...</div>
        )}
      </div>

      <div className="party-area">
        {state.party.map(char => (
          <CharacterCard key={char.id} char={char} />
        ))}
      </div>

      <ParadigmPanel
        paradigms={state.paradigms}
        activeSlot={state.activeParadigm}
        onSwitch={handleParadigmSwitch}
        disabled={state.phase !== 'battle' || waveTransition}
      />

      <ActionLog entries={state.actionLog} />

      {/* Battle items */}
      {state.battleItems.length > 0 && (
        <div className="battle-items-row">
          {state.battleItems.map(item => {
            const data = getItemById(item.itemId);
            if (!data) return null;
            return (
              <button
                key={item.itemId}
                className="btn-battle-item"
                disabled={item.quantity <= 0 || state.phase !== 'battle'}
                onClick={() => handleUseItem(item.itemId)}
                title={data.description}
              >
                {data.emoji} {data.name} ×{item.quantity}
              </button>
            );
          })}
        </div>
      )}

      <div className="battle-controls">
        <button className="btn-escape" onClick={() => { setIsRunning(false); onEscape(); }}>
          逃げる
        </button>
        <button className="btn-pause" onClick={() => setIsRunning(r => !r)}>
          {isRunning ? '⏸' : '▶'}
        </button>
        <div className="battle-timer">
          {Math.floor(state.elapsed / 60).toString().padStart(2, '0')}:
          {Math.floor(state.elapsed % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
