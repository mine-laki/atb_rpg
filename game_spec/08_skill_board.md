# EmojiParadigm — スキルボード仕様

## 概要

キャラクター固有のスキルツリー。ノードを解放することでステータスやATBゲージを強化できる。

## テンプレート構成

キャラクターの成長タイプ (growthType) によって異なるテンプレートが適用される。

| growthType | HP成長重視 | STR成長重視 | MAG成長重視 |
|------------|-----------|------------|------------|
| attacker   | ●         | ●●         |            |
| magic      | ●         |            | ●●         |
| tank       | ●●        | ●          |            |
| healer     | ●         |            | ●●         |
| allround   | ●         | ●          | ●          |

## ノード一覧（テンプレートサンプル: attacker）

| ノードID    | 名称       | 効果          | 前提        | コスト |
|------------|-----------|--------------|------------|--------|
| atk_hp1    | HP強化 I   | HP +300      | なし        | 400Gil + 強化石(通)×2 |
| atk_str1   | STR強化 I  | STR +20      | atk_hp1    | 500Gil + ATKクリスタル×2 |
| atk_atb    | ATB拡張    | ATBゲージ+1   | atk_str1   | 1200Gil + ATKクリスタル×3 + 強化石(通)×4 |
| atk_str2   | STR強化 II | STR +35      | atk_atb    | 1000Gil + ATKクリスタル×5 + ドラゴンの鱗×1 |

## 効果種別

| type         | 効果内容 |
|--------------|---------|
| stat_boost   | HP/STR/MAG フラットボーナス（キャラインスタンス生成時に加算） |
| atb_expand   | ATBゲージセグメント +1 |

## 適用タイミング

スキルボーナスはバトル開始時の `createCharacterInstance()` で計算・適用される。
- 装備ボーナス → スキルボーナス の順で加算
- `CharacterSaveData.unlockedSkillNodes[]` に解放済みノードIDを保存

## UI（EnhanceScreen "スキル" タブ）

- 選択中キャラのノード一覧を表示
- ノードの状態: `locked`（前提未達）/ `available`（解放可能）/ `unlocked`（解放済み）
- 前提ノードが未解放の場合はボタン無効化・前提名を表示
- コスト（Gil + 素材）が不足の場合もボタン無効化
