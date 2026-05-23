import { useState } from 'react';
import type { SaveData, RoleId, ParadigmData } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { getRoleEmoji, getRoleLabel } from '../../systems/paradigm';

interface SetupScreenProps {
  saveData: SaveData;
  onStart: (updatedSave: SaveData) => void;
  onBack: () => void;
}

export function SetupScreen({ saveData, onStart, onBack }: SetupScreenProps) {
  const [party, setParty] = useState<[string, string, string]>(saveData.player.party);
  const [paradigms, setParadigms] = useState<ParadigmData[]>(saveData.paradigms);
  const [tab, setTab] = useState<'party' | 'paradigm'>('party');

  const unlockedChars = CHARACTERS.filter(c =>
    saveData.progress.unlockedCharacters.includes(c.id)
  );

  const handleCharSelect = (slot: 0 | 1 | 2, charId: string) => {
    const newParty = [...party] as [string, string, string];
    const existingSlot = newParty.indexOf(charId);
    if (existingSlot >= 0 && existingSlot !== slot) {
      newParty[existingSlot] = newParty[slot];
    }
    newParty[slot] = charId;
    setParty(newParty);
  };

  const handleRoleChange = (paradigmSlot: number, charSlot: number, role: RoleId) => {
    setParadigms(prev => prev.map(p => {
      if (p.slot !== paradigmSlot) return p;
      const newRoles = [...p.roles] as [RoleId, RoleId, RoleId];
      newRoles[charSlot] = role;
      return { ...p, roles: newRoles };
    }));
  };

  const handleStart = () => {
    onStart({ ...saveData, player: { ...saveData.player, party }, paradigms });
  };

  return (
    <div className="setup-screen">
      <div className="setup-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>編成</h2>
        <div className="setup-tabs">
          <button className={tab === 'party' ? 'active' : ''} onClick={() => setTab('party')}>パーティ</button>
          <button className={tab === 'paradigm' ? 'active' : ''} onClick={() => setTab('paradigm')}>作戦</button>
        </div>
      </div>

      {tab === 'party' && (
        <div className="party-setup">
          <div className="selected-party">
            {([0, 1, 2] as const).map(slot => {
              const char = CHARACTERS.find(c => c.id === party[slot]);
              return (
                <div key={slot} className="party-slot">
                  <div className="slot-num">スロット{slot + 1}</div>
                  {char ? (
                    <div className="slot-char">
                      <span className="char-emoji">{char.emoji}</span>
                      <span className="char-name">{char.name}</span>
                      <div className="char-roles">
                        {char.roles.map(r => (
                          <span key={r} className="role-badge">{getRoleEmoji(r)} {r}</span>
                        ))}
                      </div>
                    </div>
                  ) : <div className="slot-empty">未選択</div>}
                </div>
              );
            })}
          </div>

          <h3>キャラクター選択</h3>
          <div className="char-roster">
            {unlockedChars.map(char => {
              const charSave = saveData.player.roster.find(r => r.id === char.id);
              const isInParty = party.includes(char.id);
              return (
                <div key={char.id} className={`char-card ${isInParty ? 'in-party' : ''}`}>
                  <span className="char-emoji">{char.emoji}</span>
                  <span className="char-name">{char.name}</span>
                  <span className="char-level">Lv.{charSave?.level ?? 1}</span>
                  <div className="char-roles">
                    {char.roles.map(r => <span key={r} className="role-badge">{getRoleEmoji(r)}</span>)}
                  </div>
                  <div className="char-actions">
                    {([0, 1, 2] as const).map(slot => (
                      <button
                        key={slot}
                        className={`slot-btn ${party[slot] === char.id ? 'selected' : ''}`}
                        onClick={() => handleCharSelect(slot, char.id)}
                      >
                        {slot + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'paradigm' && (
        <div className="paradigm-setup">
          <p className="paradigm-hint">各スロットの3キャラのロールを設定してください</p>
          {paradigms.map(p => (
            <div key={p.slot} className="paradigm-edit">
              <div className="paradigm-edit-header">
                <span className="paradigm-num">{p.slot + 1}. {p.name}</span>
              </div>
              <div className="paradigm-roles-edit">
                {([0, 1, 2] as const).map(charSlot => {
                  const char = CHARACTERS.find(c => c.id === party[charSlot]);
                  const availableRoles = char?.roles ?? [];
                  return (
                    <div key={charSlot} className="paradigm-char-role">
                      <span>{char?.emoji ?? '?'} {char?.name ?? `スロット${charSlot + 1}`}</span>
                      <select
                        value={p.roles[charSlot]}
                        onChange={e => handleRoleChange(p.slot, charSlot, e.target.value as RoleId)}
                      >
                        {availableRoles.map(r => (
                          <option key={r} value={r}>{getRoleEmoji(r)} {getRoleLabel(r)}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="setup-footer">
        <button className="btn-primary btn-large" onClick={handleStart}>
          バトル開始!
        </button>
      </div>
    </div>
  );
}
