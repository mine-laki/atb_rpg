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
  waveEnemyIds: string[][];
  onVictory: (state: BattleState) => void;
  onDefeat: () => void;
  onEscape: () => void;
  ngPlus?: number;
}

export function BattleScreen({ initialState, waveEnemyIds, onVictory, onDefeat, onEscape, ngPlus = 0 }: BattleScreenProps) {
  const [state, setState] = useState<BattleState>(initialState);
  const [isRunning, setIsRunning] = useState(true);
  const [waveTransition, setWaveTransition] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const resultCalledRef = useRef(false);
  const wasRunningBeforeModalRef = useRef(false);

  const handleStateUpdate = useCallback((updater: (prev: BattleState) => BattleState) => {
    setState(prev => {
      const next = updater(prev);

      if (next.phase === 'victory' && prev.phase !== 'victory') {
        setIsRunning(false);
        const nextWave = next.waveIndex + 1;

        if (nextWave < waveEnemyIds.length) {
          setWaveTransition(true);
          setTimeout(() => {
            const enemies = waveEnemyIds[nextWave].map((id, i) => createEnemyInstance(id, i, ngPlus));
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
    const wasRunning = isRunning;
    setIsRunning(false);
    setState(prev => {
      const paradigm = prev.paradigms[slot];
      if (!paradigm) return prev;
      return { ...prev, party: switchParadigm(prev.party, paradigm), activeParadigm: slot };
    });
    if (wasRunning) {
      setTimeout(() => setIsRunning(true), 50);
    }
  }, [isRunning]);

  const handleUseItem = useCallback((itemId: string) => {
    setState(prev => {
      if (prev.phase !== 'battle') return prev;
      const itemEntry = prev.battleItems.find(b => b.itemId === itemId);
      if (!itemEntry || itemEntry.quantity <= 0) return prev;
      const itemData = getItemById(itemId);
      if (!itemData || !itemData.healPercent) return prev;

      const newParty = prev.party.map(char => {
        if (!char.isAlive) return char;
        const heal = Math.floor(char.maxHP * itemData.healPercent!);
        return { ...char, currentHP: Math.min(char.maxHP, char.currentHP + heal) };
      });

      const newBattleItems = prev.battleItems.map(b =>
        b.itemId === itemId ? { ...b, quantity: b.quantity - 1 } : b
      );

      return { ...prev, party: newParty, battleItems: newBattleItems };
    });
  }, []);

  const openLogModal = useCallback(() => {
    wasRunningBeforeModalRef.current = isRunning;
    setIsRunning(false);
    setShowLogModal(true);
  }, [isRunning]);

  const closeLogModal = useCallback(() => {
    setShowLogModal(false);
    if (wasRunningBeforeModalRef.current) {
      setIsRunning(true);
    }
  }, []);

  const totalWaves = waveEnemyIds.length;

  return (
    <div className="battle-screen">
      {/* オーバーレイ */}
      {state.phase === 'victory' && !waveTransition && (
        <div className="phase-overlay victory">勝利!</div>
      )}
      {state.phase === 'defeat' && (
        <div className="phase-overlay defeat">敗北...</div>
      )}
      {waveTransition && (
        <div className="phase-overlay wave-clear">Wave クリア!</div>
      )}

      {/* ログモーダル */}
      {showLogModal && (
        <div className="log-modal-overlay" onClick={closeLogModal}>
          <div className="log-modal" onClick={e => e.stopPropagation()}>
            <div className="log-modal-header">
              <span>バトルログ</span>
              <button className="log-modal-close" onClick={closeLogModal}>✕</button>
            </div>
            <div className="log-modal-body">
              <ActionLog entries={state.actionLog} />
            </div>
          </div>
        </div>
      )}

      {/* 敵エリア */}
      <div className="enemy-area">
        {state.enemies.map(enemy => (
          <EnemyCard key={enemy.id} enemy={enemy} />
        ))}
        {state.enemies.length === 0 && state.phase === 'battle' && (
          <div className="loading-text">...</div>
        )}
      </div>

      {/* パーティエリア */}
      <div className="party-area">
        {state.party.map(char => (
          <CharacterCard key={char.id} char={char} />
        ))}
      </div>

      {/* バトルログ（PCサイドバー） */}
      <div className="battle-log-sidebar">
        <div className="battle-log-sidebar-header">📋 バトルログ</div>
        <ActionLog entries={state.actionLog} />
      </div>

      {/* 作戦パネル */}
      <ParadigmPanel
        paradigms={state.paradigms}
        activeSlot={state.activeParadigm}
        onSwitch={handleParadigmSwitch}
        disabled={state.phase !== 'battle' || waveTransition}
      />

      {/* バトルアイテム */}
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

      {/* コントロールバー */}
      <div className="battle-controls">
        <button className="btn-escape" onClick={() => { setIsRunning(false); onEscape(); }}>
          逃げる
        </button>
        <button className="btn-log" onClick={openLogModal} title="バトルログ">
          📋
        </button>
        <button className="btn-pause" onClick={() => setIsRunning(r => !r)}>
          {isRunning ? '⏸' : '▶'}
        </button>
        <div className="battle-timer">
          <span className="wave-label">Wave {state.waveIndex + 1}/{totalWaves}</span>
          {Math.floor(state.elapsed / 60).toString().padStart(2, '0')}:
          {Math.floor(state.elapsed % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
