import { ENEMIES } from '../../data/enemies';
import { MATERIALS, getEquipmentById } from '../../data/equipment';
import type { EnemyData } from '../../types';

interface EnemyReportScreenProps {
  encounteredEnemies: string[];
  onBack: () => void;
}

const ELEMENT_LABELS: Record<string, string> = {
  fire: '炎', ice: '氷', thunder: '雷', wind: '風',
  water: '水', earth: '土', holy: '聖', dark: '闇', none: '無',
};

function ElementTag({ el, type }: { el: string; type: 'weak' | 'resist' }) {
  const label = ELEMENT_LABELS[el] ?? el;
  return (
    <span className={`element-tag ${type}`}>{label}</span>
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
  // 固有ドロップのみ表示（enhance_stone_normalは省く）
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

export function EnemyReportScreen({ encounteredEnemies, onBack }: EnemyReportScreenProps) {
  const encountered = ENEMIES.filter(e => encounteredEnemies.includes(e.id));
  const normals = encountered.filter(e => !e.isBoss);
  const bosses = encountered.filter(e => e.isBoss);

  return (
    <div className="enemy-report-screen">
      <div className="enhance-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>エネミーレポート</h2>
        <span className="enemy-report-count">{encountered.length} / {ENEMIES.length}</span>
      </div>

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
    </div>
  );
}
