# 🎮 EmojiParadigm

FF13 風のオプティマシステムを持つブラウザ RPG です。  
React + TypeScript + Vite で実装し、GitHub Pages で公開しています。

**▶ プレイはこちら → https://mine-laki.github.io/atb_rpg/**

---

## ゲーム概要

- **ATB（アクティブタイムバトル）** システムによるリアルタイムバトル
- **オプティマ（作戦）** をバトル中に切り替えてロール（役割）を変更
- **ロール** ：ATK（アタッカー）/ BLA（ブラスター）/ DEF（ディフェンダー）/ HLR（ヒーラー）/ ENH（エンハンサー）/ JAM（ジャマー）
- **チェーンゲージ** を溜めてブレイク状態に持ち込み、大ダメージを与える
- キャラ育成：レベルアップ・ロールレベル・装備強化・クリスタルによるロール解放
- **NG+ システム**：クリア後も難易度を上げて周回プレイ可能

---

## コマンド

環境に Node.js v20 が存在しない場合は、先頭に `PATH="/tmp/node-v20.18.0-darwin-arm64/bin:$PATH"` を付けて実行してください。

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー起動（ホットリロード付き） |
| `npm run build` | TypeScript チェック → `dist/` へ本番ビルド |
| `npm run preview` | ビルド済み `dist/` をローカルでプレビュー |
| `npm run lint` | ESLint による静的解析 |
| `npm run deploy` | ビルド → GitHub Pages (`gh-pages` ブランチ) へデプロイ |

### デプロイ手順（手動）

```bash
PATH="/tmp/node-v20.18.0-darwin-arm64/bin:$PATH" npm run build
PATH="/tmp/node-v20.18.0-darwin-arm64/bin:$PATH" npx gh-pages -d dist --no-history
```

> `--no-history` を付けることで `gh-pages` ブランチの履歴をリセットし、容量を抑えます。

---

## 技術スタック

- **React 18** + **TypeScript**
- **Vite 5**（バンドル・開発サーバー）
- **gh-pages**（GitHub Pages デプロイ）
- セーブデータは `localStorage` に保存（ブラウザ完結）
