import { FACILITIES } from "../../../domain/park/Park";
import type { FacilityCategory } from "../../../domain/park/Park";
import { useAppStore } from "../../../application/store";
import { AndOrToggle } from "./AndOrToggle";
import { FacilityChip } from "./FacilityChip";
import styles from "./SearchPanel.module.css";

const CATEGORY_LABELS: Record<FacilityCategory, string> = {
  basic:      "基本設備",
  playground: "遊具",
  field:      "広場",
  sports:     "スポーツ",
  animals:    "動物",
  food:       "飲食・売店",
  other:      "その他",
  parking:    "駐車場",
};

const CATEGORY_ORDER: FacilityCategory[] = [
  "basic", "playground", "field", "sports", "animals", "food", "other", "parking",
];

const grouped = CATEGORY_ORDER.map((cat) => ({
  category: cat,
  label: CATEGORY_LABELS[cat],
  facilities: FACILITIES.filter((f) => f.category === cat),
}));

/**
 * 設備フィルタパネル（ボトムシート内）。
 *
 * アクセシビリティポイント:
 * - aria-live="polite" で絞り込み件数をスクリーンリーダーに通知
 * - カテゴリごとに <section> + <h3> でアウトライン構造化
 */
export function SearchPanel() {
  const { filteredParks, condition, clearCondition } = useAppStore();
  const selectedCount = condition.facilities.size;

  return (
    <section aria-label="公園フィルタ" className={styles.panel}>
      {/* ヘッダー: タイトル + AND/OR トグル + 件数 */}
      <div className={styles.header}>
        <h2 id="search-panel-title" className={styles.title}>
          設備で絞り込む
        </h2>
        <AndOrToggle />
      </div>

      {/* 件数フィードバック: aria-live で動的更新をスクリーンリーダーに通知 */}
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.resultCount}
      >
        {selectedCount === 0
          ? `全 ${filteredParks.length} 件の公園`
          : `条件に合う公園: ${filteredParks.length} 件`}
      </p>

      {/* クリアボタン */}
      {selectedCount > 0 && (
        <button
          type="button"
          onClick={clearCondition}
          className={styles.clearBtn}
          aria-label={`${selectedCount}件の選択を解除`}
        >
          条件をクリア ({selectedCount})
        </button>
      )}

      {/* カテゴリ別チップ一覧 */}
      <div className={styles.categories}>
        {grouped.map(({ category, label, facilities }) => (
          <section key={category} aria-label={label}>
            <h3 className={styles.categoryLabel}>{label}</h3>
            <div className={styles.chips} role="list">
              {facilities.map((f) => (
                <div key={f.key} role="listitem">
                  <FacilityChip facilityKey={f.key} label={f.ja} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
