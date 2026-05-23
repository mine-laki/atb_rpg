import { useState } from 'react';
import type { CharacterData, CharacterSaveData, RoleId } from '../../types';
import { getAllAbilitiesForRole, getAbilityById, getAbilityUnlockLevel } from '../../data/abilities';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';

interface AbilityViewerProps {
  charData: CharacterData;
  charSave: CharacterSaveData;
}

export function AbilityViewer({ charData, charSave }: AbilityViewerProps) {
  const allRoles = charData.roles;
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
          return (
            <div
              key={ab.id}
              className={`ability-item ${isUnique ? 'unique' : ''} ${isUltimate ? 'ultimate' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <div className="ability-item-header">
                <span className="ability-name">
                  {isLocked && <span className="ability-lock">🔒 </span>}
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
                  {ab.element && <span className="ability-detail">属性: {ab.element}</span>}
                  {ab.healPercent && <span className="ability-detail">回復: {Math.round(ab.healPercent * 100)}%</span>}
                  {ab.healValue && <span className="ability-detail">回復: {ab.healValue}</span>}
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
