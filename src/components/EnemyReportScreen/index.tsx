import { ENEMIES } from '../../data/enemies';
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

function EnemyCard({ enemy }: { enemy: EnemyData }) {
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
