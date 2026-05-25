import { useState } from 'react';
import { ENEMIES } from '../../data/enemies';
import { EQUIPMENT_DATA, MATERIALS, getEquipmentById } from '../../data/equipment';
import type { EnemyData } from '../../types';

interface EnemyReportScreenProps {
  encounteredEnemies: string[];
  obtainedEquipments: string[];
  onBack: () => void;
}

const ELEMENT_ICONS: Record<string, string> = {
  fire: '🔥', ice: '🧊', thunder: '⚡️', wind: '🌪️',
  light: '💡', holy: '💡', dark: '⚫️', water: '💧', earth: '🌍', none: '—',
};

function ElementTag({ el, type }: { el: string; type: 'weak' | 'resist' }) {
  const icon = ELEMENT_ICONS[el] ?? el;
  return (
    <span className={`element-tag ${type}`} title={el}>{icon}</span>
  );
}

function getItemLabel(itemId: string, dropType?: string): { name: string; emoji: string } {
  if (dropType === 'equipment' || (!dropType && itemId.startsWith('relic_') || itemId.startsWith('sword_') || itemId.startsWith('staff_') || itemId.startsWith('bow_') || itemId.startsWith('shield_') || itemId.startsWith('acc_'))) {
    const eq = getEquipmentById(itemId);
    if (eq) return { name: eq.name, emoji: eq.emoji };
  }
  if (dropType === 'fragment' || itemId.startsWith('fragment_')) {
    return { name: `${itemId.replace('fragment_', '')}のかけら`, emoji: '💎' };
  }
  const mat = MATERIALS.find(m => m.id === itemId);
  if (mat) return { name: mat.name, emoji: mat.emoji };
  return { name: itemId.replace(/_/g, ' '), emoji: '📦' };
}

