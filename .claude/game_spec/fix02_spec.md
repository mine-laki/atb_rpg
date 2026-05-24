# fix02 実装仕様書

> 対象ファイル一覧・変更規模・依存関係を含む詳細設計書。  
> fix02.md の5機能を実装順（依存が少ない順）に定義する。

---

## 実装順序（推奨）

| 順 | 機能 | 優先度 | 難易度 |
|---|---|---|---|
| 1 | 装備売却確認モーダル | 1 | 小 |
| 2 | パーティカードのロール表記変更 | 5 | 小 |
| 3 | 換金アイテムドロップ | 3 | 中 |
| 4 | チュートリアルページ | 2 | 中 |
| 5 | ロール解放機能 | 4 | 大 |

---

## 機能1: 装備売却確認モーダル

### 概要
ShopScreen の売却タブで「売却」ボタンを押したとき、確認モーダルを挟む。

### 変更ファイル
- `src/components/ShopScreen/index.tsx` のみ

### 実装詳細

**追加 state:**
```ts
const [sellConfirm, setSellConfirm] = useState<string | null>(null); // instanceId
```

**フロー変更:**
1. 「売却」ボタンクリック → `setSellConfirm(instanceId)` (モーダル表示)
2. モーダル内「確定」→ `sellEquipment(instanceId)` → `setSellConfirm(null)`
3. モーダル内「キャンセル」→ `setSellConfirm(null)`

**モーダル表示内容:**
- 装備名・emoji・強化レベル（+N）
- 売却価格（calcSellPrice の結果）
- 「確定」ボタン（危険色: オレンジ系）
- 「キャンセル」ボタン

**CSS クラス:**
- `.sell-confirm-overlay` / `.sell-confirm-modal` / `.sell-confirm-price` / `.sell-confirm-btns`

---

## 機能2: パーティカードのロール表記変更

### 概要
`HomeScreen` のパーティカードモーダル内、各キャラの「初期ロールのみ」表示を「全ロール（3〜4個）のロールレベル一覧」に変更する。  
EnhanceScreen の `char-info-panel` の `.char-role-lv-badge` と同じコンパクト表示を流用する。

### 変更ファイル
- `src/components/HomeScreen/index.tsx` のみ

### 実装詳細

**partyMembers の拡張:**
```ts
// 変更前
const initialRole = charData?.roles[0];
const roleLevel = initialRole ? (charSave?.roleLevels?.[initialRole] ?? 1) : 1;

// 変更後: 全ロール（固有ロール + 解放済ロール）
const allRoles = [
  ...(charData?.roles ?? []),
  ...(charSave?.unlockedRoles?.filter(r => !charData?.roles.includes(r)) ?? []),
];
const roleLevelMap = charSave?.roleLevels ?? {};
```

**JSX変更:**
```tsx
// 変更前: initialRole と roleLevel を表示
{initialRole && (
  <span className="pc-role">
    {getRoleEmoji(initialRole)} {getRoleLabel(initialRole)} Lv.{roleLevel}
  </span>
)}

// 変更後: 全ロールをバッジで横並び
<div className="pc-role-list">
  {allRoles.map(role => (
    <span key={role} className={`pc-role-badge role-color-${role.toLowerCase()}`}>
      {getRoleEmoji(role)} Lv.{roleLevelMap[role] ?? 1}
    </span>
  ))}
</div>
```

**CSS クラス:**
- `.pc-role-list` → flexbox, wrap, gap 2px
- `.pc-role-badge` → 小型チップ（EnhanceScreen の `.char-role-lv-badge` と同スタイル）

---

## 機能3: 換金アイテムドロップ

### 概要
ボスとNG+敵が「換金アイテム」をドロップする。換金アイテムは ResultScreen に表示され、  
自動でGilに変換してインベントリには残らない（フラグメント換金と同じ方式）。

### 換金アイテム定義

| id | emoji | 売値 |
|---|---|---|
| `coin_small` | 💰 | 1,000 Gil |
| `coin_medium` | 💵 | 5,000 Gil |
| `coin_large` | 💍 | 10,000 Gil |

