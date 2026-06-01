import { useId } from "react";
import { FACILITIES } from "../../../domain/park/Park";
import type { FacilityCategory } from "../../../domain/park/Park";
import { useAppStore } from "../../../application/store";
import { useLocale } from "../../../i18n/useLocale";
import { AndOrToggle } from "./AndOrToggle";
import { FacilityChip } from "./FacilityChip";
import styles from "./SearchPanel.module.css";

const CATEGORY_ORDER: FacilityCategory[] = [
  "basic", "playground", "field", "sports", "animals", "food", "other", "parking",
];

export function SearchPanel() {
  const { filteredParks, condition, nameQuery, clearCondition, setNameQuery, openList, closeSearchPanel } = useAppStore();
  const { t } = useLocale();
  const selectedCount = condition.facilities.size;
  const nameInputId = useId();
  const hasAnyFilter = selectedCount > 0 || nameQuery.trim() !== "";

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: t.categories[cat],
    facilities: FACILITIES.filter((f) => f.category === cat),
  }));

  return (
    <section aria-label={t.search.panelAria} className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 id="search-panel-title" className={styles.title}>
          {t.search.title}
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeSearchPanel}
          aria-label={t.search.closePanel}
        >
          ✕
        </button>
      </div>

      <div role="search" className={styles.nameSearch}>
        <label htmlFor={nameInputId} className={styles.nameLabel}>
          {t.search.nameLabel}
        </label>
        <div className={styles.nameInputWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            id={nameInputId}
            type="search"
            inputMode="search"
            placeholder={t.search.namePlaceholder}
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            className={styles.nameInput}
            autoComplete="off"
          />
          {nameQuery && (
            <button
              type="button"
              onClick={() => setNameQuery("")}
              className={styles.clearInput}
              aria-label={t.search.clearName}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className={styles.header}>
        <h3 className={styles.subTitle}>{t.search.filterTitle}</h3>
        <AndOrToggle />
      </div>

      <p role="status" aria-live="polite" aria-atomic="true" className={styles.resultCount}>
        {hasAnyFilter
          ? t.search.matching(filteredParks.length)
          : t.search.total(filteredParks.length)}
      </p>

      {hasAnyFilter && (
        <button
          type="button"
          onClick={() => { clearCondition(); setNameQuery(""); }}
          className={styles.clearBtn}
          aria-label={t.search.resetAria}
        >
          {t.search.clearAll}
          {selectedCount > 0 && ` (${t.search.clearAllFacilities(selectedCount)})`}
        </button>
      )}

      <div className={styles.categories}>
        {grouped.map(({ category, label, facilities }) => (
          <section key={category} aria-label={label}>
            <h4 className={styles.categoryLabel}>{label}</h4>
            <ul className={styles.chips}>
              {facilities.map((f) => (
                <li key={f.key}>
                  <FacilityChip facilityKey={f.key} label={t.facilityNames[f.key]} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className={styles.listBtnWrapper}>
        <button
          type="button"
          className={styles.listBtn}
          onClick={openList}
          disabled={filteredParks.length === 0}
          aria-label={t.search.viewListAria(filteredParks.length)}
        >
          {t.search.viewList(filteredParks.length)}
        </button>
      </div>
    </section>
  );
}
