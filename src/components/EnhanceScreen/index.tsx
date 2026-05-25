import { useState } from 'react';
import type { SaveData, RoleId, CharacterSaveData, EquipmentInstance } from '../../types';
import { CHARACTERS, getStatsAtLevel, levelUpCost, getCharProfile } from '../../data/characters';
import { seLevelUp } from '../../systems/sound';
import { MATERIALS, getEquipmentById, ENHANCE_MULTIPLIERS } from '../../data/equipment';
import { getSkillNodes, calcSkillBonuses } from '../../data/skillBoard';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';
import { AbilityViewer } from '../AbilityViewer';

interface EnhanceScreenProps {
  saveData: SaveData;
  onUpdate: (next: SaveData) => void;
  onBack: () => void;
}

type EnhanceTab = 'level' | 'role' | 'equip' | 'skill' | 'unlock' | 'abilities';

const ROLE_CRYSTAL_MAP: Record<RoleId, string> = {
  ATK: 'crystal_atk', BLA: 'crystal_bla', DEF: 'crystal_def',
  HLR: 'crystal_hlr', ENH: 'crystal_enh', JAM: 'crystal_jam',
};

function roleLevelCost(role: RoleId, currentRoleLv: number, isExtraRole = false): { gil: number; crystals: number } {
  const base: Record<RoleId, number> = { ATK: 200, BLA: 200, DEF: 180, HLR: 180, ENH: 220, JAM: 220 };
  return {
    gil: Math.floor(base[role] * Math.pow(1.5, currentRoleLv - 1)),
    crystals: isExtraRole ? currentRoleLv * 10 : currentRoleLv,
  };
}

function roleBonusDesc(role: RoleId, lv: number): string {
  const descriptions: Record<RoleId, string> = {
    ATK: `物理ダメージ +${lv * 10}%`,
    BLA: `魔法ダメージ +${lv * 10}%`,
    DEF: `被ダメ軽減 +${lv * 2}%`,
    HLR: `回復量 +${lv * 8}%`,
    ENH: `バフ効果時間 +${lv * 8}%`,
    JAM: `デバフ効果時間 +${lv * 8}%`,
  };
  return descriptions[role];
}

function getMaterialEmoji(itemId: string): string {
  return MATERIALS.find(m => m.id === itemId)?.emoji ?? '📦';
}

function effectLabel(eff: { type: string; value: number; element?: string }): string | null {
  if (eff.type === 'atb_expand')    return 'ATB+1';
  if (eff.type === 'atb_speed')     return `速度+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'heal_boost')    return `回復+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'chain_boost')   return `チェーン+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'damage_boost')  return eff.value > 0 ? `ダメ+${Math.round(eff.value * 100)}%` : `被ダメ${Math.round(eff.value * 100)}%`;
  if (eff.type === 'buff_extend')   return `バフ+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'debuff_rate')   return `デバフ率+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'auto_regen')    return 'リジェネ';
  if (eff.type === 'magic_cost_reduce') return `魔法コスト-${eff.value}`;
  if (eff.type === 'element_resist') return `${eff.element}耐性+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'auto_buff')     return `開幕バフ`;
  return null;
}

