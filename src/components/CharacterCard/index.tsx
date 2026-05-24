import { useState, useRef, useEffect, useCallback } from 'react';
import type { CharacterInstance, StatusEffect } from '../../types';
import { CHARACTERS } from '../../data/characters';
import { ATBGauge } from '../ATBGauge';
import { getRoleEmoji } from '../../systems/paradigm';

interface CharacterCardProps {
  char: CharacterInstance;
}

const BUFF_INFO: Record<string, { label: string; desc: string; emoji: string }> = {
  prot:    { label: 'プロテス',    desc: '物理ダメージ軽減',        emoji: '🛡' },
  shell:   { label: 'シェル',     desc: '魔法ダメージ軽減',        emoji: '🔮' },
  haste:   { label: 'ヘイスト',   desc: 'ATB充填速度1.5倍',       emoji: '⚡' },
  faith:   { label: 'フェイス',   desc: '魔法ダメージ増加',        emoji: '✨' },
  bravery: { label: 'ブレイバリー',desc: '物理ダメージ増加',        emoji: '⚔' },
  guard:      { label: 'ガード',       desc: '被ダメージを大幅軽減(50%)',  emoji: '🛡' },
  hguard:     { label: 'ヘビーガード', desc: '被ダメージを大幅軽減(90%)',  emoji: '🏰' },
  regen:      { label: 'リジェネ',    desc: '毎秒HPが徐々に回復',         emoji: '🌿' },
  veil:       { label: 'ヴェイル',    desc: 'デバフ耐性大幅アップ',        emoji: '💫' },
  barfire:    { label: 'バーファイア',desc: '炎属性ダメージ50%軽減',       emoji: '🔥🛡' },
  barice:     { label: 'バーアイス',  desc: '氷属性ダメージ50%軽減',       emoji: '🧊🛡' },
  barthunder: { label: 'バーサンダー',desc: '雷属性ダメージ50%軽減',       emoji: '⚡🛡' },
  barwind:    { label: 'バーウィンド',desc: '風属性ダメージ50%軽減',       emoji: '🌀🛡' },
  deprot:  { label: 'デプロテ',   desc: '物理防御低下',            emoji: '💔' },
  deshell: { label: 'デシェル',   desc: '魔法防御低下',            emoji: '💢' },
  slow:    { label: 'スロウ',     desc: 'ATB充填速度0.5倍',       emoji: '🐌' },
  pain:    { label: 'ペイン',     desc: '行動力低下',              emoji: '😣' },
  imperil: { label: 'インペリル', desc: '属性弱点増加',            emoji: '🔥' },
  curse:   { label: 'カース',     desc: 'ATB速度低下(呪い)',       emoji: '💀' },
  stop:    { label: 'ストップ',   desc: 'ATB停止',                emoji: '⏹' },
  poison:  { label: 'ポイズン',   desc: '毎秒ダメージ',            emoji: '☠️' },
};

interface FloatEntry {
  id: number;
  text: string;
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  offsetX: number;
}

let floatIdCounter = 0;

