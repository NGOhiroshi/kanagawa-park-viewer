# 神奈川公園ビューワー 🌳

神奈川県内の公園を設備条件で手軽に絞り込める検索 PWA。

「ブランコ AND 砂場がある公園」のようなニッチな複合条件で、目的の公園をすぐに見つけられます。

## 機能

- 設備 AND/OR 複合検索（42 種類の設備）
- 公園名・住所からのテキスト検索
- 地図上でのクラスター表示（MapLibre GL JS）
- 現在地から近い順にリスト表示
- 日本語 / English 切り替え
- ダークモード対応
- PWA 対応（ホーム画面に追加可能、オフライン動作）

## データ

[神奈川県オープンデータ](https://www.pref.kanagawa.jp/docs/b8k/cnt/f536260/)「都市公園台帳（整備記録）」を使用（CC BY 4.0）。  
住所 → 緯度経度の変換は[国土地理院 住所検索 API](https://geocoding.geo.nlsc.go.jp/) を利用。

## 技術スタック

| 用途 | 技術 |
|---|---|
| フレームワーク | Vite + React + TypeScript |
| 地図 | MapLibre GL JS + 地理院タイル |
| 状態管理 | Zustand |
| ホスティング | Cloudflare Pages |

## ローカル開発

```bash
pnpm install
pnpm dev          # ブラウザ向け
pnpm dev:mobile   # スマホ実機テスト用（HTTPS）
```

## データ再生成

```bash
pnpm parse        # CSV → parks.base.json
pnpm geocode      # 住所 → 緯度経度付与
pnpm build-data   # 上記を一括実行
```

## ライセンス

MIT
