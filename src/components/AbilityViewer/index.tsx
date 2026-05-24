import { useState } from 'react';
import type { CharacterData, CharacterSaveData, RoleId, EquipmentInstance, AutoAbility } from '../../types';
import { getAllAbilitiesForRole, getAbilityById, getAbilityUnlockLevel, getAutoById } from '../../data/abilities';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';
import { getEquipmentById, ENHANCE_MULTIPLIERS } from '../../data/equipment';

interface AbilityViewerProps {
  charData: CharacterData;
  charSave: CharacterSaveData;
  inventoryEquipments?: EquipmentInstance[];
}

const ELEMENT_ICONS: Record<string, string> = {
  fire: '🔥', ice: '🧊', thunder: '⚡️', wind: '🌪️',
  light: '💡', holy: '💡', dark: '⚫️', water: '💧', earth: '🌍',
};

const AUTO_EFFECT_LABELS: Record<string, string> = {
  prot: 'プロテス', shell: 'シェル', haste: 'ヘイスト', faith: 'フェイス',
  bravery: 'ブレイバリー', regen: 'リジェネ', veil: 'ヴェイル',
  barfire: 'バーファイア', barice: 'バーアイス', barthunder: 'バーサンダー', barwind: 'バーウィンド',
};

function getTriggerLabel(ab: AutoAbility): string {
  const t = ab.trigger;
  switch (t.type) {
    case 'always':      return '常時';
    case 'hp_above':    return `HP ${Math.round((t.threshold ?? 0) * 100)}% 以上`;
    case 'hp_below':    return `HP ${Math.round((t.threshold ?? 0) * 100)}% 以下`;
    case 'break_active':return 'ブレイク中';
    case 'role_active': return `${t.role ?? ''}ロール使用時`;
    case 'on_damaged':  return '被ダメージ時';
    case 'ally_dead':   return '味方戦闘不能時';
    case 'on_hit':      return 'ヒット時';
  }
}

function getAutoAbilities(charSave: CharacterSaveData, inventoryEquipments: EquipmentInstance[]) {
  const equippedIds = [
    charSave.equipment.weapon,
    charSave.equipment.accessory1,
    charSave.equipment.accessory2,
    charSave.equipment.accessory3,
    charSave.equipment.accessory4,
  ].filter(Boolean) as string[];

  const autoEffects: { label: string; desc: string; source: string; sourceEmoji: string }[] = [];
  for (const instId of equippedIds) {
    const inst = inventoryEquipments.find(e => e.instanceId === instId);
    if (!inst) continue;
    const data = getEquipmentById(inst.itemId);
    if (!data) continue;
    const mult = ENHANCE_MULTIPLIERS[inst.enhanceLevel] ?? 1;
    for (const eff of data.effects) {
      if (eff.type === 'auto_buff' && eff.buffId) {
        const buffName = AUTO_EFFECT_LABELS[eff.buffId] ?? eff.buffId;
        autoEffects.push({
          label: `開幕${buffName}`,
          desc: `戦闘開始時に自動付与`,
          source: `${data.name}${inst.enhanceLevel > 0 ? ` +${inst.enhanceLevel}` : ''}`,
          sourceEmoji: data.emoji,
        });
      } else if (eff.type === 'auto_regen') {
        const pct = (eff.value * mult * 100).toFixed(2);
        autoEffects.push({
          label: 'オートリジェネ',
          desc: `毎秒 ${pct}% HP 回復`,
          source: `${data.name}${inst.enhanceLevel > 0 ? ` +${inst.enhanceLevel}` : ''}`,
          sourceEmoji: data.emoji,
        });
      }
    }
  }
  return autoEffects;
}

