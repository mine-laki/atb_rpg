import { useState } from 'react';
import type { SaveData, RoleId, CharacterSaveData } from '../../types';
import { CHARACTERS, getStatsAtLevel, levelUpCost } from '../../data/characters';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';

interface EnhanceScreenProps {
  saveData: SaveData;
  onUpdate: (next: SaveData) => void;
  onBack: () => void;
}

const ROLE_CRYSTAL_MAP: Record<RoleId, string> = {
  ATK: 'crystal_atk', BLA: 'crystal_bla', DEF: 'crystal_def',
  HLR: 'crystal_hlr', ENH: 'crystal_enh', JAM: 'crystal_jam',
};

function roleLevelCost(role: RoleId, currentRoleLv: number): { gil: number; crystals: number } {
  const base: Record<RoleId, number> = { ATK: 200, BLA: 200, DEF: 180, HLR: 180, ENH: 220, JAM: 220 };
  return {
    gil: Math.floor(base[role] * Math.pow(1.5, currentRoleLv - 1)),
    crystals: currentRoleLv,
  };
}

function roleBonusDesc(role: RoleId, lv: number): string {
  const descriptions: Record<RoleId, string> = {
    ATK: `物理ダメージ +${lv * 3}%`,
    BLA: `チェーンボーナス +${lv * 3}%`,
    DEF: `被ダメ軽減 +${lv * 2}%`,
    HLR: `回復量 +${lv * 4}%`,
    ENH: `バフ効果時間 +${lv * 5}%`,
    JAM: `デバフ成功率 +${lv * 5}%`,
  };
  return descriptions[role];
}

