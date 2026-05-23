import type { SaveData, GameScreen } from '../../types';
import { SaveLoadPanel } from '../SaveLoadPanel';

interface HomeScreenProps {
  saveData: SaveData;
  onNavigate: (screen: GameScreen) => void;
  onLoad: (data: SaveData) => void;
}

export function HomeScreen({ saveData, onNavigate, onLoad }: HomeScreenProps) {
  const clearedStages = saveData.progress.clearedStages;
  const currentStage = saveData.progress.currentStage;

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="game-title">🎮 EmojiParadigm</h1>
        <div className="home-gil">💰 {saveData.progress.inventory.gil.toLocaleString()} Gil</div>
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
