import { useState } from 'react';
import type { SaveData, GameScreen } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { getEquipmentById } from '../../data/equipment';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';
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
  selectedNgPlus?: number | null;
  onSelectNgPlus?: (ng: number | null) => void;
}

function formatPlayTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}時間 ${m}分`;
  if (m > 0) return `${m}分 ${s}秒`;
  return `${s}秒`;
}

export function HomeScreen({ saveData, onNavigate, onLoad, clearedStages, currentStage, selectedStage, onSelectStage, ngPlus, selectedNgPlus, onSelectNgPlus }: HomeScreenProps) {
  const [showCard, setShowCard] = useState(false);
  const playTime = saveData.progress.playTime ?? 0;

  // パーティメンバー情報を取得
  const partyMembers = saveData.player.party.map(id => {
    const charData = CHARACTERS.find(c => c.id === id);
    const charSave = saveData.player.roster.find(r => r.id === id);
    // 武器情報
    const weaponInstanceId = charSave?.equipment?.weapon ?? null;
    const weaponInst = weaponInstanceId
      ? saveData.progress.inventory.equipments.find(e => e.instanceId === weaponInstanceId)
      : null;
    const weaponData = weaponInst ? getEquipmentById(weaponInst.itemId) : null;
    return {
      charData,
      level: charSave?.level ?? 1,
      weaponEmoji: weaponData?.emoji ?? null,
      weaponName: weaponData?.name ?? null,
    };
  });

  // パーティカード用: パラダイム0のロール
  const paradigm0 = saveData.paradigms[0];
  const stageLabel = clearedStages.length > 0
    ? `Stage ${Math.max(...clearedStages)} クリア済`
    : `Stage 1 挑戦中`;

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

      {/* パーティ表示 */}
      <div className="home-party">
        {partyMembers.map(({ charData, level }) => charData ? (
          <div key={charData.id} className="home-party-member">
            <span className="home-party-emoji">{charData.emoji}</span>
            <span className="home-party-name">{charData.name}</span>
            <span className="home-party-level">Lv.{level}</span>
          </div>
        ) : null)}
      </div>

      {/* パーティカードモーダル */}
      {showCard && (
        <div className="party-card-overlay" onClick={() => setShowCard(false)}>
          <div className="party-card" onClick={e => e.stopPropagation()}>
            <div className="party-card-title">🎮 EmojiParadigm</div>
            <div className="party-card-stage">{stageLabel}</div>
            <div className="party-card-members">
              {partyMembers.map(({ charData, level, weaponEmoji, weaponName }) => charData ? (
                <div key={charData.id} className="party-card-member">
                  <span className="pc-emoji">{charData.emoji}</span>
                  <div className="pc-info">
                    <span className="pc-name">{charData.name}</span>
                    <span className="pc-level">Lv.{level}</span>
                    {weaponName && (
                      <span className="pc-weapon">{weaponEmoji} {weaponName}</span>
                    )}
                  </div>
                </div>
              ) : null)}
            </div>
            {paradigm0 && (
              <div className="party-card-paradigm">
                <span className="pc-paradigm-label">オプティマ 0: {paradigm0.name}</span>
                <div className="pc-paradigm-roles">
                  {paradigm0.roles.map((role, i) => (
                    <span key={i} className="pc-role-badge">
                      {getRoleEmoji(role as any)} {getRoleLabel(role as any)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="party-card-hint">📸 スクリーンショットで保存できます</div>
            <button className="party-card-close" onClick={() => setShowCard(false)}>✕ 閉じる</button>
          </div>
        </div>
      )}

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
        {(ngPlus ?? 0) > 0 && (
          <div className="ng-selector">
            <span className="ng-selector-label">難易度 (NG+)</span>
            <div className="ng-selector-btns">
              {Array.from({ length: (ngPlus ?? 0) + 1 }, (_, i) => i).map(n => {
                const isActive = (selectedNgPlus ?? ngPlus ?? 0) === n;
                return (
                  <button
                    key={n}
                    className={`ng-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectNgPlus?.(n === (ngPlus ?? 0) ? null : n)}
                  >
                    {n === 0 ? 'NG' : `NG+${n}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {ngPlus ? <div className="ng-plus-badge">NG+{selectedNgPlus ?? ngPlus}</div> : null}
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

        <button className="home-btn card-btn" onClick={() => setShowCard(true)}>
          <span>📸</span>
          <span>パーティカード</span>
        </button>
      </div>
    </div>
  );
}
