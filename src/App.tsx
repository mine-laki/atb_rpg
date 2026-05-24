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
import { EnemyReportScreen } from './components/EnemyReportScreen';
import { STAGE_WAVES, getEnemyById } from './data/enemies';
import './App.css';

function buildBattleState(saveData: SaveData, stageOverride?: number, ngPlusOverride?: number): { state: BattleState; waveEnemyIds: string[][] } {
  const inventory = saveData.progress.inventory;
  const party = saveData.player.party.map(id => {
    const charSave = saveData.player.roster.find(r => r.id === id);
    return createCharacterInstance(id, charSave, inventory);
  });

  const stageIdx = Math.min(
    (stageOverride ?? saveData.progress.currentStage) - 1,
    STAGE_WAVES.length - 1
  );
  const waveConfig = STAGE_WAVES[stageIdx] ?? STAGE_WAVES[0];
  const waveEnemyIds = waveConfig.waves;
  const ngPlus = ngPlusOverride ?? saveData.newGamePlus ?? 0;
  const enemies = waveEnemyIds[0].map((enemyId, idx) => createEnemyInstance(enemyId, idx, ngPlus));

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
      battleItems: saveData.progress.inventory.battleItems ?? [],
    },
    waveEnemyIds,
  };
}

function calcBattleRewards(state: BattleState, ngPlus: number = 0): { gil: number; drops: DropItem[] } {
  let gil = 0;
  const drops: DropItem[] = [];
  const ngMult = 1 + 0.5 * ngPlus;

  for (const enemy of state.enemies) {
    if (enemy.currentHP > 0) continue;
    const data = getEnemyById(enemy.dataId);
    if (!data) continue;

    gil += data.gilReward;
    gil += state.breakCount * 50;
    if (state.elapsed < 30) gil += 200;
    else if (state.elapsed < 60) gil += 100;

    for (const drop of data.dropTable.common) {
      if (Math.random() < drop.rate * ngMult) {
        drops.push({ type: drop.dropType ?? 'material', itemId: drop.itemId, quantity: 1 });
      }
    }
    for (const drop of data.dropTable.uncommon) {
      if (Math.random() < drop.rate * ngMult) {
        drops.push({ type: drop.dropType ?? 'material', itemId: drop.itemId, quantity: 1 });
      }
    }
    if (enemy.breakTimer > 0 || !enemy.isBreaking) {
      for (const drop of data.dropTable.rare) {
        if (Math.random() < drop.rate * ngMult) {
          drops.push({ type: drop.dropType ?? 'material', itemId: drop.itemId, quantity: 1 });
        }
      }
    }
  }

  gil = Math.floor(gil * ngMult);

  return { gil, drops };
}

function mergeDrops(
  existing: { itemId: string; quantity: number }[],
  drops: DropItem[],
): { itemId: string; quantity: number }[] {
  const map = new Map(existing.map(m => [m.itemId, m.quantity]));
  for (const drop of drops) {
    if (drop.type === 'material' || drop.type === 'fragment') {
      map.set(drop.itemId, (map.get(drop.itemId) ?? 0) + drop.quantity);
    }
  }
  return Array.from(map.entries()).map(([itemId, quantity]) => ({ itemId, quantity }));
}

