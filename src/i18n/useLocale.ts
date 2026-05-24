import { create } from "zustand";
import { translations, type Locale, type AppTranslations } from "./translations";

interface LocaleStore {
  locale: Locale;
  t: AppTranslations;
  setLocale: (locale: Locale) => void;
}

function detectLocale(): Locale {
  const stored = localStorage.getItem("locale");
  if (stored === "en" || stored === "ja") return stored;
  return navigator.language.startsWith("ja") ? "ja" : "en";
}

export const useLocale = create<LocaleStore>((set) => ({
  locale: detectLocale(),
  t: translations[detectLocale()],
  setLocale: (locale) => {
    localStorage.setItem("locale", locale);
    set({ locale, t: translations[locale] });
  },
}));
