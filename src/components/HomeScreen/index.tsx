import { useState } from 'react';
import type { SaveData, GameScreen } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { getEquipmentById } from '../../data/equipment';
import { getRoleEmoji } from '../../systems/paradigm';
import { SaveLoadPanel } from '../SaveLoadPanel';
import { STAGE_WAVES } from '../../data/enemies';

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
    const weaponInstanceId = charSave?.equipment?.weapon ?? null;
    const weaponInst = weaponInstanceId
      ? saveData.progress.inventory.equipments.find(e => e.instanceId === weaponInstanceId)
      : null;
    const weaponData = weaponInst ? getEquipmentById(weaponInst.itemId) : null;
    // 全ロール（固有 + クリスタル解放済み）
    const innateRoles = charData?.roles ?? [];
    const extraRoles = (charSave?.unlockedRoles ?? innateRoles).filter(r => !innateRoles.includes(r));
    const allRoles = [...innateRoles, ...extraRoles];
    const roleLevelMap = charSave?.roleLevels ?? {};
    return {
      charData,
      charSave,
      level: charSave?.level ?? 1,
      weaponEmoji: weaponData?.emoji ?? null,
      weaponName: weaponData?.name ?? null,
      allRoles,
      roleLevelMap,
    };
  });

  const paradigm0 = saveData.paradigms[0];
  const stageLabel = clearedStages.length > 0
    ? `Stage ${Math.max(...clearedStages)} クリア済`
    : `Stage 1 挑戦中`;
  const unlockedCount = saveData.progress.unlockedCharacters.length;
  const ngCount = ngPlus ?? 0;

  // 過去NG難易度を選択中なら全ステージ開放
  const viewingNg = selectedNgPlus ?? ngCount;
  const showAllStages = ngCount > 0 && viewingNg < ngCount;
  const maxVisibleStage = showAllStages ? STAGE_WAVES.length : currentStage;

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="game-title">🎮 EmojiParadigm</h1>
        <p>しっかりパクリだよ</p>
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

            {/* キャラ一覧（全ロール・ロールレベル付き） */}
            <div className="party-card-members">
              {partyMembers.map(({ charData, level, weaponEmoji, weaponName, allRoles, roleLevelMap }) => charData ? (
                <div key={charData.id} className="party-card-member">
                  <span className="pc-emoji">{charData.emoji}</span>
                  <div className="pc-info">
                    <span className="pc-name">{charData.name}</span>
                    <span className="pc-level">Lv.{level}</span>
                    <div className="pc-role-list">
                      {allRoles.map(role => (
                        <span key={role} className={`pc-role-badge role-color-${role.toLowerCase()}`}>
                          {getRoleEmoji(role)} Lv.{roleLevelMap[role] ?? 1}
                        </span>
                      ))}
                    </div>
                    {weaponName && (
                      <span className="pc-weapon">{weaponEmoji} {weaponName}</span>
                    )}
                  </div>
                </div>
              ) : null)}
            </div>

            {/* 獲得数・NG数 */}
            <div className="party-card-meta">
              <span className="pc-meta-item">👥 キャラ {unlockedCount}人解放</span>
              {ngCount > 0 && <span className="pc-meta-item">🔁 NG+{ngCount}</span>}
            </div>

            {/* オプティマ名のみ下に表示 */}
            {paradigm0 && (
              <div className="party-card-paradigm">
                <span className="pc-paradigm-label">オプティマ: {paradigm0.name}</span>
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
          {Array.from({ length: STAGE_WAVES.length }, (_, i) => i + 1).map(s => {
            if (s > maxVisibleStage) return null;
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
        {showAllStages && (
          <div className="ng-all-stages-note">過去NG難易度：全ステージ挑戦可能</div>
        )}
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

        <div className="home-menu-row">
          <button className="home-btn card-btn" onClick={() => setShowCard(true)}>
            <span>📸</span>
            <span>パーティカード</span>
          </button>
          <button className="home-btn" onClick={() => onNavigate('tutorial')}>
            <span>❓</span>
            <span>ヘルプ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
