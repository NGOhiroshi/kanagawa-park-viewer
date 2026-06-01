import { useAppStore } from "../../../application/store";
import { useLocale } from "../../../i18n/useLocale";
import styles from "./AboutPage.module.css";

export function AboutPage() {
  const { setView } = useAppStore();
  const { t } = useLocale();
  const a = t.about;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => setView("map")}
          className={styles.backBtn}
          aria-label={a.backToMapAria}
        >
          {a.backToMap}
        </button>
        <h1 className={styles.heading}>{a.title}</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section} aria-labelledby="about-overview">
          <h2 id="about-overview" className={styles.sectionTitle}>{a.overviewHeading}</h2>
          <p>{a.overviewText}</p>
          <ul className={styles.featureList}>
            {a.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </section>

        {/* 免責事項バナー */}
        <p className={styles.disclaimer}>{a.note} {a.noteText}</p>

        <section className={styles.section} aria-labelledby="about-pwa">
          <h2 id="about-pwa" className={styles.sectionTitle}>{a.pwaHeading}</h2>
          <div className={styles.pwaGrid}>
            <div className={styles.pwaCard}>
              <h3 className={styles.attrTitle}>{a.pwaIosTitle}</h3>
              <ol className={styles.stepList}>
                {a.pwaIosSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div className={styles.pwaCard}>
              <h3 className={styles.attrTitle}>{a.pwaAndroidTitle}</h3>
              <ol className={styles.stepList}>
                {a.pwaAndroidSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-data">
          <h2 id="about-data" className={styles.sectionTitle}>{a.dataHeading}</h2>

          <div className={styles.attribution}>
            <h3 className={styles.attrTitle}>{a.parkDataTitle}</h3>
            <p>{a.parkDataText}</p>
            <dl className={styles.dl}>
              <dt>{a.source}</dt>
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
              <dt>{a.license}</dt>
              <dd>
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.ja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  CC BY 4.0 ↗
                </a>
              </dd>
              <dt>{a.count}</dt>
              <dd>{a.countValue}</dd>
            </dl>
          </div>

          <div className={styles.attribution}>
            <h3 className={styles.attrTitle}>{a.mapTilesTitle}</h3>
            <p>{a.mapTilesText}</p>
            <dl className={styles.dl}>
              <dt>{a.source}</dt>
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
              <dt>{a.license}</dt>
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
            <h3 className={styles.attrTitle}>{a.geocodingTitle}</h3>
            <p>{a.geocodingText}</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="about-tech">
          <h2 id="about-tech" className={styles.sectionTitle}>{a.techHeading}</h2>
          <dl className={styles.dl}>
            <dt>{a.framework}</dt>
            <dd>Vite + React + TypeScript</dd>
            <dt>{a.mapLib}</dt>
            <dd>MapLibre GL JS（OSS）</dd>
            <dt>{a.hosting}</dt>
            <dd>Cloudflare Pages</dd>
            <dt>{a.dataProcessing}</dt>
            <dd>{a.dataProcessingValue}</dd>
          </dl>
        </section>

        <section className={styles.section} aria-labelledby="about-contact">
          <h2 id="about-contact" className={styles.sectionTitle}>{a.feedbackHeading}</h2>
          <p>{a.feedbackText}</p>
          <a
            href="https://github.com/NGOhiroshi/kanagawa-park-viewer/issues"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.issuesLink}
          >
            {a.issuesLabel}
          </a>
        </section>

        <footer className={styles.footer}>
          <p>{a.copyright}</p>
          <p className={styles.footerSub}>{a.disclaimer}</p>
        </footer>
      </div>
    </main>
  );
}