export function EnhanceScreen({ saveData, onUpdate, onBack }: EnhanceScreenProps) {
  const [selectedCharId, setSelectedCharId] = useState<string>(
    saveData.player.party[0] ?? saveData.progress.unlockedCharacters[0]
  );

  const charData = CHARACTERS.find(c => c.id === selectedCharId);
  const charSave = saveData.player.roster.find(r => r.id === selectedCharId);
  const gil = saveData.progress.inventory.gil;
  const materials = saveData.progress.inventory.materials;

  if (!charData || !charSave) return null;

  const level = charSave.level;
  const stats = getStatsAtLevel(charData, level);
  const nextStats = getStatsAtLevel(charData, level + 1);
  const lvCost = levelUpCost(level);
  const canLevelUp = level < 50 && gil >= lvCost;

  function getMaterialQty(itemId: string): number {
    return materials.find(m => m.itemId === itemId)?.quantity ?? 0;
  }

  function spendGil(amount: number, newRoster: CharacterSaveData[]): SaveData {
    return {
      ...saveData,
      progress: {
        ...saveData.progress,
        inventory: { ...saveData.progress.inventory, gil: gil - amount },
      },
      player: { ...saveData.player, roster: newRoster },
    };
  }

  function spendMaterial(itemId: string, qty: number): SaveData['progress']['inventory']['materials'] {
    return materials.map(m =>
      m.itemId === itemId ? { ...m, quantity: m.quantity - qty } : m
    ).filter(m => m.quantity > 0);
  }

  const handleLevelUp = () => {
    if (!canLevelUp) return;
    const newRoster = saveData.player.roster.map(r => {
      if (r.id !== selectedCharId) return r;
      return { ...r, level: r.level + 1, exp: 0 };
    });
    onUpdate(spendGil(lvCost, newRoster));
  };

  const handleRoleLevelUp = (role: RoleId) => {
    const currentRoleLv = charSave.roleLevels?.[role] ?? 1;
    if (currentRoleLv >= 10) return;

    const cost = roleLevelCost(role, currentRoleLv);
    const crystalId = ROLE_CRYSTAL_MAP[role];
    const crystalQty = getMaterialQty(crystalId);

    if (gil < cost.gil || crystalQty < cost.crystals) return;

    const newRoster = saveData.player.roster.map(r => {
      if (r.id !== selectedCharId) return r;
      return {
        ...r,
        roleLevels: { ...(r.roleLevels ?? {}), [role]: currentRoleLv + 1 },
      };
    });

    const newMats = spendMaterial(crystalId, cost.crystals);
    onUpdate({
      ...spendGil(cost.gil, newRoster),
      progress: {
        ...saveData.progress,
        inventory: {
          ...saveData.progress.inventory,
          gil: gil - cost.gil,
          materials: newMats,
        },
      },
      player: { ...saveData.player, roster: newRoster },
    });
  };

  return (
    <div className="enhance-screen">
      <div className="enhance-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>強化</h2>
        <span className="gil-display">💰 {gil.toLocaleString()}</span>
      </div>

      {/* Character selector */}
      <div className="char-selector">
        {saveData.progress.unlockedCharacters.map(id => {
          const cd = CHARACTERS.find(c => c.id === id);
          if (!cd) return null;
          return (
            <button
              key={id}
              className={`char-selector-btn ${id === selectedCharId ? 'selected' : ''}`}
              onClick={() => setSelectedCharId(id)}
            >
              {cd.emoji}
            </button>
          );
        })}
      </div>

      {/* Character info */}
      <div className="char-info-panel">
        <div className="char-info-header">
          <span className="char-emoji">{charData.emoji}</span>
          <span className="char-name">{charData.name}</span>
          <span className="char-level-badge">Lv.{level} / 50</span>
        </div>

        <div className="char-stats">
          <div className="stat-row"><span>HP</span><span>{stats.hp}</span></div>
          <div className="stat-row"><span>STR</span><span>{stats.str}</span></div>
          <div className="stat-row"><span>MAG</span><span>{stats.mag}</span></div>
        </div>
      </div>

      {/* Level up */}
      <div className="enhance-section">
        <h3>レベルアップ</h3>
        <div className="levelup-card">
          <div className="levelup-preview">
            {level < 50 ? (
              <>
                <span>Lv.{level} → Lv.{level + 1}</span>
                <span className="stat-diff">HP +{nextStats.hp - stats.hp} / STR +{nextStats.str - stats.str} / MAG +{nextStats.mag - stats.mag}</span>
              </>
            ) : <span className="max-badge">MAX LEVEL</span>}
          </div>
          <button
            className="btn-levelup"
            onClick={handleLevelUp}
            disabled={!canLevelUp}
          >
            {level >= 50 ? 'MAX' : `💰 ${lvCost.toLocaleString()} Gil`}
          </button>
        </div>
      </div>

      {/* Role level up */}
      <div className="enhance-section">
        <h3>ロールレベルアップ</h3>
        {charData.roles.map(role => {
          const roleLv = charSave.roleLevels?.[role] ?? 1;
          const cost = roleLevelCost(role, roleLv);
          const crystalId = ROLE_CRYSTAL_MAP[role];
          const crystalQty = getMaterialQty(crystalId);
          const canUp = roleLv < 10 && gil >= cost.gil && crystalQty >= cost.crystals;

          return (
            <div key={role} className="role-level-card">
              <div className="role-level-info">
                <span>{getRoleEmoji(role)} {getRoleLabel(role)}</span>
                <span className="role-lv">Lv.{roleLv}/10</span>
              </div>
              <div className="role-bonus">{roleBonusDesc(role, roleLv)}</div>
              {roleLv < 10 && (
                <div className="role-cost">
                  <span>💰{cost.gil.toLocaleString()}</span>
                  <span>{getRoleEmoji(role)}×{cost.crystals} (所持:{crystalQty})</span>
                  <button
                    className="btn-small"
                    onClick={() => handleRoleLevelUp(role)}
                    disabled={!canUp}
                  >
                    強化
                  </button>
                </div>
              )}
              {roleLv >= 10 && <span className="max-badge">MAX</span>}
            </div>
          );
        })}
      </div>

      {/* Materials inventory */}
      <div className="enhance-section">
        <h3>所持素材</h3>
        <div className="materials-list">
          {materials.length === 0 && <p className="no-items">素材なし</p>}
          {materials.map(m => (
            <div key={m.itemId} className="material-row">
              <span>{m.itemId.replace(/_/g, ' ')}</span>
              <span>×{m.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
