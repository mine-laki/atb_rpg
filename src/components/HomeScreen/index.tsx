import type { SaveData, GameScreen } from '../../types';
import { SaveLoadPanel } from '../SaveLoadPanel';

interface HomeScreenProps {
  saveData: SaveData;
  onNavigate: (screen: GameScreen) => void;
  onLoad: (data: SaveData) => void;
  clearedStages: number[];
  currentStage: number;
  selectedStage: number | null;
  onSelectStage: (stage: number | null) => void;
  ngPlus?: number;
}

function formatPlayTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}時間 ${m}分`;
  if (m > 0) return `${m}分 ${s}秒`;
  return `${s}秒`;
}

export function HomeScreen({ saveData, onNavigate, onLoad, clearedStages, currentStage, selectedStage, onSelectStage, ngPlus }: HomeScreenProps) {
  const playTime = saveData.progress.playTime ?? 0;

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="game-title">🎮 EmojiParadigm</h1>
        <div className="home-meta">
          <span className="home-gil">💰 {saveData.progress.inventory.gil.toLocaleString()} Gil</span>
          {playTime > 0 && <span className="home-playtime">⏱ {formatPlayTime(playTime)}</span>}
        </div>
        <SaveLoadPanel gameData={saveData} onLoad={onLoad} />
      </div>

      <div className="home-stage-info">
        {clearedStages.length > 0
          ? `Stage ${Math.max(...clearedStages)} クリア済 / Stage ${currentStage} 挑戦中`
          : 'Stage 1 挑戦中'}
      </div>

      <div className="stage-selector">
        <h3>ステージ選択</h3>
        <div className="stage-list">
          {[1, 2, 3, 4, 5].map(s => {
            if (s > currentStage) return null;
            const isSelected = selectedStage === s || (!selectedStage && s === currentStage);
            return (
              <button
                key={s}
                className={`stage-btn ${isSelected ? 'active' : ''} ${clearedStages.includes(s) ? 'cleared' : ''}`}
                onClick={() => onSelectStage(s === currentStage && !clearedStages.includes(s) ? null : s)}
              >
                {clearedStages.includes(s) ? '★' : '►'} Stage {s}
              </button>
            );
          })}
        </div>
        {ngPlus ? <div className="ng-plus-badge">NG+{ngPlus}</div> : null}
      </div>

      <div className="home-menu">
        <button className="home-btn battle" onClick={() => onNavigate('setup')}>
          <span>⚔️</span>
          <span>バトル開始{selectedStage ? ` (Stage ${selectedStage})` : ''}</span>
        </button>

        <div className="home-menu-row">
          <button className="home-btn setup" onClick={() => onNavigate('setup')}>
            <span>👥</span>
            <span>編成</span>
          </button>
          <button className="home-btn enhance" onClick={() => onNavigate('enhance')}>
            <span>💪</span>
            <span>強化</span>
          </button>
        </div>

        <div className="home-menu-row">
          <button className="home-btn shop" onClick={() => onNavigate('shop')}>
            <span>🏪</span>
            <span>ショップ</span>
          </button>
          <button className="home-btn" onClick={() => onNavigate('enemyReport')}>
            <span>📋</span>
            <span>エネミーレポート</span>
          </button>
        </div>
      </div>
    </div>
  );
}
