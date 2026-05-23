import type { SaveData, GameScreen } from '../../types';
import { SaveLoadPanel } from '../SaveLoadPanel';

interface HomeScreenProps {
  saveData: SaveData;
  onNavigate: (screen: GameScreen) => void;
  onLoad: (data: SaveData) => void;
}

function formatPlayTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}時間 ${m}分`;
  if (m > 0) return `${m}分 ${s}秒`;
  return `${s}秒`;
}

export function HomeScreen({ saveData, onNavigate, onLoad }: HomeScreenProps) {
  const clearedStages = saveData.progress.clearedStages;
  const currentStage = saveData.progress.currentStage;
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

      <div className="home-menu">
        <button className="home-btn battle" onClick={() => onNavigate('setup')}>
          <span>⚔️</span>
          <span>バトル開始</span>
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
        </div>
      </div>
    </div>
  );
}
