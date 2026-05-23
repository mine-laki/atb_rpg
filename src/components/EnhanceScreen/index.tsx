import { useState } from 'react';
import type { SaveData, RoleId, CharacterSaveData, EquipmentInstance } from '../../types';
import { CHARACTERS, getStatsAtLevel, levelUpCost } from '../../data/characters';
import { MATERIALS, getEquipmentById, ENHANCE_MULTIPLIERS } from '../../data/equipment';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';

interface EnhanceScreenProps {
  saveData: SaveData;
  onUpdate: (next: SaveData) => void;
  onBack: () => void;
}

type EnhanceTab = 'level' | 'role' | 'equip' | 'unlock';

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

function getMaterialName(itemId: string): string {
  return MATERIALS.find(m => m.id === itemId)?.name ?? itemId.replace(/_/g, ' ');
}

function getMaterialEmoji(itemId: string): string {
  return MATERIALS.find(m => m.id === itemId)?.emoji ?? '📦';
}

export function EnhanceScreen({ saveData, onUpdate, onBack }: EnhanceScreenProps) {
  const [selectedCharId, setSelectedCharId] = useState<string>(
    saveData.player.party[0] ?? saveData.progress.unlockedCharacters[0]
  );
  const [tab, setTab] = useState<EnhanceTab>('level');
  // For equip tab: which slot is being actively swapped
  const [activeSlot, setActiveSlot] = useState<'weapon' | 'accessory1' | 'accessory2' | null>(null);

  const charData = CHARACTERS.find(c => c.id === selectedCharId);
  const charSave = saveData.player.roster.find(r => r.id === selectedCharId);
  const { gil, equipments, materials } = saveData.progress.inventory;

  if (!charData || !charSave) return null;

  const level = charSave.level;
  const stats = getStatsAtLevel(charData, level);
  const nextStats = getStatsAtLevel(charData, level + 1);
  const lvCost = levelUpCost(level);
  const canLevelUp = level < 50 && gil >= lvCost;

  function getMaterialQty(itemId: string): number {
    return materials.find(m => m.itemId === itemId)?.quantity ?? 0;
  }

  function updateRoster(updatedSave: CharacterSaveData): SaveData {
    return {
      ...saveData,
      player: {
        ...saveData.player,
        roster: saveData.player.roster.map(r => r.id === selectedCharId ? updatedSave : r),
      },
    };
  }

  const handleLevelUp = () => {
    if (!canLevelUp) return;
    onUpdate({
      ...updateRoster({ ...charSave, level: charSave.level + 1 }),
      progress: {
        ...saveData.progress,
        inventory: { ...saveData.progress.inventory, gil: gil - lvCost },
      },
    });
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
      return { ...r, roleLevels: { ...(r.roleLevels ?? {}), [role]: currentRoleLv + 1 } };
    });
    const newMats = materials.map(m => {
      if (m.itemId !== crystalId) return m;
      return { ...m, quantity: m.quantity - cost.crystals };
    }).filter(m => m.quantity > 0);

    onUpdate({
      ...saveData,
      player: { ...saveData.player, roster: newRoster },
      progress: {
        ...saveData.progress,
        inventory: { ...saveData.progress.inventory, gil: gil - cost.gil, materials: newMats },
      },
    });
  };

  // ── Equip helpers ──────────────────────────────────────────
  const currentEquip = charSave.equipment ?? { weapon: null, accessory1: null, accessory2: null };

  const getInst = (instanceId: string | null): EquipmentInstance | null =>
    instanceId ? (equipments.find(e => e.instanceId === instanceId) ?? null) : null;

  const getInstData = (instanceId: string | null) => {
    const inst = getInst(instanceId);
    return inst ? getEquipmentById(inst.itemId) : null;
  };

  const equippedWeaponName    = getInstData(currentEquip.weapon)?.name ?? '未装備';
  const equippedAcc1Name      = getInstData(currentEquip.accessory1)?.name ?? '未装備';
  const equippedAcc2Name      = getInstData(currentEquip.accessory2)?.name ?? '未装備';
  const equippedWeaponEmoji   = getInstData(currentEquip.weapon)?.emoji   ?? '—';
  const equippedAcc1Emoji     = getInstData(currentEquip.accessory1)?.emoji ?? '—';
  const equippedAcc2Emoji     = getInstData(currentEquip.accessory2)?.emoji ?? '—';

  // Items already equipped on THIS character (to prevent double-equip in same char)
  const myEquippedIds = [currentEquip.weapon, currentEquip.accessory1, currentEquip.accessory2].filter(Boolean) as string[];

  // Items equipped on OTHER characters (we'll still allow equipping — just show a warning color)
  const otherEquippedIds = new Set<string>();
  for (const r of saveData.player.roster) {
    if (r.id === selectedCharId) continue;
    const eq = r.equipment ?? { weapon: null, accessory1: null, accessory2: null };
    [eq.weapon, eq.accessory1, eq.accessory2].forEach(id => { if (id) otherEquippedIds.add(id); });
  }

  const handleEquip = (slot: 'weapon' | 'accessory1' | 'accessory2', instanceId: string) => {
    // If this item is already equipped in the same slot of this char, unequip
    if (currentEquip[slot] === instanceId) {
      onUpdate(updateRoster({ ...charSave, equipment: { ...currentEquip, [slot]: null } }));
      setActiveSlot(null);
      return;
    }
    // Equip
    onUpdate(updateRoster({ ...charSave, equipment: { ...currentEquip, [slot]: instanceId } }));
    setActiveSlot(null);
  };

  const handleUnequip = (slot: 'weapon' | 'accessory1' | 'accessory2') => {
    onUpdate(updateRoster({ ...charSave, equipment: { ...currentEquip, [slot]: null } }));
    setActiveSlot(null);
  };

  // Inventory to display for active slot
  const slotFilterType = activeSlot === 'weapon' ? 'weapon' : (activeSlot ? 'accessory' : null);
  const filteredInventory = slotFilterType
    ? equipments.filter(inst => {
        const d = getEquipmentById(inst.itemId);
        return d?.type === slotFilterType;
      })
    : [];

  // ── Equipment stat summary ──────────────────────────────────
  const calcEquipBonus = () => {
    let hp = 0, str = 0, mag = 0, atbExtra = 0, speedPct = 0;
    for (const id of [currentEquip.weapon, currentEquip.accessory1, currentEquip.accessory2]) {
      const inst = getInst(id ?? null);
      if (!inst) continue;
      const d = getEquipmentById(inst.itemId);
      if (!d) continue;
      const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1;
      hp  += Math.floor((d.baseStats.hp  ?? 0) * mult);
      str += Math.floor((d.baseStats.str ?? 0) * mult);
      mag += Math.floor((d.baseStats.mag ?? 0) * mult);
      d.effects.forEach(eff => {
        if (eff.type === 'atb_expand') atbExtra += eff.value;
        if (eff.type === 'atb_speed')  speedPct  += eff.value * 100;
      });
    }
    return { hp, str, mag, atbExtra, speedPct: Math.round(speedPct) };
  };

  const equipBonus = calcEquipBonus();

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
              onClick={() => { setSelectedCharId(id); setActiveSlot(null); }}
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
          <div className="stat-row"><span>HP</span><span>{stats.hp}{equipBonus.hp > 0 && <span className="stat-bonus"> +{equipBonus.hp}</span>}</span></div>
          <div className="stat-row"><span>STR</span><span>{stats.str}{equipBonus.str > 0 && <span className="stat-bonus"> +{equipBonus.str}</span>}</span></div>
          <div className="stat-row"><span>MAG</span><span>{stats.mag}{equipBonus.mag > 0 && <span className="stat-bonus"> +{equipBonus.mag}</span>}</span></div>
          {equipBonus.atbExtra > 0 && <div className="stat-row"><span>ATBゲージ</span><span>{charData.atbMax} + {equipBonus.atbExtra}</span></div>}
          {equipBonus.speedPct > 0 && <div className="stat-row"><span>ATB速度</span><span>+{equipBonus.speedPct}%</span></div>}
        </div>
      </div>

      {/* Tabs */}
      <div className="enhance-tabs">
        <button className={tab === 'level'  ? 'active' : ''} onClick={() => setTab('level')}>Lv強化</button>
        <button className={tab === 'role'   ? 'active' : ''} onClick={() => setTab('role')}>ロール</button>
        <button className={tab === 'equip'  ? 'active' : ''} onClick={() => { setTab('equip'); setActiveSlot(null); }}>装備</button>
        <button className={tab === 'unlock' ? 'active' : ''} onClick={() => setTab('unlock')}>解放</button>
      </div>

      {/* ── Level up tab ── */}
      {tab === 'level' && (
        <div className="enhance-section">
          <div className="levelup-card">
            <div className="levelup-preview">
              {level < 50 ? (
                <>
                  <span>Lv.{level} → Lv.{level + 1}</span>
                  <span className="stat-diff">
                    HP +{nextStats.hp - stats.hp} / STR +{nextStats.str - stats.str} / MAG +{nextStats.mag - stats.mag}
                  </span>
                </>
              ) : <span className="max-badge">MAX LEVEL</span>}
            </div>
            <button className="btn-levelup" onClick={handleLevelUp} disabled={!canLevelUp}>
              {level >= 50 ? 'MAX' : `💰 ${lvCost.toLocaleString()} Gil`}
            </button>
          </div>
        </div>
      )}

      {/* ── Role level tab ── */}
      {tab === 'role' && (
        <div className="enhance-section">
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
                {roleLv < 10 ? (
                  <div className="role-cost">
                    <span>💰{cost.gil.toLocaleString()}</span>
                    <span>{getRoleEmoji(role)}×{cost.crystals} (所持:{crystalQty})</span>
                    <button className="btn-small" onClick={() => handleRoleLevelUp(role)} disabled={!canUp}>強化</button>
                  </div>
                ) : <span className="max-badge">MAX</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Equip tab ── */}
      {tab === 'equip' && (
        <div className="enhance-section equip-tab">
          {/* Current equipment slots */}
          <div className="equip-slots">
            {(
              [
                { slot: 'weapon'     as const, label: '武器',       emoji: equippedWeaponEmoji, name: equippedWeaponName,  id: currentEquip.weapon },
                { slot: 'accessory1' as const, label: 'アクセ1',    emoji: equippedAcc1Emoji,   name: equippedAcc1Name,    id: currentEquip.accessory1 },
                { slot: 'accessory2' as const, label: 'アクセ2',    emoji: equippedAcc2Emoji,   name: equippedAcc2Name,    id: currentEquip.accessory2 },
              ]
            ).map(({ slot, label, emoji, name, id }) => (
              <div
                key={slot}
                className={`equip-slot ${activeSlot === slot ? 'active' : ''}`}
                onClick={() => setActiveSlot(activeSlot === slot ? null : slot)}
              >
                <span className="equip-slot-label">{label}</span>
                <span className="equip-slot-item">
                  {id ? <>{emoji} {name}</> : <span className="no-equip">未装備</span>}
                </span>
                {id && (
                  <button
                    className="btn-unequip"
                    onClick={e => { e.stopPropagation(); handleUnequip(slot); }}
                  >
                    外す
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Item list for active slot */}
          {activeSlot && (
            <div className="equip-picker">
              <h4>{activeSlot === 'weapon' ? '武器を選択' : 'アクセサリを選択'}</h4>
              {filteredInventory.length === 0 && (
                <p className="no-items">該当する装備がありません（ショップで購入してください）</p>
              )}
              {filteredInventory.map(inst => {
                const d = getEquipmentById(inst.itemId);
                if (!d) return null;
                const isEquippedHere = myEquippedIds.includes(inst.instanceId);
                const isEquippedElsewhere = otherEquippedIds.has(inst.instanceId);
                const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1;
                const statStr = [
                  d.baseStats.hp  ? `HP+${Math.floor((d.baseStats.hp ) * mult)}` : null,
                  d.baseStats.str ? `STR+${Math.floor((d.baseStats.str) * mult)}` : null,
                  d.baseStats.mag ? `MAG+${Math.floor((d.baseStats.mag) * mult)}` : null,
                ].filter(Boolean).join(' ');
                const effStr = d.effects.map(eff => {
                  if (eff.type === 'atb_expand')    return 'ATB+1';
                  if (eff.type === 'atb_speed')      return `速度+${Math.round(eff.value * 100)}%`;
                  if (eff.type === 'heal_boost')     return `回復+${Math.round(eff.value * 100)}%`;
                  if (eff.type === 'chain_boost')    return `チェーン+${Math.round(eff.value * 100)}%`;
                  if (eff.type === 'damage_boost')   return eff.value > 0 ? `ダメ+${Math.round(eff.value * 100)}%` : `被ダメ${Math.round(eff.value * 100)}%`;
                  if (eff.type === 'buff_extend')    return `バフ時間+${Math.round(eff.value * 100)}%`;
                  if (eff.type === 'debuff_rate')    return `デバフ率+${Math.round(eff.value * 100)}%`;
                  if (eff.type === 'auto_regen')     return 'リジェネ';
                  if (eff.type === 'element_resist') return `${eff.element}耐性+${Math.round(eff.value * 100)}%`;
                  return null;
                }).filter(Boolean).join(' / ');

                return (
                  <div
                    key={inst.instanceId}
                    className={`equip-pick-item ${isEquippedHere ? 'equipped-here' : ''} ${isEquippedElsewhere ? 'equipped-elsewhere' : ''}`}
                    onClick={() => handleEquip(activeSlot, inst.instanceId)}
                  >
                    <div className="equip-pick-info">
                      <span className="equip-pick-emoji">{d.emoji}</span>
                      <div>
                        <span className="equip-pick-name">{d.name} {inst.enhanceLevel > 0 && `+${inst.enhanceLevel}`}</span>
                        <span className="equip-pick-stats">{[statStr, effStr].filter(Boolean).join(' / ')}</span>
                      </div>
                    </div>
                    {isEquippedHere
                      ? <span className="equip-badge equipped">装備中</span>
                      : isEquippedElsewhere
                        ? <span className="equip-badge elsewhere">他で装備</span>
                        : <span className="equip-badge free">装備</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Unlock tab ── */}
      {tab === 'unlock' && (() => {
        const FRAGMENT_COST = 3;
        const lockedChars = CHARACTERS.filter(
          c => !saveData.progress.unlockedCharacters.includes(c.id)
        );

        const handleUnlock = (charId: string) => {
          const fragmentId = `fragment_${charId}`;
          const owned = getMaterialQty(fragmentId);
          if (owned < FRAGMENT_COST) return;

          const newMats = materials.map(m => {
            if (m.itemId !== fragmentId) return m;
            return { ...m, quantity: m.quantity - FRAGMENT_COST };
          }).filter(m => m.quantity > 0);

          const newRosterEntry = {
            id: charId,
            level: 1,
            exp: 0,
            equipment: { weapon: null, accessory1: null, accessory2: null },
            unlockedRoles: [CHARACTERS.find(c => c.id === charId)!.roles[0]],
            roleLevels: {},
            unlockedSkillNodes: [],
          };

          onUpdate({
            ...saveData,
            player: {
              ...saveData.player,
              roster: [...saveData.player.roster.filter(r => r.id !== charId), newRosterEntry],
            },
            progress: {
              ...saveData.progress,
              unlockedCharacters: [...saveData.progress.unlockedCharacters, charId],
              inventory: { ...saveData.progress.inventory, materials: newMats },
            },
          });
        };

        return (
          <div className="enhance-section unlock-tab">
            <p className="unlock-hint">フラグメントを{FRAGMENT_COST}個集めてキャラクターを解放しよう！</p>
            {lockedChars.length === 0 && <p className="no-items">全キャラ解放済み！</p>}
            {lockedChars.map(c => {
              const fragmentId = `fragment_${c.id}`;
              const owned = getMaterialQty(fragmentId);
              const canUnlock = owned >= FRAGMENT_COST;
              return (
                <div key={c.id} className={`unlock-card ${canUnlock ? 'can-unlock' : ''}`}>
                  <div className="unlock-char-info">
                    <span className="unlock-emoji">{c.emoji}</span>
                    <div>
                      <span className="unlock-name">{c.name}</span>
                      <span className="unlock-roles">{c.roles.join(' / ')}</span>
                    </div>
                  </div>
                  <div className="unlock-fragments">
                    <span className={owned >= FRAGMENT_COST ? 'fragment-ready' : 'fragment-count'}>
                      {c.emoji}×{owned}/{FRAGMENT_COST}
                    </span>
                    <button
                      className="btn-small btn-unlock"
                      onClick={() => handleUnlock(c.id)}
                      disabled={!canUnlock}
                    >
                      解放
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Materials inventory */}
      {tab === 'level' && (
        <div className="enhance-section">
          <h3>所持Gil: 💰{gil.toLocaleString()}</h3>
        </div>
      )}
      {tab === 'role' && (
        <div className="enhance-section">
          <h3>所持素材</h3>
          <div className="materials-list">
            {materials.length === 0 && <p className="no-items">素材なし</p>}
            {materials.map(m => {
              let emoji = getMaterialEmoji(m.itemId);
              let name  = getMaterialName(m.itemId);
              if (m.itemId.startsWith('fragment_')) {
                const charId = m.itemId.replace('fragment_', '');
                const char = CHARACTERS.find(c => c.id === charId);
                emoji = char?.emoji ?? '✨';
                name  = `${char?.name ?? charId}フラグメント`;
              }
              return (
                <div key={m.itemId} className="material-row">
                  <span>{emoji} {name}</span>
                  <span>×{m.quantity}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
