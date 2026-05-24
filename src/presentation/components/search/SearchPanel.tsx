import { useId } from "react";
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
 * 設備フィルタ + 公園名検索パネル（ボトムシート内）。
 *
 * アクセシビリティポイント:
 * - aria-live="polite" で絞り込み件数をスクリーンリーダーに通知
 * - テキスト入力は role="search" + label で検索フィールドと明示
 * - カテゴリごとに <section> + <h3> でアウトライン構造化
 */
export function SearchPanel() {
  const { filteredParks, condition, nameQuery, clearCondition, setNameQuery, openList, closeSearchPanel } = useAppStore();
  const selectedCount = condition.facilities.size;
  const nameInputId = useId();
  const hasAnyFilter = selectedCount > 0 || nameQuery.trim() !== "";

  return (
    <section aria-label="公園フィルタ" className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 id="search-panel-title" className={styles.title}>
          公園を探す
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={closeSearchPanel}
          aria-label="検索パネルを閉じる"
        >
          ✕
        </button>
      </div>

      {/* 公園名検索 */}
      <div role="search" className={styles.nameSearch}>
        <label htmlFor={nameInputId} className={styles.nameLabel}>
          公園名・住所で検索
        </label>
        <div className={styles.nameInputWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">🔍</span>
          <input
            id={nameInputId}
            type="search"
            inputMode="search"
            placeholder="例: 境川、横浜市緑区..."
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
              aria-label="公園名の検索をクリア"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 設備フィルタヘッダー */}
      <div className={styles.header}>
        <h3 className={styles.subTitle}>設備で絞り込む</h3>
        <AndOrToggle />
      </div>

      {/* 件数フィードバック */}
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.resultCount}
      >
        {hasAnyFilter
          ? `条件に合う公園: ${filteredParks.length} 件`
          : `全 ${filteredParks.length} 件の公園`}
      </p>

      {/* クリアボタン */}
      {hasAnyFilter && (
        <button
          type="button"
          onClick={() => { clearCondition(); setNameQuery(""); }}
          className={styles.clearBtn}
          aria-label="すべての絞り込み条件をリセット"
        >
          すべてクリア
          {selectedCount > 0 && ` (設備 ${selectedCount}件)`}
        </button>
      )}

      {/* カテゴリ別チップ一覧 */}
      <div className={styles.categories}>
        {grouped.map(({ category, label, facilities }) => (
          <section key={category} aria-label={label}>
            <h4 className={styles.categoryLabel}>{label}</h4>
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

      {/* 公園リスト表示ボタン（スティッキー） */}
      <div className={styles.listBtnWrapper}>
        <button
          type="button"
          className={styles.listBtn}
          onClick={openList}
          disabled={filteredParks.length === 0}
          aria-label={`${filteredParks.length}件の公園リストを距離順で見る`}
        >
          {filteredParks.length}件の公園リストを見る →
        </button>
      </div>
    </section>
  );
}