### 変更ファイル
1. `src/data/items.ts` — 換金アイテム定義を追加
2. `src/types/index.ts` — `DropItem.type` に `'valuable'` を追加  
3. `src/App.tsx` — `calcBattleRewards` でドロップ処理、`handleVictory` で自動換金
4. `src/data/enemies.ts` — ボスの dropTable に換金アイテムを追加
5. `src/components/ResultScreen/index.tsx` — 換金アイテムの表示

### 実装詳細

#### src/data/items.ts
```ts
export interface ValuableItem {
  id: string;
  name: string;
  emoji: string;
  sellValue: number;
}

export const VALUABLE_ITEMS: ValuableItem[] = [
  { id: 'coin_small',  name: '小銭袋', emoji: '💰', sellValue: 1000 },
  { id: 'coin_medium', name: '札束',   emoji: '💵', sellValue: 10000 },
  { id: 'coin_large',  name: 'おたから', emoji: '💍', sellValue: 50000 },
];

export function getValuableById(id: string): ValuableItem | undefined {
  return VALUABLE_ITEMS.find(v => v.id === id);
}
```

#### src/types/index.ts — DropItem 変更
```ts
export interface DropItem {
  type: 'equipment' | 'material' | 'fragment' | 'valuable'; // 'valuable' 追加
  itemId: string;
  quantity: number;
}
```

#### ドロップロジック（App.tsx の calcBattleRewards 内）

**通常ボスドロップ（ngPlus=0 でも）:**
```
isBoss && 倒した → coin_small / coin_medium / coin_large からランダム1個を確定ドロップ
```

**NG+全敵ドロップ:**
```
ngPlus >= 1 の全倒した敵 →
  各敵について 20% 確率でドロップ判定
  → ヒット時: 3種からランダムに ngPlus 個 をドロップ（重複あり）
```

**NG+ボスドロップ:**
```
NG+ボス → 上記の20%判定 + 確定ドロップ1個（計最低1個、確率次第でそれ以上）
```

#### handleVictory の自動換金
フラグメント換金と同様に `filteredDrops` の前処理で:
```ts
// 換金アイテムを自動でGilに変換
const VALUABLE_ITEMS_MAP = { coin_small: 1000, coin_medium: 5000, coin_large: 10000 };
for (const drop of rewards.drops) {
  if (drop.type === 'valuable') {
    bonusGil += (VALUABLE_ITEMS_MAP[drop.itemId] ?? 0) * drop.quantity;
    // filteredDrops には残す（ResultScreen で表示するため）
  }
}
// mergeDrops には渡さない（材料インベントリには入れない）
const filteredDrops = rewards.drops.filter(d => d.type !== 'valuable');
```

→ ResultScreen には `lastRewards.drops` にそのまま渡すので表示される。  
　表示は `💰 小金貨 ×2 (2,000 Gil)` のような形式。

#### enemies.ts — ボスの dropTable 変更例
```ts
// arch_lich, chaosgod, sky_behemoth, finalboss, chaos_knight, deathord の isBoss 敵について
// common に換金アイテムを追加（App.tsx 側で確定処理するため dropTable には記載不要）
// → App.tsx の calcBattleRewards で isBoss フラグを使って処理するため enemies.ts への変更は不要
```

---

## 機能4: チュートリアルページ

### 概要
新規スクリーン `TutorialScreen` を追加。ホームから「？」ボタンでアクセス。  
戦闘・ステージ・育成の3セクションをタブ形式で表示。

### 変更ファイル
1. `src/types/index.ts` — `GameScreen` に `'tutorial'` を追加
2. `src/components/TutorialScreen/index.tsx` — 新規作成
3. `src/components/HomeScreen/index.tsx` — チュートリアルボタン追加
4. `src/App.tsx` — `TutorialScreen` のルーティング追加

### TutorialScreen の構成

**タブ:**
- 「⚔️ 戦闘」/ 「🗺️ ステージ」/ 「💪 育成」

**戦闘タブ内容:**
```
ATBゲージ: ゲージが溜まると自動で行動します（1〜4コスト）
ブレイク: チェーンゲージを最大まで溜めると敵がブレイク状態になり、大ダメージを与えるチャンスです
オプティマ: パーティ3人のロール組み合わせ。戦況に合わせて切り替えましょう
ロール: ATK=物理攻撃 / BLA=魔法攻撃 / DEF=防御強化 / HLR=回復 / ENH=バフ付与 / JAM=デバフ付与
バフ・デバフ: 戦闘中に付与される強化・弱体効果。バッジをタップすると詳細を確認できます
```

