import { useLocale } from "../../../i18n/useLocale";
import type { Locale } from "../../../i18n/translations";
import styles from "./SettingsPanel.module.css";

export function SettingsPanel() {
  const { t, locale, setLocale } = useLocale();

  return (
    <section aria-label={t.settings.title} className={styles.panel}>
      <div className={styles.header}>
        <h2 id="settings-panel-title" className={styles.title}>
          {t.settings.title}
        </h2>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>{t.settings.language}</span>
        <div role="group" aria-label={t.settings.language} className={styles.toggle}>
          {(["ja", "en"] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              aria-pressed={locale === loc}
              onClick={() => setLocale(loc)}
              className={`${styles.toggleBtn} ${locale === loc ? styles.active : ""}`}
            >
              {loc === "ja" ? t.settings.japanese : t.settings.english}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