export function EnhanceScreen({ saveData, onUpdate, onBack }: EnhanceScreenProps) {
  const [selectedCharId, setSelectedCharId] = useState<string>(
    saveData.player.party[0] ?? saveData.progress.unlockedCharacters[0]
  );
  const [tab, setTab] = useState<EnhanceTab>('level');
  const [activeSlot, setActiveSlot] = useState<'weapon' | 'accessory1' | 'accessory2' | 'accessory3' | 'accessory4' | null>(null);

  const charData = CHARACTERS.find(c => c.id === selectedCharId);
  const charSave = saveData.player.roster.find(r => r.id === selectedCharId);
  const { gil, equipments, materials } = saveData.progress.inventory;

  if (!charData || !charSave) return null;

  const level = charSave.level;
  const stats = getStatsAtLevel(charData, level);
  const nextStats = getStatsAtLevel(charData, level + 1);
  const lvCost = levelUpCost(level);
  const canLevelUp = gil >= lvCost;

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
    seLevelUp();
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
    const isExtra = !charData.roles.includes(role);
    const cost = roleLevelCost(role, currentRoleLv, isExtra);
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
  const currentEquip = charSave.equipment;
  const accessorySlotCount = charSave.level >= 30 ? 4 : charSave.level >= 20 ? 3 : charSave.level >= 10 ? 2 : 1;

  const getInst = (instanceId: string | null): EquipmentInstance | null =>
    instanceId ? (equipments.find(e => e.instanceId === instanceId) ?? null) : null;

  const getInstData = (instanceId: string | null) => {
    const inst = getInst(instanceId);
    return inst ? getEquipmentById(inst.itemId) : null;
  };

  const myEquippedIds = [currentEquip.weapon, currentEquip.accessory1, currentEquip.accessory2, currentEquip.accessory3, currentEquip.accessory4].filter(Boolean) as string[];

  const instanceToEquipper = new Map<string, string>();
  for (const r of saveData.player.roster) {
    if (r.id === selectedCharId) continue;
    const eq = r.equipment;
    [eq.weapon, eq.accessory1, eq.accessory2, eq.accessory3, eq.accessory4].forEach(id => { if (id) instanceToEquipper.set(id, r.id); });
  }

  const handleEquip = (slot: 'weapon' | 'accessory1' | 'accessory2' | 'accessory3' | 'accessory4', instanceId: string) => {
    if (currentEquip[slot] === instanceId) {
      onUpdate(updateRoster({ ...charSave, equipment: { ...currentEquip, [slot]: null } }));
      setActiveSlot(null);
      return;
    }
    onUpdate(updateRoster({ ...charSave, equipment: { ...currentEquip, [slot]: instanceId } }));
    setActiveSlot(null);
  };

  const handleUnequip = (slot: 'weapon' | 'accessory1' | 'accessory2' | 'accessory3' | 'accessory4') => {
    onUpdate(updateRoster({ ...charSave, equipment: { ...currentEquip, [slot]: null } }));
    setActiveSlot(null);
  };

  // ── 装備プリセット ──────────────────────────────────
  const presets: (import('../../types').EquipmentSlots | null)[] = charSave.equipPresets ?? [null, null, null];

  const handleSavePreset = (idx: number) => {
    const newPresets = [...presets] as (import('../../types').EquipmentSlots | null)[];
    newPresets[idx] = { ...currentEquip };
    onUpdate(updateRoster({ ...charSave, equipPresets: newPresets }));
  };

  const handleLoadPreset = (idx: number) => {
    const preset = presets[idx];
    if (!preset) return;
    onUpdate(updateRoster({ ...charSave, equipment: { ...preset } }));
    setActiveSlot(null);
  };

  const handleClearPreset = (idx: number) => {
    const newPresets = [...presets] as (import('../../types').EquipmentSlots | null)[];
    newPresets[idx] = null;
    onUpdate(updateRoster({ ...charSave, equipPresets: newPresets }));
  };

  function presetLabel(idx: number): string {
    const p = presets[idx];
    if (!p) return '空';
    const wInst = getInst(p.weapon);
    const wData = wInst ? getEquipmentById(wInst.itemId) : null;
    return wData ? `${wData.emoji}${wData.name}` : '装備あり';
  }

  const slotFilterType = activeSlot === 'weapon' ? 'weapon' : (activeSlot ? 'accessory' : null);
  const filteredInventory = slotFilterType
    ? equipments.filter(inst => {
        const d = getEquipmentById(inst.itemId);
        if (!d || d.type !== slotFilterType) return false;
        if (slotFilterType === 'weapon' && charData.weaponAffinity && charData.weaponAffinity !== 'any') {
          return d.weaponType === charData.weaponAffinity;
        }
        return true;
      })
    : [];

  // ── Equipment stat summary ──────────────────────────────────
  const calcEquipBonus = () => {
    let hp = 0, str = 0, mag = 0, atbExtra = 0, speedPct = 0;
    for (const id of [currentEquip.weapon, currentEquip.accessory1, currentEquip.accessory2, currentEquip.accessory3, currentEquip.accessory4]) {
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

  // ── Sorted character list ──────────────────────────────────
  const sortedChars = [...saveData.progress.unlockedCharacters].sort((a, b) => {
    const aInParty = saveData.player.party.includes(a) ? 0 : 1;
    const bInParty = saveData.player.party.includes(b) ? 0 : 1;
    return aInParty - bInParty;
  });

  // ── Equip slot definitions ─────────────────────────────────
  const WEAPON_TYPE_LABEL: Record<string, string> = {
    sword: '剣', staff: '杖', bow: '弓', shield: '盾',
    holy: '聖具', instrument: '楽器', cursed: '呪具', any: '全種',
  };
  const weaponTypeNote = charData.weaponAffinity ? `(${WEAPON_TYPE_LABEL[charData.weaponAffinity] ?? charData.weaponAffinity})` : '';
  const equipSlots = [
    { slot: 'weapon'     as const, label: `武器 ${weaponTypeNote}`, id: currentEquip.weapon,      show: true },
    { slot: 'accessory1' as const, label: 'アクセ1', id: currentEquip.accessory1,  show: accessorySlotCount >= 1 },
    { slot: 'accessory2' as const, label: 'アクセ2', id: currentEquip.accessory2,  show: accessorySlotCount >= 2 },
    { slot: 'accessory3' as const, label: 'アクセ3', id: currentEquip.accessory3,  show: accessorySlotCount >= 3 },
    { slot: 'accessory4' as const, label: 'アクセ4', id: currentEquip.accessory4,  show: accessorySlotCount >= 4 },
  ].filter(s => s.show);

  return (
    <div className="enhance-screen">
      {/* ── ヘッダー ── */}
      <div className="enhance-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>強化</h2>
        <span className="gil-display">💰 {gil.toLocaleString()}</span>
      </div>

      {/* ── 左サイドバー（キャラ選択 + キャラ情報） ── */}
      <div className="char-sidebar">

      {/* ── キャラセレクター ── */}
      <div className="char-selector">
        {sortedChars.map(id => {
          const cd = CHARACTERS.find(c => c.id === id);
          const cs = saveData.player.roster.find(r => r.id === id);
          if (!cd) return null;
          const inParty = saveData.player.party.includes(id);
          return (
            <button
              key={id}
              className={`char-selector-btn ${id === selectedCharId ? 'selected' : ''} ${inParty ? 'in-party' : ''}`}
              onClick={() => { setSelectedCharId(id); setActiveSlot(null); }}
            >
              <span className="char-sel-emoji">{cd.emoji}</span>
              <span className="char-sel-info">
                <span className="char-sel-name">{cd.name}</span>
                <span className="char-sel-level">Lv.{cs?.level ?? 1}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ── キャラ情報パネル ── */}
      <div className="char-info-panel">
        <div className="char-info-header">
          <span className="char-emoji">{charData.emoji}</span>
          <div className="char-info-name-block">
            <span className="char-name">{charData.name}</span>
            <span className="char-level-badge">Lv.{level}</span>
          </div>
        </div>

        {/* ステータスグリッド */}
        <div className="char-stats-grid">
          <div className="csg-item">
            <span className="csg-label">HP</span>
            <span className="csg-value">{stats.hp + equipBonus.hp}</span>
            {equipBonus.hp > 0 && <span className="csg-bonus">+{equipBonus.hp}</span>}
          </div>
          <div className="csg-item">
            <span className="csg-label">STR</span>
            <span className="csg-value">{stats.str + equipBonus.str}</span>
            {equipBonus.str > 0 && <span className="csg-bonus">+{equipBonus.str}</span>}
          </div>
          <div className="csg-item">
            <span className="csg-label">MAG</span>
            <span className="csg-value">{stats.mag + equipBonus.mag}</span>
            {equipBonus.mag > 0 && <span className="csg-bonus">+{equipBonus.mag}</span>}
          </div>
          <div className="csg-item">
            <span className="csg-label">ATB</span>
            <span className="csg-value">{charData.atbMax + equipBonus.atbExtra}</span>
            {equipBonus.atbExtra > 0 && <span className="csg-bonus">+{equipBonus.atbExtra}</span>}
          </div>
          {equipBonus.speedPct > 0 && (
            <div className="csg-item csg-wide">
              <span className="csg-label">速度</span>
              <span className="csg-value">+{equipBonus.speedPct}%</span>
            </div>
          )}
        </div>

        {/* ロールレベルバッジ */}
        <div className="char-role-levels">
          {charData.roles.map(role => {
            const lv = charSave.roleLevels?.[role] ?? 1;
            return (
              <span key={role} className={`char-role-lv-badge role-color-${role.toLowerCase()}`}>
                {getRoleEmoji(role)} Lv.{lv}
              </span>
            );
          })}
        </div>

        {/* 装備サマリー */}
        <div className="char-equip-summary">
          {equipSlots.map(({ slot, label, id }) => {
            const d = getInstData(id ?? null);
            const inst = getInst(id ?? null);
            return (
              <div key={slot} className="char-equip-mini-row">
                <span className="char-equip-mini-label">{label}</span>
                {d && inst ? (
                  <span className="char-equip-mini-name">
                    {d.emoji} {d.name}{inst.enhanceLevel > 0 ? <strong> +{inst.enhanceLevel}</strong> : ''}
                  </span>
                ) : (
                  <span className="char-equip-mini-empty">—</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

        {/* ── キャラプロフィール ── */}
        {(() => {
          const profile = getCharProfile(charData.id);
          if (!profile) return null;
          return (
            <div className="char-profile-panel">
              <p className="char-profile-desc">{profile.description}</p>
              <div className="char-profile-playstyle">
                <span className="char-profile-hint-label">💡 運用ヒント</span>
                <p className="char-profile-hint-text">{profile.playstyle}</p>
              </div>
            </div>
          );
        })()}
      </div>{/* /char-sidebar */}

      {/* ── タブ ── */}
      <div className="enhance-tabs">
        {(['level', 'role', 'equip', 'skill', 'abilities', 'unlock'] as EnhanceTab[]).map(t => (
          <button
            key={t}
            className={tab === t ? 'active' : ''}
            onClick={() => { setTab(t); if (t !== 'equip') setActiveSlot(null); }}
          >
            {{ level: 'レベル', role: 'ロール', equip: '装備', skill: 'スキル', abilities: 'アビリティ', unlock: '解放' }[t]}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          ── レベルアップ タブ ──
          ══════════════════════════════════════ */}
      {tab === 'level' && (
        <div className="enhance-section">
          {/* レベル進捗バー（50ごとのサイクル表示） */}
          <div className="level-progress-wrap">
            <span className="lp-label">Lv.{Math.floor((level - 1) / 50) * 50 + 1}</span>
            <div className="level-progress-track">
              <div className="level-progress-fill" style={{ width: `${((level - 1) % 50 / 50) * 100}%` }} />
              <span className="level-progress-text">Lv.{level}</span>
            </div>
            <span className="lp-label">{(Math.floor((level - 1) / 50) + 1) * 50}</span>
          </div>

          <div className="levelup-card">
              {/* Before / After 比較 */}
              <div className="levelup-compare">
                <div className="luc-col current">
                  <div className="luc-col-title">Lv.{level}</div>
                  <div className="luc-row"><span>HP</span><strong>{stats.hp}</strong></div>
                  <div className="luc-row"><span>STR</span><strong>{stats.str}</strong></div>
                  <div className="luc-row"><span>MAG</span><strong>{stats.mag}</strong></div>
                </div>
                <div className="luc-arrow">→</div>
                <div className="luc-col next">
                  <div className="luc-col-title">Lv.{level + 1}</div>
                  <div className="luc-row">
                    <span>HP</span>
                    <strong>{nextStats.hp}</strong>
                    <span className="luc-diff">+{nextStats.hp - stats.hp}</span>
                  </div>
                  <div className="luc-row">
                    <span>STR</span>
                    <strong>{nextStats.str}</strong>
                    <span className="luc-diff">+{nextStats.str - stats.str}</span>
                  </div>
                  <div className="luc-row">
                    <span>MAG</span>
                    <strong>{nextStats.mag}</strong>
                    <span className="luc-diff">+{nextStats.mag - stats.mag}</span>
                  </div>
                </div>
              </div>

              <div className="levelup-footer">
                <button className="btn-levelup" onClick={handleLevelUp} disabled={!canLevelUp}>
                  💰 {lvCost.toLocaleString()} Gil でレベルアップ
                </button>
                {!canLevelUp && (
                  <p className="cost-warning">Gil不足（所持: {gil.toLocaleString()} / 必要: {lvCost.toLocaleString()}）</p>
                )}
              </div>
            </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ── ロールレベル タブ ──
          ══════════════════════════════════════ */}
      {tab === 'role' && (
        <div className="enhance-section">
          {([ ...charData.roles,
              ...(charSave.unlockedRoles ?? charData.roles).filter(r => !charData.roles.includes(r))
            ] as RoleId[]).map(role => {
            const roleLv = charSave.roleLevels?.[role] ?? 1;
            const isExtra = !charData.roles.includes(role);
            const cost = roleLevelCost(role, roleLv, isExtra);
            const crystalId = ROLE_CRYSTAL_MAP[role];
            const crystalQty = getMaterialQty(crystalId);
            const crystalMat = MATERIALS.find(m => m.id === crystalId);
            const canUp = roleLv < 10 && gil >= cost.gil && crystalQty >= cost.crystals;
            return (
              <div key={role} className={`role-level-card ${canUp ? 'can-upgrade' : ''}`}>
                {/* ヘッダー行 */}
                <div className="rlc-header">
                  <span className="rlc-icon">{getRoleEmoji(role)}</span>
                  <div className="rlc-title">
                    <span className="rlc-name">{getRoleLabel(role)}</span>
                    <span className="role-lv">Lv.{roleLv} / 10</span>
                    {isExtra && <span className="extra-role-badge">解放</span>}
                  </div>
                  {roleLv >= 10
                    ? <span className="max-badge">MAX</span>
                    : <button className="btn-small btn-role-up" onClick={() => handleRoleLevelUp(role)} disabled={!canUp}>強化</button>
                  }
                </div>

                {/* ピップ進捗バー */}
                <div className="role-pip-bar">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={`role-pip ${i < roleLv ? 'filled' : ''}`} />
                  ))}
                </div>

                {/* 現在の効果 → 次の効果 */}
                <div className="rlc-bonus-row">
                  <span className="rlc-bonus-now">{roleBonusDesc(role, roleLv)}</span>
                  {roleLv < 10 && (
                    <span className="rlc-bonus-next">→ {roleBonusDesc(role, roleLv + 1)}</span>
                  )}
                </div>

                {/* コスト */}
                {roleLv < 10 && (
                  <div className="rlc-cost-row">
                    <span className={`rlc-cost-item ${gil >= cost.gil ? '' : 'shortage'}`}>
                      💰 {cost.gil.toLocaleString()}
                    </span>
                    <span className={`rlc-cost-item ${crystalQty >= cost.crystals ? '' : 'shortage'}`}>
                      {crystalMat?.emoji ?? ''} {crystalMat?.name ?? crystalId} ×{cost.crystals}
                      <span className="rlc-owned">（所持 {crystalQty}）</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* 所持クリスタル一覧 */}
          <div className="role-mat-summary">
            <div className="rms-title">所持クリスタル</div>
            <div className="rms-list">
              {Object.entries(ROLE_CRYSTAL_MAP).map(([role, crystalId]) => {
                const mat = MATERIALS.find(m => m.id === crystalId);
                const qty = getMaterialQty(crystalId);
                return (
                  <div key={role} className={`rms-item ${qty === 0 ? 'zero' : ''}`}>
                    <span>{mat?.emoji}</span>
                    <span className="rms-qty">×{qty}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ── 装備 タブ ──
          ══════════════════════════════════════ */}
      {tab === 'equip' && (
        <div className="enhance-section equip-tab">

          {/* ── 装備プリセット ── */}
          <div className="equip-preset-section">
            <div className="equip-preset-title">📦 装備セット</div>
            <div className="equip-preset-row">
              {([0, 1, 2] as const).map(idx => (
                <div key={idx} className={`equip-preset-card ${presets[idx] ? 'filled' : 'empty'}`}>
                  <div className="equip-preset-name">セット {idx + 1}</div>
                  <div className="equip-preset-summary">{presetLabel(idx)}</div>
                  <div className="equip-preset-btns">
                    <button
                      className="btn-small btn-preset-save"
                      onClick={() => handleSavePreset(idx)}
                      title="現在の装備を保存"
                    >保存</button>
                    {presets[idx] && (
                      <>
                        <button
                          className="btn-small btn-preset-load"
                          onClick={() => handleLoadPreset(idx)}
                          title="このセットを装備"
                        >適用</button>
                        <button
                          className="btn-small btn-preset-clear"
                          onClick={() => handleClearPreset(idx)}
                          title="セットを削除"
                        >✕</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="equip-slots">
            {equipSlots.map(({ slot, label, id }) => {
              const inst = getInst(id ?? null);
              const d = inst ? getEquipmentById(inst.itemId) : null;
              const mult = inst ? (ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1) : 1;
              const statParts = d ? [
                d.baseStats.hp  ? `HP+${Math.floor((d.baseStats.hp)  * mult)}` : null,
                d.baseStats.str ? `STR+${Math.floor((d.baseStats.str) * mult)}` : null,
                d.baseStats.mag ? `MAG+${Math.floor((d.baseStats.mag) * mult)}` : null,
              ].filter(Boolean) : [];
              const effTags = d ? d.effects.map(e => effectLabel(e)).filter(Boolean) as string[] : [];
              const isActive = activeSlot === slot;

              return (
                <div key={slot} className={`equip-slot ${isActive ? 'active' : ''}`}>
                  <div
                    className="equip-slot-main"
                    onClick={() => setActiveSlot(isActive ? null : slot)}
                  >
                    <span className="equip-slot-label">{label}</span>
                    <div className="equip-slot-body">
                      {d && inst ? (
                        <>
                          <div className="equip-slot-name-row">
                            <span className="equip-slot-emoji">{d.emoji}</span>
                            <span className="equip-slot-name">{d.name}</span>
                            {inst.enhanceLevel > 0 && (
                              <span className="equip-enhance-pip">+{inst.enhanceLevel}</span>
                            )}
                          </div>
                          {(statParts.length > 0 || effTags.length > 0) && (
                            <div className="equip-slot-tags">
                              {statParts.map((s, i) => <span key={i} className="equip-tag stat">{s}</span>)}
                              {effTags.map((e, i) => <span key={i} className="equip-tag eff">{e}</span>)}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="no-equip">未装備</span>
                      )}
                    </div>
                    <div className="equip-slot-ctrl" onClick={e => e.stopPropagation()}>
                      {id && (
                        <button className="btn-unequip" onClick={() => handleUnequip(slot)}>外す</button>
                      )}
                      <span className="equip-toggle-arrow">{isActive ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* インラインピッカー */}
                  {isActive && (
                    <div className="equip-picker">
                      <div className="equip-picker-title">
                        {slot === 'weapon' ? '武器を選択' : 'アクセサリを選択'}
                        {filteredInventory.length === 0 && (
                          <span className="equip-picker-empty"> — 該当装備なし（ショップで購入）</span>
                        )}
                      </div>
                      {filteredInventory.map(pInst => {
                        const pd = getEquipmentById(pInst.itemId);
                        if (!pd) return null;
                        const isHere = myEquippedIds.includes(pInst.instanceId);
                        const isElsewhere = instanceToEquipper.has(pInst.instanceId);
                        const pmult = ENHANCE_MULTIPLIERS[pInst.enhanceLevel] ?? 1;
                        const pStats = [
                          pd.baseStats.hp  ? `HP+${Math.floor((pd.baseStats.hp)  * pmult)}` : null,
                          pd.baseStats.str ? `STR+${Math.floor((pd.baseStats.str) * pmult)}` : null,
                          pd.baseStats.mag ? `MAG+${Math.floor((pd.baseStats.mag) * pmult)}` : null,
                        ].filter(Boolean);
                        const pEffs = pd.effects.map(e => effectLabel(e)).filter(Boolean) as string[];

                        return (
                          <div
                            key={pInst.instanceId}
                            className={`equip-pick-item ${isHere ? 'equipped-here' : ''} ${isElsewhere ? 'equipped-elsewhere' : ''}`}
                            onClick={() => handleEquip(slot, pInst.instanceId)}
                          >
                            <div className="equip-pick-info">
                              <span className="equip-pick-emoji">{pd.emoji}</span>
                              <div className="equip-pick-detail">
                                <span className="equip-pick-name">
                                  {pd.name}
                                  {pInst.enhanceLevel > 0 && <span className="equip-enhance-pip">+{pInst.enhanceLevel}</span>}
                                </span>
                                <div className="equip-pick-tags">
                                  {pStats.map((s, i) => <span key={i} className="equip-tag stat">{s}</span>)}
                                  {pEffs.map((e, i) => <span key={i} className="equip-tag eff">{e}</span>)}
                                </div>
                              </div>
                            </div>
                            {isHere
                              ? <span className="equip-badge equipped">装備中</span>
                              : isElsewhere
                                ? <span className="equip-badge elsewhere">
                                    {CHARACTERS.find(c => c.id === instanceToEquipper.get(pInst.instanceId))?.emoji ?? '?'} 装備中
                                  </span>
                                : <span className="equip-badge free">装備</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── アビリティ タブ ── */}
      {tab === 'abilities' && (
        <div className="enhance-section">
          <AbilityViewer charData={charData} charSave={charSave} inventoryEquipments={equipments} />
        </div>
      )}

      {/* ══════════════════════════════════════
          ── スキルボード タブ ──
          ══════════════════════════════════════ */}
      {tab === 'skill' && (() => {
        const nodes = getSkillNodes(charData.growthType);
        const unlockedArr = charSave.unlockedSkillNodes ?? [];
        const unlocked = new Set(unlockedArr);
        const bonuses = calcSkillBonuses(charData.growthType, unlockedArr);

        // 各ノードの深さを計算（依存グラフを BFS）
        const depthMap = new Map<string, number>();
        const computeDepth = (nodeId: string): number => {
          if (depthMap.has(nodeId)) return depthMap.get(nodeId)!;
          const node = nodes.find(n => n.id === nodeId);
          if (!node || node.requires.length === 0) { depthMap.set(nodeId, 0); return 0; }
          const d = Math.max(...node.requires.map(r => computeDepth(r))) + 1;
          depthMap.set(nodeId, d);
          return d;
        };
        nodes.forEach(n => computeDepth(n.id));
        const maxDepth = Math.max(0, ...Array.from(depthMap.values()));
        const tiers = Array.from({ length: maxDepth + 1 }, (_, i) =>
          nodes.filter(n => depthMap.get(n.id) === i)
        );

        const canUnlockNode = (nodeId: string): boolean => {
          const node = nodes.find(n => n.id === nodeId);
          if (!node || unlocked.has(nodeId)) return false;
          if (!node.requires.every(r => unlocked.has(r))) return false;
          if (gil < node.cost.gil) return false;
          for (const mat of node.cost.materials) {
            if (getMaterialQty(mat.itemId) < mat.quantity) return false;
          }
          return true;
        };

        const handleUnlockNode = (nodeId: string) => {
          const node = nodes.find(n => n.id === nodeId);
          if (!node || !canUnlockNode(nodeId)) return;
          let newGil = gil - node.cost.gil;
          let newMats = [...materials];
          for (const mat of node.cost.materials) {
            newMats = newMats.map(m =>
              m.itemId === mat.itemId ? { ...m, quantity: m.quantity - mat.quantity } : m
            ).filter(m => m.quantity > 0);
          }
          const newRoster = saveData.player.roster.map(r => {
            if (r.id !== selectedCharId) return r;
            return { ...r, unlockedSkillNodes: [...(r.unlockedSkillNodes ?? []), nodeId] };
          });
          onUpdate({
            ...saveData,
            player: { ...saveData.player, roster: newRoster },
            progress: {
              ...saveData.progress,
              inventory: { ...saveData.progress.inventory, gil: newGil, materials: newMats },
            },
          });
        };

        return (
          <div className="enhance-section skill-tab">
            {/* 累積ボーナスサマリー */}
            <div className="skill-bonus-summary">
              <span className="skill-bonus-title">📊 解放済みボーナス合計</span>
              <div className="skill-bonus-values">
                {bonuses.hp   > 0 && <span className="skill-bonus-val">HP <b>+{bonuses.hp}</b></span>}
                {bonuses.str  > 0 && <span className="skill-bonus-val">STR <b>+{bonuses.str}</b></span>}
                {bonuses.mag  > 0 && <span className="skill-bonus-val">MAG <b>+{bonuses.mag}</b></span>}
                {bonuses.atbExtra > 0 && <span className="skill-bonus-val">ATB <b>+{bonuses.atbExtra}</b></span>}
                {unlocked.size === 0 && <span className="skill-bonus-empty">未解放</span>}
              </div>
            </div>

            {/* Tier 別ツリー表示 */}
            {tiers.map((tierNodes, depth) => (
              <div key={depth} className="skill-tier">
                {depth > 0 && <div className="skill-tier-arrow">▼</div>}
                <div className="skill-tier-nodes">
                  {tierNodes.map(node => {
                    const isUnlocked = unlocked.has(node.id);
                    const prereqsMet = node.requires.every(r => unlocked.has(r));
                    const affordable = canUnlockNode(node.id);
                    const status = isUnlocked ? 'unlocked' : prereqsMet ? 'available' : 'locked';
                    return (
                      <div key={node.id} className={`skill-node ${status}`}>
                        <div className="skill-node-info">
                          <div className="skill-node-name-row">
                            <span className="skill-node-name">
                              {isUnlocked ? '✓ ' : ''}{node.name}
                            </span>
                          </div>
                          <span className="skill-node-desc">{node.description}</span>
                          {!isUnlocked && (
                            <div className="skill-node-cost-row">
                              <span className={`skill-cost-item ${gil >= node.cost.gil ? '' : 'shortage'}`}>
                                💰{node.cost.gil.toLocaleString()}
                              </span>
                              {node.cost.materials.map(m => (
                                <span key={m.itemId} className={`skill-cost-item ${getMaterialQty(m.itemId) >= m.quantity ? '' : 'shortage'}`}>
                                  {getMaterialEmoji(m.itemId)}×{m.quantity}（{getMaterialQty(m.itemId)}）
                                </span>
                              ))}
                            </div>
                          )}
                          {!prereqsMet && !isUnlocked && (
                            <span className="skill-prereq-chain">
                              🔒 {node.requires.map(r => nodes.find(n => n.id === r)?.name ?? r).join('・')} が必要
                            </span>
                          )}
                        </div>
                        <div className="skill-node-action">
                          {isUnlocked
                            ? <span className="skill-unlocked-badge">解放済</span>
                            : <button
                                className={`btn-small ${affordable ? 'btn-skill-unlock' : ''}`}
                                onClick={() => handleUnlockNode(node.id)}
                                disabled={!affordable || !prereqsMet}
                              >解放</button>
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ══════════════════════════════════════
          ── キャラ解放 タブ ──
          ══════════════════════════════════════ */}
      {tab === 'unlock' && (() => {
        // ── ロール解放 ──────────────────────────────────
        const ROLE_UNLOCK_CRYSTAL_COST = 50;
        // 固有ロール（常時使用可能、解放不要）
        const innateRoles: RoleId[] = charData.roles;
        // クリスタルで解放済みの追加ロール（固有を除く）
        const crystalUnlockedRoles: RoleId[] = (charSave.unlockedRoles ?? []).filter(r => !innateRoles.includes(r));
        // 表示用（固有 + 解放済み）
        const currentUnlockedRoles: RoleId[] = [...innateRoles, ...crystalUnlockedRoles];
        const allRoleIds: RoleId[] = ['ATK', 'BLA', 'DEF', 'HLR', 'ENH', 'JAM'];
        // 固有でなく、かつクリスタル解放もされていないロールのみ解放可能
        const lockableRoles = allRoleIds.filter(r => !innateRoles.includes(r) && !crystalUnlockedRoles.includes(r));

        const handleRoleUnlock = (role: RoleId) => {
          const crystalId = ROLE_CRYSTAL_MAP[role];
          const qty = getMaterialQty(crystalId);
          if (qty < ROLE_UNLOCK_CRYSTAL_COST) return;
          const newMats = materials.map(m =>
            m.itemId !== crystalId ? m : { ...m, quantity: m.quantity - ROLE_UNLOCK_CRYSTAL_COST }
          ).filter(m => m.quantity > 0);
          const newRoster = saveData.player.roster.map(r => {
            if (r.id !== selectedCharId) return r;
            // 固有ロール + 既解放済み + 新規 で重複なく設定
            const newUnlocked = [...innateRoles, ...crystalUnlockedRoles.filter(x => x !== role), role];
            return { ...r, unlockedRoles: newUnlocked };
          });
          onUpdate({
            ...saveData,
            player: { ...saveData.player, roster: newRoster },
            progress: { ...saveData.progress, inventory: { ...saveData.progress.inventory, materials: newMats } },
          });
        };

        // ── キャラ解放 ──────────────────────────────────
        const FRAGMENT_COST = 3;
        const lockedChars = CHARACTERS.filter(c => !saveData.progress.unlockedCharacters.includes(c.id));

        const handleUnlock = (charId: string) => {
          const fragmentId = `fragment_${charId}`;
          const owned = getMaterialQty(fragmentId);
          if (owned < FRAGMENT_COST) return;
          const newMats = materials.map(m =>
            m.itemId !== fragmentId ? m : { ...m, quantity: m.quantity - FRAGMENT_COST }
          ).filter(m => m.quantity > 0);
          const newRosterEntry = {
            id: charId, level: 1, exp: 0,
            equipment: { weapon: null, accessory1: null, accessory2: null, accessory3: null, accessory4: null },
            unlockedRoles: [...CHARACTERS.find(c => c.id === charId)!.roles],
            roleLevels: {}, unlockedSkillNodes: [],
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

            {/* ── ロール解放セクション ── */}
            <div className="role-unlock-section">
              <div className="role-unlock-title">🎭 ロール解放</div>
              <p className="unlock-hint">クリスタル{ROLE_UNLOCK_CRYSTAL_COST}個で新ロールを習得（ロールLv上昇コストは通常の10倍）</p>
              {/* 解放済みロール一覧 */}
              <div className="role-unlock-owned">
                {currentUnlockedRoles.map(role => {
                  const isInnate = charData.roles.includes(role);
                  return (
                    <span key={role} className={`role-unlock-badge owned ${isInnate ? 'innate' : 'extra'}`}>
                      {getRoleEmoji(role)} {getRoleLabel(role)}
                      {!isInnate && <span className="extra-mark"> ★</span>}
                    </span>
                  );
                })}
              </div>
              {/* 未解放ロール */}
              {lockableRoles.length === 0
                ? <p className="no-items">全ロール解放済み！</p>
                : lockableRoles.map(role => {
                    const crystalId = ROLE_CRYSTAL_MAP[role];
                    const crystalMat = MATERIALS.find(m => m.id === crystalId);
                    const qty = getMaterialQty(crystalId);
                    const canUnlockRole = qty >= ROLE_UNLOCK_CRYSTAL_COST;
                    return (
                      <div key={role} className={`role-unlock-card ${canUnlockRole ? 'can-unlock' : ''}`}>
                        <div className="role-unlock-info">
                          <span className="role-unlock-icon">{getRoleEmoji(role)}</span>
                          <span className="role-unlock-name">{getRoleLabel(role)}</span>
                          <span className={`role-unlock-cost ${canUnlockRole ? '' : 'shortage'}`}>
                            {crystalMat?.emoji} ×{ROLE_UNLOCK_CRYSTAL_COST}（所持{qty}）
                          </span>
                        </div>
                        <button
                          className="btn-small btn-role-unlock"
                          onClick={() => handleRoleUnlock(role)}
                          disabled={!canUnlockRole}
                        >解放</button>
                      </div>
                    );
                  })
              }
            </div>

            {/* ── キャラクター解放セクション ── */}
            <div className="role-unlock-title" style={{ marginTop: '16px' }}>👥 キャラクター解放</div>
            <p className="unlock-hint">フラグメントを {FRAGMENT_COST} 個集めてキャラクターを解放！</p>
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
                    <div className="unlock-frag-pips">
                      {Array.from({ length: FRAGMENT_COST }, (_, i) => (
                        <span key={i} className={`unlock-pip ${i < owned ? 'filled' : ''}`}>{c.emoji}</span>
                      ))}
                    </div>
                    <span className={owned >= FRAGMENT_COST ? 'fragment-ready' : 'fragment-count'}>
                      {owned}/{FRAGMENT_COST}
                    </span>
                    <button className="btn-small btn-unlock" onClick={() => handleUnlock(c.id)} disabled={!canUnlock}>
                      解放
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
}