**ステージタブ内容:**
```
ウェーブ制: ステージは複数ウェーブで構成されています。全ウェーブを突破すると勝利
ボス: 最終ウェーブには強力なボスが登場します。ブレイクが攻略の鍵です
NG+: 全ステージクリア後に解放。難易度が上昇しますが報酬も増加します
ドロップ: 敵を倒すと素材・装備・フラグメントなどをドロップします
```

**育成タブ内容:**
```
レベルアップ: Gilを消費してキャラのHPとSTR/MAGを強化。レベルが上がるほど上昇量も増加
ロールレベル: 各ロールの専用クリスタルとGilを消費して強化。最大Lv.10
スキルボード: HP・ステータス・ATBなどのパッシブボーナスを解放
装備: 武器1本とアクセサリ最大4つを装備可能。強化レベルを上げると性能が向上
ロール解放: クリスタル50個を消費して新しいロールを習得できます
```

### App.tsx への追加
```tsx
if (screen === 'tutorial') {
  return <TutorialScreen onBack={() => setScreen('home')} />;
}
```

### HomeScreen ボタン追加
home-menu-row の適当な場所に:
```tsx
<button className="home-btn" onClick={() => onNavigate('tutorial')}>
  <span>❓</span>
  <span>ヘルプ</span>
</button>
```

---

## 機能5: ロール解放機能

### 概要
`CharacterSaveData.unlockedRoles` はすでに型定義済み（初期値: `[c.roles[0]]`）。  
EnhanceScreen の「解放」タブに「ロール解放」セクションを追加し、  
未習得ロールを50クリスタルで解放できるようにする。

### 変更ファイル
1. `src/types/index.ts` — 変更なし（既存の `unlockedRoles: RoleId[]` を使用）
2. `src/systems/gameState.ts` — `buildInitialSaveData` の `unlockedRoles` 初期値を修正
3. `src/data/abilities.ts` — 各ロールの基本アビリティが使えるよう `getAbilitiesForRole` を修正確認
4. `src/components/EnhanceScreen/index.tsx` — 「解放」タブにロール解放UIを追加
5. `src/systems/ai.ts` — 解放済みロールも AIが使えるように確認

### 前提整理

現在の `CharacterData.roles` は各キャラの「初期から使えるロール」（3つ）。  
`unlockedRoles` は現在 `[roles[0]]` のみ = 初期ロールの1番目のみ。  
→ `roles` にあるすべてのロールは初期から使えるべきなので、  
　`buildInitialSaveData` を `unlockedRoles: c.roles` に修正する。

**既存セーブとの互換性:** `unlockedRoles` が空の場合 `charData.roles` にフォールバックする。

### ロール解放の定義

| 項目 | 内容 |
|---|---|
| 解放対象 | キャラの `charData.roles` に含まれないロール（6種 - 初期3種 = 最大3種解放可能） |
| コスト | 対象ロールのクリスタル50個 |
| 解放後 | アビリティはロールレベルに応じて解放（`getAbilitiesForRole` の既存ロジックで動作） |
| ロールLvアップコスト | クリスタル消費数 × 10（Gil は通常と同じ） |

### 解放ロールのロールレベルアップコスト計算
```ts
function roleLevelCost(role: RoleId, currentRoleLv: number, isUnlocked: boolean): { gil: number; crystals: number } {
  const base: Record<RoleId, number> = { ATK: 200, BLA: 200, DEF: 180, HLR: 180, ENH: 220, JAM: 220 };
  return {
    gil: Math.floor(base[role] * Math.pow(1.5, currentRoleLv - 1)),
    crystals: isUnlocked ? currentRoleLv * 10 : currentRoleLv,
  };
}
```

### EnhanceScreen「解放」タブへの追加

既存の「解放」タブには「キャラクター解放」（フラグメント解放）が存在する。  
その上部に「ロール解放」セクションを追加する。

