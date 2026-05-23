# Phase 2 Updates — plan.md 実装記録

## Item 11: アビリティ追加

### ENH 汎用アビリティ（新規）
| ID | 名前 | コスト | 効果 |
|----|------|--------|------|
| enh_bravall | ブレイバリーオール | 4 | 全体ブレイバリー付与 |
| enh_protall | プロテスオール | 3 | 全体プロテス付与 |
| enh_shellall | シェルオール | 3 | 全体シェル付与 |
| enh_hasteall | ヘイストオール | 4 | 全体ヘイスト付与 |
| enh_barfire | バーファイア | 2 | 火属性バリア（ENHロール） |

### JAM 汎用アビリティ（新規）
| ID | 名前 | コスト | 効果 |
|----|------|--------|------|
| jam_imperil_g | インペリル | 3 | デバフ: imperil（汎用版） |
| jam_fog | フォグ | 2 | デバフ: curse |
| jam_poison | ポイズン | 2 | デバフ: poison |
| jam_instant | インスタント | 1 | 高速デバフセットアップ |

### DebuffId 追加
- `'poison'` を DebuffId に追加

---

## Item 12: アビリティビューア

- `src/components/AbilityViewer/index.tsx` を新規作成
- キャラクターが持つロール別のコマンドアビリティ一覧を表示
- EnhanceScreen に「アビリティ」タブとして統合
- ロールタブ切り替えでフィルタリング

---

## Item 13: ロールボーナス調整

| ロール | ボーナス内容 |
|--------|-------------|
| ATK | 物理ダメージ +10%/ロールLv（最大 +50% at Lv5） |
| BLA | 魔法ダメージ +10%/ロールLv（最大 +50% at Lv5） |
| HLR | 回復量 +8%/ロールLv |
| ENH | バフ持続時間 +8%/ロールLv |
| JAM | デバフ持続時間 +8%/ロールLv |
| DEF | 被ダメ軽減 +2%/ロールLv（既存） |

### 味方 ATK ボーナス
- 他の生存パーティメンバーが ATK ロールLv ≥ 3 の場合、自分の ATK ダメージに +15%

---

## Item 14: キャラクター固有アルティメットアビリティ

### 解放条件
- キャラクターレベル ≥ 40
- 対象ロールのロールレベル ≥ 5
- ATB ゲージが MAX（全セグメント充填）

### 仕様
- `isUltimate: true` フラグ付き CommandAbility
- 使用時に ATB ゲージを全消費
- 1 戦闘につき 1 回のみ使用可能（`ultimateUsed` フラグ管理）

### 初期 3 キャラのアルティメット
| キャラ | アビリティ名 | ロール | 効果 |
|--------|------------|--------|------|
| ライ (rai) | ライトニングスフィア | ATK | 3 ヒット雷属性、power 8.0 |
| ヴァ (va) | 聖なる癒し | HLR | 全体 HP 100% 回復 |
| ファ (fa) | 獣王の怒り | ATK | 単体超高威力、power 12.0 |

---

## Item 15: 物理・魔法の分離

### CharacterData 追加フィールド
```typescript
attackType: 'physical' | 'magical' | 'mixed';
physDef: number;  // 0-100 (物理防御%, デフォルト 0)
magDef: number;   // 0-100 (魔法防御%, デフォルト 0)
```

### EnemyData 追加フィールド
```typescript
physDef?: number;  // 物理防御%
magDef?: number;   // 魔法防御%
```

### ダメージ計算
- 物理攻撃: `physDefMult = 1 - physDef / 100`
- 魔法攻撃: `magDefMult = 1 - magDef / 100`
- 既存の `physResist` はそのまま残存（後方互換）

---

## Item 16: エネミーレポート

### SaveData 追加
```typescript
// ProgressData に追加
encounteredEnemies: string[];  // 戦闘した敵の dataId リスト
```

### 更新タイミング
- `handleVictory` 時に finalState.enemies の dataId を encounteredEnemies にマージ

### UI
- `src/components/EnemyReportScreen/index.tsx` 新規作成
- HomeScreen に「エネミーレポート」ボタン追加
- 通常敵 / ボスにグループ分け表示
- 各カード: emoji, name, HP, physDef/magDef, 弱点/耐性表示

---

## Item 17: バトルアイテム（ポーション）

### アイテムデータ (`src/data/items.ts`)
| ID | 名前 | 効果 |
|----|------|------|
| potion | ポーション | 全体 HP 20% 回復 |
| hi_potion | ハイポーション | 全体 HP 50% 回復 |

### Inventory 追加
```typescript
battleItems: { itemId: string; quantity: number }[];
```

### 初期所持数
- ポーション × 3（ステージ開始時に付与）

### BattleState 追加
```typescript
battleItems: { itemId: string; quantity: number }[];
```

### UI
- BattleScreen の下部にアイテムボタン表示
- 使用時に全体 HP 回復、在庫を 1 減らす
- 在庫 0 またはバトル停止中は無効化
- 勝利後に残りアイテムを Inventory へ反映

---

## Item 18: 敵の行動速度（確認済み）

Phase 1 で実装済み：
- 敵のアクションクールダウンを `action.cooldown * 2` に変更（デフォルト 0.5 倍速）

---

## Item 19: 連続行動コンボボーナス

### 仕様
- ATB がフル（`atb.current >= atb.max - 0.1`）の状態でアクションを取ると `comboCount` を +1（最大 5）
- ATB がフルでない状態でアクションを取ると `comboCount` を 0 にリセット

### ボーナス
- ダメージ計算時: `+5% × comboCount`（最大 +25% at comboCount 5）

### CharacterInstance 追加フィールド
```typescript
comboCount?: number;  // 0〜5
```
