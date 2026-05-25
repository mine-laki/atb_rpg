import { useState } from 'react';
import type { SaveData, RoleId, ParadigmData, SetupPreset } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { getRoleEmoji, getRoleLabel, getParadigmAutoName } from '../../systems/paradigm';

interface SetupScreenProps {
  saveData: SaveData;
  onStart: (updatedSave: SaveData) => void;
  onBack: () => void;
  setupPresets: (SetupPreset | null)[];
  onSavePreset: (slot: number, preset: SetupPreset) => void;
}

function makePresetName(partyIds: [string, string, string], paradigms: ParadigmData[]): string {
  const emojis = partyIds.map(id => CHARACTERS.find(c => c.id === id)?.emoji ?? '？').join('');
  return `${emojis} ${paradigms[0]?.name ?? ''}`;
}

export function SetupScreen({ saveData, onStart, onBack, setupPresets, onSavePreset }: SetupScreenProps) {
  const [party, setParty] = useState<[string, string, string]>(saveData.player.party);
  const [paradigms, setParadigms] = useState<ParadigmData[]>(saveData.paradigms);
  const [tab, setTab] = useState<'party' | 'paradigm'>('party');
  const [savedSlot, setSavedSlot] = useState<number | null>(null);
  // SP では初期折りたたみ、PC では初期展開
  const [presetsOpen, setPresetsOpen] = useState(
    () => window.matchMedia('(min-width: 600px)').matches
  );

  const unlockedChars = CHARACTERS
    .filter(c => saveData.progress.unlockedCharacters.includes(c.id))
    .sort((a, b) => {
      const aInParty = party.includes(a.id) ? 0 : 1;
      const bInParty = party.includes(b.id) ? 0 : 1;
      return aInParty - bInParty;
    });

  const handleCharSelect = (slot: 0 | 1 | 2, charId: string) => {
    const newParty = [...party] as [string, string, string];
    const existingSlot = newParty.indexOf(charId);
    if (existingSlot >= 0 && existingSlot !== slot) {
      newParty[existingSlot] = newParty[slot];
    }
    newParty[slot] = charId;
    setParty(newParty);

    const defaultRoles = newParty.map(id => {
      const char = CHARACTERS.find(c => c.id === id);
      return (char?.roles[0] ?? 'ATK') as RoleId;
    }) as [RoleId, RoleId, RoleId];

    setParadigms(prev => prev.map(p => ({
      ...p,
      roles: defaultRoles,
      name: getParadigmAutoName(defaultRoles),
    })));
  };

  const handleRoleChange = (paradigmSlot: number, charSlot: number, role: RoleId) => {
    setParadigms(prev => prev.map(p => {
      if (p.slot !== paradigmSlot) return p;
      const newRoles = [...p.roles] as [RoleId, RoleId, RoleId];
      newRoles[charSlot] = role;
      return { ...p, roles: newRoles, name: getParadigmAutoName(newRoles) };
    }));
  };

  const handleLoadPreset = (preset: SetupPreset) => {
    // 解放済みのキャラのみ読み込み
    const unlocked = saveData.progress.unlockedCharacters;
    const safeParty = preset.party.map(id =>
      unlocked.includes(id) ? id : unlocked[0]
    ) as [string, string, string];
    setParty(safeParty);
    setParadigms(preset.paradigms);
    setTab('party');
  };

  const handleSavePreset = (slot: number) => {
    const preset: SetupPreset = {
      name: makePresetName(party, paradigms),
      party,
      paradigms,
    };
    onSavePreset(slot, preset);
    setSavedSlot(slot);
    setTimeout(() => setSavedSlot(null), 1500);
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

      {/* プリセットパネル */}
      <div className="setup-presets">
        <button
          className="setup-presets-title"
          onClick={() => setPresetsOpen(o => !o)}
          aria-expanded={presetsOpen}
        >
          <span>📁 プリセット保存／読込</span>
          <span className="setup-presets-chevron">{presetsOpen ? '▲' : '▼'}</span>
        </button>
        {presetsOpen && <div className="setup-preset-list">
          {([0, 1, 2] as const).map(slot => {
            const preset = setupPresets[slot] ?? null;
            const isSaved = savedSlot === slot;
            return (
              <div key={slot} className={`setup-preset-slot ${preset ? 'filled' : ''}`}>
                <div className="setup-preset-num">スロット {slot + 1}</div>
                {preset ? (
                  <>
                    <div className="setup-preset-party">
                      {preset.party.map(id => CHARACTERS.find(c => c.id === id)?.emoji ?? '？').join('')}
                    </div>
                    <div className="setup-preset-paradigm">{preset.paradigms[0]?.name ?? ''}</div>
                    <div className="setup-preset-actions">
                      <button className="btn-preset-load" onClick={() => handleLoadPreset(preset)}>読込</button>
                      <button
                        className={`btn-preset-save ${isSaved ? 'saved' : ''}`}
                        onClick={() => handleSavePreset(slot)}
                      >
                        {isSaved ? '✓' : '上書'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="setup-preset-empty">空き</div>
                    <div className="setup-preset-actions">
                      <button
                        className={`btn-preset-save ${isSaved ? 'saved' : ''}`}
                        onClick={() => handleSavePreset(slot)}
                      >
                        {isSaved ? '✓ 保存済' : '保存'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>}
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
                  const charSaveData = saveData.player.roster.find(r => r.id === party[charSlot]);
                  const innate = char?.roles ?? [];
                  const extra = (charSaveData?.unlockedRoles ?? innate).filter(r => !innate.includes(r));
                  const availableRoles = [...innate, ...extra] as RoleId[];
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