**ロール解放セクションのレイアウト:**
```
── ロール解放 ──
[解放済: ⚔ATK Lv3] [解放済: 💎BLA Lv1] [解放済: 🛡DEF Lv1]
[未解放: 💚HLR] 🔮×50 [解放する]
[未解放: 🔮ENH] ✨×50 [解放する]
[未解放: 💿JAM] 💜×50 [解放する]
```

**解放後の状態反映:**
- `charSave.unlockedRoles` に追加
- その後はロールレベルタブで強化可能（`roleLevels` に初期値1が入る）
- SetupScreen のオプティマ編集・AI でも解放済みロールが使用可能になる

### AbilityViewer への反映
```ts
// 現在
const allRoles = charData.roles;

// 変更後: unlockedRoles（解放済みロール全体）を使う
const allRoles = [
  ...charData.roles,
  ...(charSave.unlockedRoles ?? []).filter(r => !charData.roles.includes(r)),
];
```

### SetupScreen オプティマ編集への反映
```ts
// paradigm-char-role の availableRoles を unlockedRoles ベースに変更
const charSave = saveData.player.roster.find(r => r.id === party[charSlot]);
const availableRoles = [
  ...(char?.roles ?? []),
  ...(charSave?.unlockedRoles?.filter(r => !char?.roles.includes(r)) ?? []),
];
```

### gameState.ts — buildInitialSaveData 修正
```ts
// 変更前
unlockedRoles: [c.roles[0]],

// 変更後: 初期から全ロールを使えるようにする
unlockedRoles: [...c.roles],
```

### AI への反映（ai.ts）
`getAbilitiesForRole` は `charId` と `charLevel` を使ってアビリティを絞る。  
解放ロールのアビリティはロールレベルで制御されるため AI 側の変更は不要。

---

## 型変更サマリー

| ファイル | 変更内容 |
|---|---|
| `types/index.ts` | `DropItem.type` に `'valuable'` を追加 |
| `types/index.ts` | `GameScreen` に `'tutorial'` を追加 |
| `types/index.ts` | 他変更なし（`unlockedRoles` は既存） |

---

## CSS 追加クラス一覧

| クラス名 | 用途 |
|---|---|
| `.sell-confirm-overlay` | 売却確認モーダル背景 |
| `.sell-confirm-modal` | 売却確認モーダル本体 |
| `.sell-confirm-price` | 売却価格表示 |
| `.sell-confirm-btns` | 確定・キャンセルボタン行 |
| `.pc-role-list` | パーティカード内ロールリスト |
| `.pc-role-badge` | パーティカード内ロールバッジ |
| `.tutorial-screen` | チュートリアル画面コンテナ |
| `.tutorial-tabs` | チュートリアルタブバー |
| `.tutorial-section` | チュートリアル各セクション |
| `.tutorial-item` | チュートリアル各項目 |
| `.tutorial-item-title` | チュートリアル項目タイトル |
| `.tutorial-item-desc` | チュートリアル項目説明 |
| `.role-unlock-section` | ロール解放セクション |
| `.role-unlock-card` | ロール解放1枠 |
| `.role-unlock-status` | 解放済み/未解放バッジ |

---

## 注意事項・実装時のポイント

1. **換金アイテムのインベントリ管理**: フラグメントと同様に自動換金（インベントリには残さない）。ResultScreen での表示は `lastRewards.drops` の `type: 'valuable'` 判定で行う。

2. **既存セーブとのロール互換性**: `unlockedRoles` が `undefined` や空配列の既存セーブデータに対して、`charData.roles` にフォールバックするガードを必ず入れる。

3. **解放ロールのアビリティ**: `getAbilitiesForRole(role, charId, level)` は既存関数がそのまま使える。解放ロールかどうかに関わらず同じアビリティセットが適用される（`allowedFor` による制限はそのまま機能する）。

4. **ロール解放後のオプティマ自動調整**: ロール解放は戦闘外（EnhanceScreen）で行うため、既存の SetupScreen でオプティマを選びなおせば反映される。自動リセットは不要。

5. **チュートリアルの `GameScreen` 型**: `src/types/index.ts` の `GameScreen` 型に `'tutorial'` を追加するのを忘れない。
