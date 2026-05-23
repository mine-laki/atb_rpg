import { useState } from 'react';
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
  guard:   { label: 'ガード',     desc: '被ダメージを大幅軽減',    emoji: '🛡' },
  regen:   { label: 'リジェネ',   desc: '毎秒HPが徐々に回復',     emoji: '🌿' },
  veil:    { label: 'ヴェイル',   desc: 'デバフ耐性アップ',        emoji: '💫' },
  deprot:  { label: 'デプロテ',   desc: '物理防御低下',            emoji: '💔' },
  deshell: { label: 'デシェル',   desc: '魔法防御低下',            emoji: '💢' },
  slow:    { label: 'スロウ',     desc: 'ATB充填速度0.5倍',       emoji: '🐌' },
  pain:    { label: 'ペイン',     desc: '行動力低下',              emoji: '😣' },
  imperil: { label: 'インペリル', desc: '属性弱点増加',            emoji: '🔥' },
  curse:   { label: 'カース',     desc: 'ATB速度低下(呪い)',       emoji: '💀' },
  stop:    { label: 'ストップ',   desc: 'ATB停止',                emoji: '⏹' },
  poison:  { label: 'ポイズン',   desc: '毎秒ダメージ',            emoji: '☠️' },
};

export function CharacterCard({ char }: CharacterCardProps) {
  const data = CHARACTERS.find(c => c.id === char.dataId);
  const [buffModal, setBuffModal] = useState<StatusEffect | null>(null);

  if (!data) return null;

  const hpRatio = char.currentHP / char.maxHP;
  const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#ffcc00' : '#ff4444';

  return (
    <div className={`character-card ${!char.isAlive ? 'dead' : ''}`}>
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
