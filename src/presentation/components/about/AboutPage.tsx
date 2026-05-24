import { useAppStore } from "../../../application/store";
import styles from "./AboutPage.module.css";

/**
 * データ出典・著作権表示ページ。
 * 公開リポジトリに合わせて中立的な情報のみ記載。
 */
export function AboutPage() {
  const { setView } = useAppStore();

  return (
    <div className={styles.page} role="main">
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => setView("map")}
          className={styles.backBtn}
          aria-label="地図に戻る"
        >
          ← 地図に戻る
        </button>
        <h1 className={styles.heading}>このアプリについて</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="about-overview">
          <h2 id="about-overview" className={styles.sectionTitle}>概要</h2>
          <p>
            神奈川公園ビューワーは、神奈川県内の公園を設備条件で手軽に絞り込める
            検索アプリです。「ブランコ AND 砂場」のようなニッチな複合条件で
            目的の公園をすぐに見つけられます。
          </p>
          <ul className={styles.featureList}>
            <li>設備 AND/OR 複合検索（42種類の設備）</li>
            <li>公園名・住所からのテキスト検索</li>
            <li>地図上でのクラスター表示</li>
            <li>ログイン不要・インストール不要（PWA）</li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="about-data">
          <h2 id="about-data" className={styles.sectionTitle}>データについて</h2>

          <div className={styles.attribution}>
            <h3 className={styles.attrTitle}>公園データ</h3>
            <p>
              神奈川県が公開する「都市公園台帳（整備記録）」オープンデータを使用しています。
            </p>
            <dl className={styles.dl}>
              <dt>提供元</dt>
              <dd>
                <a
                  href="https://www.pref.kanagawa.jp/docs/b8k/cnt/f536260/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  神奈川県オープンデータポータル ↗
                </a>
              </dd>
              <dt>ライセンス</dt>
              <dd>
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.ja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  CC BY 4.0（クリエイティブ・コモンズ 表示 4.0 国際）↗
                </a>
              </dd>
              <dt>件数</dt>
              <dd>約 8,094 件（2026年5月時点）</dd>
              <dt>注意</dt>
              <dd>
                データは自治体への届出情報に基づくため、実際の設備状況と
                異なる場合があります。最新情報は各公園の管理者にご確認ください。
              </dd>
            </dl>
          </div>

          <div className={styles.attribution}>
            <h3 className={styles.attrTitle}>地図タイル</h3>
            <p>
              地図表示には国土地理院が提供する地理院タイルを使用しています。
            </p>
            <dl className={styles.dl}>
              <dt>提供元</dt>
              <dd>
                <a
                  href="https://maps.gsi.go.jp/development/ichiran.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  国土地理院（地理院タイル）↗
                </a>
              </dd>
              <dt>ライセンス</dt>
              <dd>
                <a
                  href="https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  国土地理院コンテンツ利用規約 ↗
                </a>
              </dd>
            </dl>
          </div>

          <div className={styles.attribution}>
            <h3 className={styles.attrTitle}>ジオコーディング</h3>
            <p>
              住所から緯度経度への変換（ジオコーディング）には、
              国土地理院の住所検索 API を使用しています。
            </p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-tech">
          <h2 id="about-tech" className={styles.sectionTitle}>技術</h2>
          <dl className={styles.dl}>
            <dt>フレームワーク</dt>
            <dd>Vite + React + TypeScript</dd>
            <dt>地図ライブラリ</dt>
            <dd>MapLibre GL JS（OSS）</dd>
            <dt>ホスティング</dt>
            <dd>Cloudflare Pages</dd>
            <dt>データ処理</dt>
            <dd>クライアント側全件フィルタ（DB・APIサーバー不要）</dd>
          </dl>
        </section>

        <section className={styles.section} aria-labelledby="about-contact">
          <h2 id="about-contact" className={styles.sectionTitle}>フィードバック</h2>
          <p>
            データの誤りや機能のご要望は、GitHubのIssueからお知らせください。
          </p>
        </section>

        <footer className={styles.footer}>
          <p>© 2026 神奈川公園ビューワー</p>
          <p className={styles.footerSub}>
            このサービスは神奈川県・国土地理院とは無関係の個人プロジェクトです。
          </p>
        </footer>
      </div>
    </div>
  );
}
