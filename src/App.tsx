import { useState, useCallback, useEffect } from 'react';
import type { SaveData, BattleState, GameScreen, DropItem } from './types';
import { buildInitialSaveData, createCharacterInstance, createEnemyInstance } from './systems/gameState';
import { loadFromCache, syncToCache } from './systems/save';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { BattleScreen } from './components/BattleScreen';
import { ResultScreen } from './components/ResultScreen';
import { EnhanceScreen } from './components/EnhanceScreen';
import { ShopScreen } from './components/ShopScreen';
import { STAGE_WAVES, getEnemyById } from './data/enemies';
import './App.css';

function buildBattleState(saveData: SaveData): { state: BattleState; waveEnemyIds: string[][] } {
  const inventory = saveData.progress.inventory;
  const party = saveData.player.party.map(id => {
    const charSave = saveData.player.roster.find(r => r.id === id);
    return createCharacterInstance(id, charSave, inventory);
  });

  const stageIdx = Math.min(saveData.progress.currentStage - 1, STAGE_WAVES.length - 1);
  const waveConfig = STAGE_WAVES[stageIdx] ?? STAGE_WAVES[0];
  const waveEnemyIds = waveConfig.waves;
  const enemies = waveEnemyIds[0].map((enemyId, idx) => createEnemyInstance(enemyId, idx));

  const paradigm = saveData.paradigms[0];
  const partyWithRoles = party.map((char, idx) => ({
    ...char,
    currentRole: paradigm?.roles[idx] ?? char.currentRole,
  }));

  return {
    state: {
      phase: 'battle',
      party: partyWithRoles,
      enemies,
      paradigms: saveData.paradigms,
      activeParadigm: 0,
      actionLog: [],
      elapsed: 0,
      waveIndex: 0,
      breakCount: 0,
    },
    waveEnemyIds,
  };
}

function calcBattleRewards(state: BattleState): { gil: number; drops: DropItem[] } {
  let gil = 0;
  const drops: DropItem[] = [];

  for (const enemy of state.enemies) {
    if (enemy.currentHP > 0) continue;
    const data = getEnemyById(enemy.dataId);
    if (!data) continue;

    gil += data.gilReward;
    gil += state.breakCount * 50;
    if (state.elapsed < 30) gil += 200;
    else if (state.elapsed < 60) gil += 100;

    for (const drop of data.dropTable.common) {
      if (Math.random() < drop.rate) {
        drops.push({ type: 'material', itemId: drop.itemId, quantity: 1 });
      }
    }
    for (const drop of data.dropTable.uncommon) {
      if (Math.random() < drop.rate) {
        drops.push({ type: 'material', itemId: drop.itemId, quantity: 1 });
      }
    }
    if (enemy.breakTimer > 0 || !enemy.isBreaking) {
      for (const drop of data.dropTable.rare) {
        if (Math.random() < drop.rate) {
          drops.push({ type: 'material', itemId: drop.itemId, quantity: 1 });
        }
      }
    }
  }

  return { gil, drops };
}

