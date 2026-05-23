# EmojiParadigm — セーブ/ロードシステム仕様

## 設計方針

GitHub Pages はサーバーレス静的ホスティングのため、**サーバー側にデータを持てない**。
`localStorage` は同一ブラウザ限定かつ削除リスクがあるため、補助キャッシュとして使用。

**メイン方式**: JSONエクスポート（ファイルダウンロード）/ インポート（ファイル読込）

## セーブデータ構造

```typescript
interface SaveData {
  version: string;     // "1.0.0"
  savedAt: string;     // ISO 8601
  player: {
    party: [string, string, string];  // キャラID × 3
    roster: CharacterSaveData[];       // 全キャラ強化状態
  };
  progress: {
    currentStage: number;
    clearedStages: number[];
    inventory: { gil, equipments, materials };
    playTime: number;
    unlockedCharacters: string[];
  };
  paradigms: ParadigmData[];  // 作戦 × 6
}
```

## 動作フロー

### セーブ
1. 「セーブ」ボタン押下
2. SaveData を JSON → Blob → ダウンロードリンク でファイル保存
3. localStorage にも同期 (`emoji_paradigm_save`)
4. ファイル名: `emoji_paradigm_YYYYMMDD_HHMMSS.json`

### ロード
1. 「ロード」ボタン押下 → 非表示 `<input type="file">` を click()
2. JSON ファイル選択 → `importSave(file)` でパース・バリデーション
3. 成功: ゲーム状態を復元 → ホーム画面へ
4. 失敗: エラーメッセージ表示

### 起動時キャッシュ復元
```
アプリ起動 → loadFromCache() 実行
  キャッシュあり → "続きから始めますか？"
  キャッシュなし → 新規ゲーム
```

## バージョン管理
- `version` フィールドで互換性チェック
- `migrateIfNeeded()` で古いデータを自動変換
- 新しいバージョンのデータ → エラーメッセージ表示
