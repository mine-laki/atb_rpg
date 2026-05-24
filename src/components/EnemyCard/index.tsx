import { useRef, useEffect, useState, useCallback } from 'react';
import type { EnemyInstance } from '../../types';
import { getEnemyById } from '../../data/enemies';
import { ChainGauge } from '../ChainGauge';

interface EnemyCardProps {
  enemy: EnemyInstance;
}

const DEBUFF_INFO: Record<string, { label: string; emoji: string }> = {
  deprot:  { label: 'デプロテ',   emoji: '💔' },
  deshell: { label: 'デシェル',   emoji: '💢' },
  slow:    { label: 'スロウ',     emoji: '🐌' },
  pain:    { label: 'ペイン',     emoji: '😣' },
  imperil: { label: 'インペリル', emoji: '🔥' },
  curse:   { label: 'カース',     emoji: '💀' },
  stop:    { label: 'ストップ',   emoji: '⏹' },
  poison:  { label: 'ポイズン',   emoji: '☠️' },
};

interface FloatEntry {
  id: number;
  text: string;
  type: 'damage' | 'debuff' | 'break';
  offsetX: number;
}

let floatIdCounter = 0;

export function EnemyCard({ enemy }: EnemyCardProps) {
  const data = getEnemyById(enemy.dataId);
  const [flashClass, setFlashClass] = useState('');
  const [floats, setFloats] = useState<FloatEntry[]>([]);
  const prevHP = useRef(enemy.currentHP);
  const prevDebuffIds = useRef<string[]>(
    enemy.statusEffects.filter(e => e.type === 'debuff').map(e => e.id)
  );
  const prevBreaking = useRef(enemy.isBreaking);

  const addFloat = useCallback((text: string, type: FloatEntry['type']) => {
    const id = ++floatIdCounter;
    const offsetX = (Math.random() * 40) - 20;
    setFloats(prev => [...prev, { id, text, type, offsetX }]);
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== id));
    }, 1400);
  }, []);

  // HPダメージ検知
  useEffect(() => {
    const prev = prevHP.current;
    prevHP.current = enemy.currentHP;
    if (enemy.currentHP < prev && enemy.currentHP > 0) {
      const diff = Math.round(prev - enemy.currentHP);
      setFlashClass('damage-flash');
      addFloat(`-${diff.toLocaleString()}`, 'damage');
      const t = setTimeout(() => setFlashClass(''), 500);
      return () => clearTimeout(t);
    }
  }, [enemy.currentHP, addFloat]);

  // デバフ付与検知
  useEffect(() => {
    const currentDebuffs = enemy.statusEffects.filter(e => e.type === 'debuff');
    const currentIds = currentDebuffs.map(e => e.id);
    const prevIds = prevDebuffIds.current;
    const newDebuffs = currentDebuffs.filter(e => !prevIds.includes(e.id));
    prevDebuffIds.current = currentIds;

    if (newDebuffs.length > 0) {
      setFlashClass('debuff-flash');
      const t = setTimeout(() => setFlashClass(''), 600);
      for (const eff of newDebuffs) {
        const info = DEBUFF_INFO[eff.id as string];
        const emoji = info?.emoji ?? '';
        const label = info?.label ?? eff.id;
        addFloat(`${emoji}${label}`, 'debuff');
      }
      return () => clearTimeout(t);
    }
  }, [enemy.statusEffects, addFloat]);

  // ブレイク突入検知
  useEffect(() => {
    if (enemy.isBreaking && !prevBreaking.current) {
      addFloat('BREAK!', 'break');
    }
    prevBreaking.current = enemy.isBreaking;
  }, [enemy.isBreaking, addFloat]);

  if (!data) return null;

  const isDead = enemy.currentHP <= 0;
  const hpRatio = isDead ? 0 : enemy.currentHP / enemy.maxHP;

  return (
    <div className={`enemy-card ${isDead ? 'enemy-dead' : ''} ${flashClass}`}>
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

      <div className="enemy-header">
        <span className="enemy-emoji">{data.emoji}</span>
        <span className="enemy-name">{data.name}</span>
        {data.isBoss && !isDead && <span className="boss-badge">BOSS</span>}
        {isDead && <span className="enemy-defeated-badge">DEFEAT</span>}
      </div>

      <div className="enemy-hp">
        <div className="hp-bar enemy">
          <div
            className="hp-fill"
            style={{
              width: `${hpRatio * 100}%`,
              backgroundColor: hpRatio > 0.5 ? '#cc4444' : hpRatio > 0.25 ? '#ff8800' : '#ff0000',
            }}
          />
        </div>
        <span className="hp-text">
          {isDead ? '0' : enemy.currentHP.toLocaleString()}/{enemy.maxHP.toLocaleString()}
        </span>
      </div>

      {!isDead && <ChainGauge enemy={enemy} />}

      {!isDead && data.weaknesses.length > 0 && (
        <div className="enemy-weaknesses">
          弱点: {data.weaknesses.map(w => getElementEmoji(w)).join(' ')}
        </div>
      )}

      {!isDead && (
        <div className="enemy-status">
          {enemy.statusEffects.map(eff => (
            <span key={eff.id} className={`status-badge ${eff.type}`}>
              {eff.id} ({eff.duration.toFixed(1)}s)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function getElementEmoji(el: string): string {
  const map: Record<string, string> = {
    fire: '🔥', ice: '🧊', thunder: '⚡', wind: '🌀',
    water: '🌊', earth: '🌍', holy: '✨', dark: '🌑',
  };
  return map[el] ?? el;
}