export function AbilityViewer({ charData, charSave, inventoryEquipments }: AbilityViewerProps) {
  // 固有ロール + クリスタルで解放したロール
  const innateRoles = charData.roles;
  const extraRoles = (charSave.unlockedRoles ?? innateRoles).filter(r => !innateRoles.includes(r));
  const allRoles: RoleId[] = [...innateRoles, ...extraRoles];
  const [activeRole, setActiveRole] = useState<RoleId>(allRoles[0]);
  const charLevel = charSave.level;

  const roleAbilities = getAllAbilitiesForRole(activeRole, charData.id);
  const uniqueAbilities = charData.uniqueAbilities
    .map(id => getAbilityById(id))
    .filter(ab => ab && ab.role === activeRole);

  const allAbilities = [
    ...roleAbilities,
    ...uniqueAbilities.filter(ab => ab && !roleAbilities.find(ra => ra.id === ab!.id)),
  ];

  const autoAbilities = inventoryEquipments
    ? getAutoAbilities(charSave, inventoryEquipments)
    : [];

  const charAutoAbilities = (charData.autoAbilities ?? [])
    .map(id => getAutoById(id))
    .filter((ab): ab is AutoAbility => ab !== undefined);

  return (
    <div className="ability-viewer">
      <div className="ability-viewer-tabs">
        {allRoles.map(role => (
          <button
            key={role}
            className={`ability-role-tab ${activeRole === role ? 'active' : ''}`}
            onClick={() => setActiveRole(role)}
          >
            {getRoleEmoji(role)} {getRoleLabel(role)}
          </button>
        ))}
      </div>

      {/* オートアビリティ（キャラクター固有） */}
      {charAutoAbilities.length > 0 && (
        <div className="auto-ability-section char-auto-ability-section">
          <div className="auto-ability-title">⭐ 固有オートアビリティ</div>
          {charAutoAbilities.map(ab => (
            <div key={ab.id} className="auto-ability-item char-auto-ability-item">
              <div className="auto-ability-header">
                <span className="auto-ability-name">{ab.name}</span>
                <span className="auto-ability-trigger">{getTriggerLabel(ab)}</span>
              </div>
              <div className="auto-ability-desc">{ab.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* オートアビリティ（装備由来） */}
      {autoAbilities.length > 0 && (
        <div className="auto-ability-section">
          <div className="auto-ability-title">⚙️ オートアビリティ（装備）</div>
          {autoAbilities.map((aa, i) => (
            <div key={i} className="auto-ability-item">
              <div className="auto-ability-header">
                <span className="auto-ability-name">{aa.label}</span>
                <span className="auto-ability-source">{aa.sourceEmoji} {aa.source}</span>
              </div>
              <div className="auto-ability-desc">{aa.desc}</div>
            </div>
          ))}
        </div>
      )}

      <div className="ability-viewer-list">
        {allAbilities.length === 0 && (
          <p className="no-items">このロールのアビリティはありません</p>
        )}
        {allAbilities.map(ab => {
          if (!ab) return null;
          const isUnique = ab.isUnique && ab.uniqueOwner === charData.id;
          const isUltimate = ab.isUltimate;
          const unlockLv = getAbilityUnlockLevel(ab);
          const isLocked = charLevel < unlockLv;
          const elemIcon = ab.element ? (ELEMENT_ICONS[ab.element] ?? ab.element) : null;
          return (
            <div
              key={ab.id}
              className={`ability-item ${isUnique ? 'unique' : ''} ${isUltimate ? 'ultimate' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div className="ability-item-header">
                <span className="ability-name">
                  {isLocked && <span className="ability-lock">🔒 </span>}
                  {elemIcon && <span className="ability-element-icon">{elemIcon}</span>}
                  {ab.name}
                </span>
                <span className="ability-cost">コスト: {ab.cost}</span>
                {isUnique && !isLocked && <span className="ability-badge unique-badge">固有</span>}
                {isUltimate && !isLocked && <span className="ability-badge ult-badge">奥義</span>}
                {isLocked && <span className="ability-badge lock-badge">Lv.{unlockLv}</span>}
              </div>
              {isLocked ? (
                <div className="ability-item-details locked-hint">Lv.{unlockLv} で解放</div>
              ) : (
                <div className="ability-item-details">
                  {ab.power !== undefined && ab.power > 0 && (
                    <span className="ability-detail">威力: {ab.power}{ab.hits && ab.hits > 1 ? ` × ${ab.hits}` : ''}</span>
                  )}
                  {elemIcon && <span className="ability-detail">{elemIcon}</span>}
                  {ab.healPercent && <span className="ability-detail">回復: {Math.round(ab.healPercent * 100)}%</span>}
                  {ab.healValue && <span className="ability-detail">回復: {ab.healValue}</span>}
                  {ab.healMissingPercent && <span className="ability-detail">欠損HP回復: {Math.round(ab.healMissingPercent * 100)}%</span>}
                  {ab.buff && ab.buff.length > 0 && <span className="ability-detail">バフ: {ab.buff.join(', ')}</span>}
                  {ab.debuff && ab.debuff.length > 0 && <span className="ability-detail">デバフ: {ab.debuff.join(', ')}</span>}
                  {ab.aoe && <span className="ability-detail">全体</span>}
                  {ab.chainBonus > 0 && <span className="ability-detail">チェーン+{ab.chainBonus}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
