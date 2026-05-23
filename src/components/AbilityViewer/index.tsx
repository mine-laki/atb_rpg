import { useState } from 'react';
import type { CharacterData, CharacterSaveData, RoleId } from '../../types';
import { getAbilitiesForRole, getAbilityById } from '../../data/abilities';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';

interface AbilityViewerProps {
  charData: CharacterData;
  charSave: CharacterSaveData;
}

export function AbilityViewer({ charData, charSave }: AbilityViewerProps) {
  const unlockedRoles = charSave.unlockedRoles ?? [charData.roles[0]];
  const [activeRole, setActiveRole] = useState<RoleId>(unlockedRoles[0] ?? charData.roles[0]);

  const roleAbilities = getAbilitiesForRole(activeRole, charData.id);
  const uniqueAbilities = charData.uniqueAbilities
    .map(id => getAbilityById(id))
    .filter(ab => ab && ab.role === activeRole);

  const allAbilities = [...roleAbilities, ...uniqueAbilities.filter(ab => ab && !roleAbilities.find(ra => ra.id === ab!.id))];

  return (
    <div className="ability-viewer">
      <div className="ability-viewer-tabs">
        {unlockedRoles.map(role => (
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
          return (
            <div key={ab.id} className={`ability-item ${isUnique ? 'unique' : ''} ${isUltimate ? 'ultimate' : ''}`}>
              <div className="ability-item-header">
                <span className="ability-name">{ab.name}</span>
                <span className="ability-cost">コスト: {ab.cost}</span>
                {isUnique && <span className="ability-badge unique-badge">固有</span>}
                {isUltimate && <span className="ability-badge ult-badge">奥義</span>}
              </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
