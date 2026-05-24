import { useLocale, type Theme } from "../../../i18n/useLocale";
import type { Locale } from "../../../i18n/translations";
import styles from "./SettingsPanel.module.css";

const LOCALES: Locale[] = ["ja", "en"];
const THEMES: Theme[] = ["light", "system", "dark"];
const THEME_ICONS: Record<Theme, string> = { light: "☀️", system: "🌐", dark: "🌙" };

export function SettingsPanel() {
  const { t, locale, setLocale, theme, setTheme } = useLocale();

  return (
    <section aria-label={t.settings.title} className={styles.panel}>
      <h2 id="settings-panel-title" className={styles.title}>
        {t.settings.title}
      </h2>

      {/* 言語 */}
      <div className={styles.row}>
        <span className={styles.label}>{t.settings.language}</span>
        <div role="group" aria-label={t.settings.language} className={styles.toggle}>
          {LOCALES.map((loc) => (
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

      {/* テーマ */}
      <div className={styles.row}>
        <span className={styles.label}>{t.settings.theme}</span>
        <div role="group" aria-label={t.settings.theme} className={styles.toggle}>
          {THEMES.map((th) => {
            const label =
              th === "light" ? t.settings.themeLight :
              th === "dark"  ? t.settings.themeDark  :
                               t.settings.themeSystem;
            return (
              <button
                key={th}
                type="button"
                aria-pressed={theme === th}
                onClick={() => setTheme(th)}
                className={`${styles.toggleBtn} ${theme === th ? styles.active : ""}`}
                aria-label={label}
              >
                {THEME_ICONS[th]} {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