function mergeDrops(
  existing: { itemId: string; quantity: number }[],
  drops: DropItem[],
): { itemId: string; quantity: number }[] {
  const map = new Map(existing.map(m => [m.itemId, m.quantity]));
  for (const drop of drops) {
    map.set(drop.itemId, (map.get(drop.itemId) ?? 0) + drop.quantity);
  }
  return Array.from(map.entries()).map(([itemId, quantity]) => ({ itemId, quantity }));
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [saveData, setSaveData] = useState<SaveData>(() => buildInitialSaveData());
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [waveEnemyIds, setWaveEnemyIds] = useState<string[][]>([]);
  const [lastRewards, setLastRewards] = useState<{ gil: number; drops: DropItem[] }>({ gil: 0, drops: [] });
  const [cacheChecked, setCacheChecked] = useState(false);
  const [showCachePrompt, setShowCachePrompt] = useState(false);

  useEffect(() => {
    if (cacheChecked) return;
    setCacheChecked(true);
    const cached = loadFromCache();
    if (cached) {
      setShowCachePrompt(true);
    } else {
      setScreen('home');
    }
  }, [cacheChecked]);

  const handleLoad = useCallback((data: SaveData) => {
    setSaveData(data);
    setScreen('home');
  }, []);

  const handleSetupStart = useCallback((updatedSave: SaveData) => {
    setSaveData(updatedSave);
    const { state, waveEnemyIds: waves } = buildBattleState(updatedSave);
    setBattleState(state);
    setWaveEnemyIds(waves);
    setScreen('battle');
  }, []);

  const handleVictory = useCallback((finalState: BattleState) => {
    const rewards = calcBattleRewards(finalState);
    setLastRewards(rewards);
    setSaveData(prev => {
      const updated: SaveData = {
        ...prev,
        progress: {
          ...prev.progress,
          inventory: {
            ...prev.progress.inventory,
            gil: prev.progress.inventory.gil + rewards.gil,
            materials: mergeDrops(prev.progress.inventory.materials, rewards.drops),
          },
          clearedStages: prev.progress.clearedStages.includes(prev.progress.currentStage)
            ? prev.progress.clearedStages
            : [...prev.progress.clearedStages, prev.progress.currentStage],
          currentStage: Math.min(prev.progress.currentStage + 1, STAGE_WAVES.length),
        },
      };
      syncToCache(updated);
      return updated;
    });
    setBattleState(finalState);
    setScreen('result');
  }, []);

  const handleDefeat = useCallback(() => {
    setLastRewards({ gil: 0, drops: [] });
    setScreen('result');
  }, []);

  // Cache prompt
  if (screen === 'title' && showCachePrompt) {
    return (
      <div className="title-screen">
        <h1 className="game-title">EmojiParadigm</h1>
        <p className="subtitle">前回のデータが見つかりました</p>
        <button className="btn-primary btn-large" onClick={() => {
          const cached = loadFromCache();
          if (cached) setSaveData(cached);
          setShowCachePrompt(false);
          setScreen('home');
        }}>続きから始める</button>
        <button className="btn-secondary" onClick={() => {
          setSaveData(buildInitialSaveData());
          setShowCachePrompt(false);
          setScreen('home');
        }}>新規ゲーム</button>
      </div>
    );
  }

  if (screen === 'title') {
    return (
      <div className="title-screen">
        <h1 className="game-title">EmojiParadigm</h1>
        <p className="subtitle">FF13風リアルタイムオートRPG</p>
        <button className="btn-primary btn-large" onClick={() => setScreen('home')}>
          スタート
        </button>
      </div>
    );
  }

  if (screen === 'home') {
    return (
      <HomeScreen
        saveData={saveData}
        onNavigate={setScreen}
        onLoad={handleLoad}
      />
    );
  }

  if (screen === 'setup') {
    return (
      <SetupScreen
        saveData={saveData}
        onStart={handleSetupStart}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'battle' && battleState) {
    return (
      <BattleScreen
        initialState={battleState}
        waveEnemyIds={waveEnemyIds}
        onVictory={handleVictory}
        onDefeat={handleDefeat}
        onEscape={() => setScreen('home')}
      />
    );
  }

  if (screen === 'result' && battleState) {
    return (
      <ResultScreen
        state={battleState}
        gil={lastRewards.gil}
        drops={lastRewards.drops}
        onContinue={() => setScreen('home')}
        onRetry={() => {
          const { state, waveEnemyIds: waves } = buildBattleState(saveData);
          setBattleState(state);
          setWaveEnemyIds(waves);
          setScreen('battle');
        }}
      />
    );
  }

  if (screen === 'enhance') {
    return (
      <EnhanceScreen
        saveData={saveData}
        onUpdate={setSaveData}
        onBack={() => setScreen('home')}
      />
    );
  }

  if (screen === 'shop') {
    return (
      <ShopScreen
        saveData={saveData}
        onUpdate={setSaveData}
        onBack={() => setScreen('home')}
      />
    );
  }

  return null;
}