export function CharacterCard({ char }: CharacterCardProps) {
  const data = CHARACTERS.find(c => c.id === char.dataId);
  const [buffModal, setBuffModal] = useState<StatusEffect | null>(null);
  const [flashClass, setFlashClass] = useState('');
  const [floats, setFloats] = useState<FloatEntry[]>([]);
  const prevHP = useRef(char.currentHP);
  const prevEffectIds = useRef<string[]>(char.statusEffects.map(e => e.id));

  const addFloat = useCallback((text: string, type: FloatEntry['type']) => {
    const id = ++floatIdCounter;
    const offsetX = (Math.random() * 40) - 20; // -20 ~ +20px
    setFloats(prev => [...prev, { id, text, type, offsetX }]);
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== id));
    }, 1400);
  }, []);

  // HP変化検知（ダメージ・回復）
  useEffect(() => {
    const prev = prevHP.current;
    prevHP.current = char.currentHP;
    if (char.currentHP < prev && char.isAlive) {
      const diff = Math.round(prev - char.currentHP);
      setFlashClass('damage-flash');
      addFloat(`-${diff.toLocaleString()}`, 'damage');
      const t = setTimeout(() => setFlashClass(''), 500);
      return () => clearTimeout(t);
    }
    if (char.currentHP > prev) {
      const diff = Math.round(char.currentHP - prev);
      setFlashClass('heal-flash');
      addFloat(`+${diff.toLocaleString()}`, 'heal');
      const t = setTimeout(() => setFlashClass(''), 500);
      return () => clearTimeout(t);
    }
  }, [char.currentHP, char.isAlive, addFloat]);

  // ステータス効果変化検知（バフ・デバフ付与）
  useEffect(() => {
    const currentIds = char.statusEffects.map(e => e.id);
    const prevIds = prevEffectIds.current;
    const newEffects = char.statusEffects.filter(e => !prevIds.includes(e.id));
    prevEffectIds.current = currentIds;

    for (const eff of newEffects) {
      const info = BUFF_INFO[eff.id as string];
      const emoji = info?.emoji ?? '';
      const label = info?.label ?? eff.id;
      const text = `${emoji}${label}`;
      addFloat(text, eff.type === 'buff' ? 'buff' : 'debuff');
    }
  }, [char.statusEffects, addFloat]);

  if (!data) return null;

  const hpRatio = char.currentHP / char.maxHP;
  const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#ffcc00' : '#ff4444';

  return (
    <div className={`character-card ${!char.isAlive ? 'dead' : ''} ${flashClass}`}>
      {/* フロートテキスト */}
      <div className="float-container">
        {floats.map(f => (
          <span
            key={f.id}
            className={`float-text float-${f.type}`}
            style={{ '--float-x': `${f.offsetX}px` } as React.CSSProperties}
          >
            {f.text}
          </span>
        ))}
      </div>

      <div className="char-header">
        <span className="char-emoji">{data.emoji}</span>
        <span className="char-name">{data.name}</span>
        <span className="char-role">{getRoleEmoji(char.currentRole)} {char.currentRole}</span>
      </div>

      <div className="char-hp">
        <div className="hp-bar">
          <div className="hp-fill" style={{ width: `${hpRatio * 100}%`, backgroundColor: hpColor }} />
        </div>
        <span className="hp-text">{char.currentHP}/{char.maxHP}</span>
      </div>

      <ATBGauge char={char} />

      <div className="char-status">
        {char.statusEffects.map(eff => (
          <span
            key={eff.id}
            className={`status-badge ${eff.type}`}
            onClick={() => setBuffModal(eff)}
            title={`${eff.id} (${eff.duration.toFixed(1)}s)`}
          >
            {getStatusEmoji(eff.id as string)}
          </span>
        ))}
      </div>

      {char.lastActionName && (
        <div className="char-last-action">
          {char.lastActionCount && char.lastActionCount > 1
            ? `${char.lastActionName} ×${char.lastActionCount}`
            : char.lastActionName}
        </div>
      )}

      {!char.isAlive && <div className="dead-overlay">KO</div>}

      {/* バフ詳細モーダル */}
      {buffModal && (
        <div className="buff-modal-overlay" onClick={() => setBuffModal(null)}>
          <div className="buff-modal" onClick={e => e.stopPropagation()}>
            {(() => {
              const info = BUFF_INFO[buffModal.id as string];
              return (
                <>
                  <div className="buff-modal-icon">{info?.emoji ?? '?'}</div>
                  <div className="buff-modal-name">{info?.label ?? buffModal.id}</div>
                  <div className="buff-modal-desc">{info?.desc ?? ''}</div>
                  <div className="buff-modal-duration">残り {buffModal.duration.toFixed(1)}秒</div>
                  <div className={`buff-modal-type ${buffModal.type}`}>
                    {buffModal.type === 'buff' ? '強化効果' : '弱体効果'}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusEmoji(id: string): string {
  return BUFF_INFO[id]?.emoji ?? '?';
}
