import { useLocale, type Theme } from "../../../i18n/useLocale";
import type { Locale } from "../../../i18n/translations";
import styles from "./SettingsPanel.module.css";

const LOCALES: Locale[] = ["ja", "en"];
const THEMES: Theme[] = ["light", "system", "dark"];
const THEME_ICONS: Record<Theme, string> = { light: "☀️", system: "🌐", dark: "🌙" };

interface Props {
  readonly onClose: () => void;
}

export function SettingsPanel({ onClose }: Props) {
  const { t, locale, setLocale, theme, setTheme } = useLocale();

  const themeLabel: Record<Theme, string> = {
    light: t.settings.themeLight,
    dark: t.settings.themeDark,
    system: t.settings.themeSystem,
  };

  return (
    <section aria-label={t.settings.title} className={styles.panel}>
      <div className={styles.header}>
        <h2 id="settings-panel-title" className={styles.title}>
          {t.settings.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className={styles.closeBtn}
          aria-label={t.settings.closeAria}
        >
          ✕
        </button>
      </div>

      {/* 言語 */}
      <fieldset className={styles.row}>
        <legend className={styles.label}>{t.settings.language}</legend>
        <div className={styles.toggle}>
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
      </fieldset>

      {/* テーマ */}
      <fieldset className={`${styles.row} ${styles.rowStacked}`}>
        <legend className={styles.label}>{t.settings.theme}</legend>
        <div className={styles.toggle}>
          {THEMES.map((th) => (
            <button
              key={th}
              type="button"
              aria-pressed={theme === th}
              onClick={() => setTheme(th)}
              className={`${styles.toggleBtn} ${theme === th ? styles.active : ""}`}
              aria-label={themeLabel[th]}
            >
              {THEME_ICONS[th]} {themeLabel[th]}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}
