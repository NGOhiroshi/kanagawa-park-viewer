import { create } from "zustand";
import { translations, type Locale, type AppTranslations } from "./translations";

export type Theme = "light" | "dark" | "system";

interface LocaleStore {
  locale: Locale;
  t: AppTranslations;
  setLocale: (locale: Locale) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function detectLocale(): Locale {
  const stored = localStorage.getItem("locale");
  if (stored === "en" || stored === "ja") return stored;
  return navigator.language.startsWith("ja") ? "ja" : "en";
}

function detectTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

function applyTheme(theme: Theme): void {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = theme === "system" ? (prefersDark ? "dark" : "light") : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

// OS のカラースキーム変更を監視（system 選択時に追従）
const mql = window.matchMedia("(prefers-color-scheme: dark)");
mql.addEventListener("change", () => {
  const { theme } = useLocale.getState();
  if (theme === "system") applyTheme("system");
});

// 初回適用
applyTheme(detectTheme());

export const useLocale = create<LocaleStore>((set) => ({
  locale: detectLocale(),
  t: translations[detectLocale()],
  setLocale: (locale) => {
    localStorage.setItem("locale", locale);
    set({ locale, t: translations[locale] });
  },
  theme: detectTheme(),
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    set({ theme });
  },
}));