function DropList({ enemy }: { enemy: EnemyData }) {
  const { common, uncommon, rare } = enemy.dropTable;
  const uniqueCommon   = common.filter(d => d.itemId !== 'enhance_stone_normal');
  const allUncommon    = uncommon;
  const allRare        = rare;

  if (!uniqueCommon.length && !allUncommon.length && !allRare.length) return null;

  return (
    <div className="er-drop-section">
      <span className="er-drop-title">ドロップ</span>
      <div className="er-drop-list">
        {uniqueCommon.map(d => {
          const { name, emoji } = getItemLabel(d.itemId, d.dropType);
          return (
            <span key={d.itemId} className="er-drop-item common">
              {emoji} {name} <span className="er-drop-rate">{Math.round(d.rate * 100)}%</span>
            </span>
          );
        })}
        {allUncommon.map(d => {
          const { name, emoji } = getItemLabel(d.itemId, d.dropType);
          return (
            <span key={d.itemId} className="er-drop-item uncommon">
              {emoji} {name} <span className="er-drop-rate">{Math.round(d.rate * 100)}%</span>
            </span>
          );
        })}
        {allRare.map(d => {
          const { name, emoji } = getItemLabel(d.itemId, d.dropType);
          return (
            <span key={d.itemId} className={`er-drop-item rare ${d.dropType === 'equipment' ? 'equip-drop' : ''}`}>
              {emoji} {name} <span className="er-drop-rate">{Math.round(d.rate * 100)}%</span>
              {d.dropType === 'equipment' && <span className="er-drop-equip-badge">装備</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function EnemyCard({ enemy }: { enemy: EnemyData }) {
  const debuffRate = enemy.debuffSuccessRate;
  return (
    <div className={`enemy-report-card ${enemy.isBoss ? 'boss' : ''}`}>
      <div className="enemy-report-header">
        <span className="enemy-report-emoji">{enemy.emoji}</span>
        <div className="enemy-report-info">
          <span className="enemy-report-name">{enemy.name}</span>
          {enemy.isBoss && <span className="boss-tag">BOSS</span>}
        </div>
      </div>
      <div className="enemy-report-stats">
        <div className="enemy-report-stat">HP: {enemy.maxHP.toLocaleString()}</div>
        {(enemy.physDef ?? 0) > 0 && (
          <div className="enemy-report-stat">物理防御: {enemy.physDef}%</div>
        )}
        {(enemy.magDef ?? 0) > 0 && (
          <div className="enemy-report-stat">魔法防御: {enemy.magDef}%</div>
        )}
        {enemy.physResist && (
          <div className="enemy-report-stat">物理耐性: {Math.round(enemy.physResist * 100)}%</div>
        )}
        {debuffRate !== undefined && (
          <div className="enemy-report-stat">
            デバフ耐性: <span style={{ color: debuffRate <= 20 ? '#ff6666' : debuffRate <= 50 ? '#ffaa44' : '#88ccaa' }}>
              {debuffRate === 0 ? '完全耐性' : `${debuffRate}%`}
            </span>
          </div>
        )}
        {enemy.isBoss && (() => {
          const rate = enemy.chainBuildRate ?? 1.0;
          const max  = enemy.chainResistMax ?? 999;
          const label = rate >= 1.5 ? '速' : rate <= 0.5 ? '遅' : '普通';
          const rateColor = rate >= 1.5 ? '#88ccff' : rate <= 0.5 ? '#ffaa66' : '#aaaacc';
          const maxColor  = max <= 300 ? '#ff8866' : max <= 600 ? '#ffcc66' : '#aaaacc';
          return (
            <div className="enemy-report-stat">
              チェーン蓄積: <span style={{ color: rateColor }}>×{rate.toFixed(1)} ({label})</span>
              　上限: <span style={{ color: maxColor }}>{max}%</span>
            </div>
          );
        })()}
      </div>
      {enemy.weaknesses.length > 0 && (
        <div className="enemy-report-elements">
          <span className="element-label">弱点:</span>
          {enemy.weaknesses.map(w => <ElementTag key={w} el={w} type="weak" />)}
        </div>
      )}
      {enemy.resistances.length > 0 && (
        <div className="enemy-report-elements">
          <span className="element-label">耐性:</span>
          {enemy.resistances.map(r => <ElementTag key={r} el={r} type="resist" />)}
        </div>
      )}
      <DropList enemy={enemy} />
    </div>
  );
}

const WEAPON_TYPE_LABEL: Record<string, string> = {
  sword: '⚔️ 剣', staff: '🪄 杖', bow: '🏹 弓', shield: '🛡️ 盾',
  holy: '✨ 聖', instrument: '🎵 楽器', cursed: '💀 呪器',
};

function effectLabel(eff: { type: string; value: number; element?: string }): string | null {
  if (eff.type === 'atb_expand')    return 'ATB+1';
  if (eff.type === 'atb_speed')     return `速度+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'heal_boost')    return `回復+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'chain_boost')   return `チェーン+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'damage_boost')  return `ダメ+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'buff_extend')   return `バフ+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'debuff_rate')   return `デバフ率+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'auto_regen')    return 'リジェネ';
  if (eff.type === 'magic_cost_reduce') return `魔法コスト-${eff.value}`;
  if (eff.type === 'element_resist') return `${eff.element}耐性+${Math.round(eff.value * 100)}%`;
  if (eff.type === 'auto_buff')     return '開幕バフ';
  if (eff.type === 'revive_once')   return '復活';
  return null;
}

function EquipCatalog({ obtainedEquipments }: { obtainedEquipments: string[] }) {
  const obtained = new Set(obtainedEquipments);
  const weapons     = EQUIPMENT_DATA.filter(e => e.type === 'weapon');
  const accessories = EQUIPMENT_DATA.filter(e => e.type === 'accessory');

  const obtainedCount = EQUIPMENT_DATA.filter(e => obtained.has(e.id)).length;

  function EquipRow({ e }: { e: typeof EQUIPMENT_DATA[0] }) {
    const isObtained = obtained.has(e.id);
    if (!isObtained) {
      return (
        <div className="equip-catalog-row unknown">
          <span className="equip-catalog-emoji">？</span>
          <div className="equip-catalog-info">
            <span className="equip-catalog-name unknown-name">
              {e.type === 'weapon'
                ? (WEAPON_TYPE_LABEL[e.weaponType ?? ''] ?? '武器')
                : 'アクセサリ'}
            </span>
            <span className="equip-catalog-hint">未入手</span>
          </div>
        </div>
      );
    }

    const stats = [
      e.baseStats.hp  ? `HP+${e.baseStats.hp}`   : null,
      e.baseStats.str ? `STR+${e.baseStats.str}`  : null,
      e.baseStats.mag ? `MAG+${e.baseStats.mag}`  : null,
    ].filter(Boolean);
    const effs = e.effects.map(ef => effectLabel(ef)).filter(Boolean) as string[];

    return (
      <div className="equip-catalog-row obtained">
        <span className="equip-catalog-emoji">{e.emoji}</span>
        <div className="equip-catalog-info">
          <div className="equip-catalog-name-row">
            <span className="equip-catalog-name">{e.name}</span>
            {e.type === 'weapon' && e.weaponType && (
              <span className="equip-catalog-type-tag">
                {WEAPON_TYPE_LABEL[e.weaponType] ?? e.weaponType}
              </span>
            )}
          </div>
          {(stats.length > 0 || effs.length > 0) && (
            <div className="equip-catalog-tags">
              {stats.map((s, i) => <span key={i} className="equip-tag stat">{s}</span>)}
              {effs.map((ef, i) => <span key={i} className="equip-tag eff">{ef}</span>)}
              {e.shopPrice === 0 && <span className="equip-tag drop-only">ドロップ専用</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="equip-catalog">
      <div className="equip-catalog-header">
        <span className="equip-catalog-progress">
          入手済み {obtainedCount} / {EQUIPMENT_DATA.length}
        </span>
      </div>

      <div className="equip-catalog-section">
        <h3 className="equip-catalog-section-title">⚔️ 武器</h3>
        <div className="equip-catalog-list">
          {weapons.map(e => <EquipRow key={e.id} e={e} />)}
        </div>
      </div>

      <div className="equip-catalog-section">
        <h3 className="equip-catalog-section-title">💍 アクセサリ</h3>
        <div className="equip-catalog-list">
          {accessories.map(e => <EquipRow key={e.id} e={e} />)}
        </div>
      </div>
    </div>
  );
}

export function EnemyReportScreen({ encounteredEnemies, obtainedEquipments, onBack }: EnemyReportScreenProps) {
  const [tab, setTab] = useState<'enemy' | 'equip'>('enemy');

  const encountered = ENEMIES.filter(e => encounteredEnemies.includes(e.id));
  const normals = encountered.filter(e => !e.isBoss);
  const bosses  = encountered.filter(e => e.isBoss);

  return (
    <div className="enemy-report-screen">
      <div className="enhance-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>{tab === 'enemy' ? 'エネミーレポート' : '装備図鑑'}</h2>
        {tab === 'enemy'
          ? <span className="enemy-report-count">{encountered.length} / {ENEMIES.length}</span>
          : <span className="enemy-report-count">{(obtainedEquipments ?? []).length} / {EQUIPMENT_DATA.length}</span>
        }
      </div>

      {/* タブ */}
      <div className="report-tabs">
        <button className={tab === 'enemy' ? 'active' : ''} onClick={() => setTab('enemy')}>📋 エネミー</button>
        <button className={tab === 'equip' ? 'active' : ''} onClick={() => setTab('equip')}>⚔️ 装備図鑑</button>
      </div>

      {tab === 'enemy' && (
        <>
          {encountered.length === 0 && (
            <div className="no-items" style={{ textAlign: 'center', marginTop: '2rem' }}>
              まだ戦闘していません。バトルで敵を倒すとレポートが記録されます。
            </div>
          )}
          {normals.length > 0 && (
            <div className="enemy-report-section">
              <h3 className="enemy-report-section-title">通常敵</h3>
              <div className="enemy-report-list">
                {normals.map(e => <EnemyCard key={e.id} enemy={e} />)}
              </div>
            </div>
          )}
          {bosses.length > 0 && (
            <div className="enemy-report-section">
              <h3 className="enemy-report-section-title">ボス</h3>
              <div className="enemy-report-list">
                {bosses.map(e => <EnemyCard key={e.id} enemy={e} />)}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'equip' && (
        <EquipCatalog obtainedEquipments={obtainedEquipments ?? []} />
      )}
    </div>
  );
}
