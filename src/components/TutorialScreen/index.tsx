import { useState } from 'react';

interface TutorialScreenProps {
  onBack: () => void;
}

type TutorialTab = 'battle' | 'stage' | 'growth';

interface TutorialItem {
  title: string;
  desc: string;
  emoji: string;
}

const BATTLE_ITEMS: TutorialItem[] = [
  { emoji: '⚡', title: 'ATBゲージ',
    desc: 'ゲージが溜まると自動で行動します。アビリティのコスト分のセグメントが消費されます（1〜4コスト）。' },
  { emoji: '🔗', title: 'チェーン & ブレイク',
    desc: '攻撃を連続で当てるとチェーンゲージが上昇します。最大まで溜めると敵がブレイク状態になり、その間は大ダメージを与えるチャンスです。' },
  { emoji: '🎯', title: 'オプティマ（作戦）',
    desc: 'パーティ3人のロール組み合わせです。戦況に合わせて切り替えることが攻略の鍵。切り替え時にATBが1セグメント補充されます。' },
  { emoji: '⚔️', title: 'ロール',
    desc: 'ATK: 物理攻撃 / BLA: 魔法攻撃 / DEF: 防御強化 / HLR: 回復 / ENH: バフ付与 / JAM: デバフ付与。各ロールのレベルが上がると効果が増します。' },
  { emoji: '💫', title: 'バフ・デバフ',
    desc: '戦闘中に付与される強化・弱体効果です。アイコンをタップすると詳細と残り時間を確認できます。' },
  { emoji: '🧪', title: 'アイテム',
    desc: '画面右のバッグボタンからアイテムを使用できます。ポーションは全体回復です。戦闘前にショップで購入しておきましょう。' },
];

const STAGE_ITEMS: TutorialItem[] = [
  { emoji: '🌊', title: 'ウェーブ制',
    desc: 'ステージは複数ウェーブで構成されています。全ウェーブの敵を倒すと勝利。ウェーブ間はHPが引き継がれます。' },
  { emoji: '👹', title: 'ボス',
    desc: '最終ウェーブには強力なボスが登場します。フェーズ移行時にバフや新技を使ってきます。ブレイクが攻略の鍵です。' },
  { emoji: '📦', title: 'ドロップ',
    desc: '敵を倒すと素材・装備・キャラフラグメント・換金アイテムなどをドロップします。ブレイク中に倒すとレアドロップが狙えます。' },
  { emoji: '🔁', title: 'NG+（ニューゲームプラス）',
    desc: '全ステージクリア後に解放。難易度が上昇しますが報酬も大幅増加します。NG+ではすべての敵が換金アイテムを落とすようになります。' },
  { emoji: '⭐', title: 'ステージ選択',
    desc: 'クリア済みのステージはいつでも再挑戦できます。難易度（NG+）を選んでトレーニングにも利用できます。' },
];

const GROWTH_ITEMS: TutorialItem[] = [
  { emoji: '📈', title: 'レベルアップ',
    desc: 'Gilを消費してキャラのHP・STR・MAGを強化します。レベルが上がるほど1レベルごとの上昇量も増加します（上限なし）。' },
  { emoji: '🎭', title: 'ロールレベル',
    desc: '各ロール専用のクリスタルとGilを消費して強化します。最大Lv.10まで上げられ、攻撃力・回復量・バフ時間などが増加します。' },
  { emoji: '🔓', title: 'ロール解放',
    desc: '初期から持っていないロールもクリスタル50個で習得できます。習得後はロールレベルタブで強化可能です（消費クリスタルは通常の10倍）。' },
  { emoji: '🧩', title: 'スキルボード',
    desc: 'HP・ステータス・ATBなどのパッシブボーナスを解放します。前提ノードをすべて解放することで次のノードが開放されます。' },
  { emoji: '⚔️', title: '装備',
    desc: '武器1本とアクセサリ最大4つを装備できます（Lv.10/20/30でスロット追加）。強化レベルを上げると性能が向上します。' },
  { emoji: '👥', title: 'キャラ解放',
    desc: '敵からフラグメントを3個集めることで新キャラクターを仲間にできます。フラグメントは戦闘後のドロップで入手可能です。' },
];

export function TutorialScreen({ onBack }: TutorialScreenProps) {
  const [tab, setTab] = useState<TutorialTab>('battle');

  const items = tab === 'battle' ? BATTLE_ITEMS : tab === 'stage' ? STAGE_ITEMS : GROWTH_ITEMS;

  return (
    <div className="tutorial-screen">
      <div className="tutorial-header">
        <button className="btn-back" onClick={onBack}>← 戻る</button>
        <h2>❓ ヘルプ</h2>
      </div>

      <div className="tutorial-tabs">
        <button
          className={`tutorial-tab ${tab === 'battle' ? 'active' : ''}`}
          onClick={() => setTab('battle')}
        >⚔️ 戦闘</button>
        <button
          className={`tutorial-tab ${tab === 'stage' ? 'active' : ''}`}
          onClick={() => setTab('stage')}
        >🗺️ ステージ</button>
        <button
          className={`tutorial-tab ${tab === 'growth' ? 'active' : ''}`}
          onClick={() => setTab('growth')}
        >💪 育成</button>
      </div>

      <div className="tutorial-content">
        {items.map((item, i) => (
          <div key={i} className="tutorial-item">
            <div className="tutorial-item-header">
              <span className="tutorial-item-emoji">{item.emoji}</span>
              <span className="tutorial-item-title">{item.title}</span>
            </div>
            <p className="tutorial-item-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