function buildEquipmentDrops(drops: DropItem[]): import('./types').EquipmentInstance[] {
  return drops
    .filter(d => d.type === 'equipment')
    .map(d => ({
      instanceId: `${d.itemId}_drop_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      itemId: d.itemId,
      enhanceLevel: 0,
    }));
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [saveData, setSaveData] = useState<SaveData>(() => buildInitialSaveData());
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [waveEnemyIds, setWaveEnemyIds] = useState<string[][]>([]);
  const [lastRewards, setLastRewards] = useState<{ gil: number; drops: DropItem[] }>({ gil: 0, drops: [] });
  const [cacheChecked, setCacheChecked] = useState(false);
  const [showCachePrompt, setShowCachePrompt] = useState(false);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [selectedNgPlus, setSelectedNgPlus] = useState<number | null>(null);

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
    const ngPlus = selectedNgPlus ?? updatedSave.newGamePlus ?? 0;
    const { state, waveEnemyIds: waves } = buildBattleState(updatedSave, selectedStage ?? undefined, ngPlus);
    setBattleState(state);
    setWaveEnemyIds(waves);
    setScreen('battle');
  }, [selectedStage, selectedNgPlus]);

  const handleVictory = useCallback((finalState: BattleState) => {
    const ngPlus = saveData.newGamePlus ?? 0;
    const rewards = calcBattleRewards(finalState, ngPlus);
    // リザルト画面表示用（換金分はsetSaveData内で計算するためここでは仮セット）
    setLastRewards(rewards);
    setSaveData(prev => {
      const isNewStageRecord = !selectedStage || selectedStage >= prev.progress.currentStage;
      const battleedStage = selectedStage ?? prev.progress.currentStage;
      const newClearedStages = prev.progress.clearedStages.includes(battleedStage)
        ? prev.progress.clearedStages
        : [...prev.progress.clearedStages, battleedStage];
      const nextStage = isNewStageRecord
        ? Math.min(prev.progress.currentStage + 1, STAGE_WAVES.length)
        : prev.progress.currentStage;

      // NG+ check: all stages cleared and at max stage
      const allCleared = newClearedStages.length >= STAGE_WAVES.length;
      const isNGPlusTrigger = allCleared && isNewStageRecord && nextStage > STAGE_WAVES.length - 1;
      const newNGPlus = isNGPlusTrigger ? (prev.newGamePlus ?? 0) + 1 : (prev.newGamePlus ?? 0);
      const resetStage = isNGPlusTrigger ? 1 : nextStage;

      // Update encountered enemies
      const newEncountered = [...(prev.progress.encounteredEnemies ?? [])];
      for (const enemy of finalState.enemies) {
        if (!newEncountered.includes(enemy.dataId)) newEncountered.push(enemy.dataId);
      }

      // 取得済みキャラのフラグメントを 500gil に自動換金
      const FRAGMENT_SELL_GIL = 500;
      let bonusGil = 0;
      const filteredDrops = rewards.drops.filter(drop => {
        if (drop.type !== 'fragment' && !drop.itemId.startsWith('fragment_')) return true;
        const charId = drop.itemId.replace('fragment_', '');
        if (prev.progress.unlockedCharacters.includes(charId)) {
          bonusGil += FRAGMENT_SELL_GIL * drop.quantity;
          return false; // インベントリには追加しない
        }
        return true;
      });

      const equipDrops = buildEquipmentDrops(filteredDrops);
      const updated: SaveData = {
        ...prev,
        newGamePlus: newNGPlus,
        progress: {
          ...prev.progress,
          inventory: {
            ...prev.progress.inventory,
            gil: prev.progress.inventory.gil + rewards.gil + bonusGil,
            materials: mergeDrops(prev.progress.inventory.materials, filteredDrops),
            equipments: [...prev.progress.inventory.equipments, ...equipDrops],
            battleItems: finalState.battleItems,
          },
          clearedStages: isNewStageRecord ? newClearedStages : prev.progress.clearedStages,
          currentStage: resetStage,
          playTime: prev.progress.playTime + Math.floor(finalState.elapsed),
          encounteredEnemies: newEncountered,
        },
      };
      syncToCache(updated);
      return updated;
    });
    setBattleState(finalState);
    setScreen('result');
  }, [selectedStage, saveData.newGamePlus]);

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
        clearedStages={saveData.progress.clearedStages}
        currentStage={saveData.progress.currentStage}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        ngPlus={saveData.newGamePlus}
        selectedNgPlus={selectedNgPlus}
        onSelectNgPlus={setSelectedNgPlus}
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
        ngPlus={selectedNgPlus ?? saveData.newGamePlus ?? 0}
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
          const ngPlus = selectedNgPlus ?? saveData.newGamePlus ?? 0;
          const { state, waveEnemyIds: waves } = buildBattleState(saveData, selectedStage ?? undefined, ngPlus);
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

  if (screen === 'enemyReport') {
    return (
      <EnemyReportScreen
        encounteredEnemies={saveData.progress.encounteredEnemies ?? []}
        onBack={() => setScreen('home')}
      />
    );
  }

  return null;
}
