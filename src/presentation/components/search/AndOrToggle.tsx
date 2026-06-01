import type { SearchMode } from "../../../domain/search/SearchCondition";
import { useAppStore } from "../../../application/store";
import { useLocale } from "../../../i18n/useLocale";
import styles from "./AndOrToggle.module.css";

export function AndOrToggle() {
  const { condition, setMode } = useAppStore();
  const { t } = useLocale();

  return (
    <fieldset aria-label={t.search.andOrGroupLabel} className={styles.group}>
      <ModeButton label="AND" current={condition.mode} onClick={setMode} meaning={t.search.andMeaning} />
      <ModeButton label="OR"  current={condition.mode} onClick={setMode} meaning={t.search.orMeaning} />
    </fieldset>
  );
}

function ModeButton({
  label,
  current,
  onClick,
  meaning,
}: {
  readonly label: SearchMode;
  readonly current: SearchMode;
  readonly onClick: (mode: SearchMode) => void;
  readonly meaning: string;
}) {
  const isActive = label === current;
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onClick(label)}
      className={`${styles.btn} ${isActive ? styles.active : ""}`}
    >
      {label}
      <span className="sr-only">{meaning}</span>
    </button>
  );
}
