import { useEffect } from "react";
import { useAppStore, useSelectedPark } from "../application/store";
import { ParkMap } from "./components/map/ParkMap";
import { SearchPanel } from "./components/search/SearchPanel";
import { ParkCard } from "./components/park/ParkCard";
import { BottomSheet } from "./components/common/BottomSheet";
import styles from "./App.module.css";

export function App() {
  const { loadParks, filteredParks, isLoading, loadError, isSearchPanelOpen, openSearchPanel, closeSearchPanel, selectPark } = useAppStore();
  const selectedPark = useSelectedPark();

  // 初回マウント時にデータ読み込み
  useEffect(() => {
    loadParks();
  }, [loadParks]);

  const showSearchPanel = isSearchPanelOpen && !selectedPark;
  const showParkCard = selectedPark !== null;
  const bottomSheetOpen = showSearchPanel || showParkCard;

  return (
    <>
      {/* マップ: 全画面背景 */}
      <main id="main-content" className={styles.mapWrapper} aria-label="公園マップ">
        {isLoading && (
          <div className={styles.loadingOverlay} role="status" aria-live="polite">
            <p>公園データを読み込んでいます…</p>
          </div>
        )}
        {loadError && (
          <div className={styles.errorBanner} role="alert">
            <p>⚠️ {loadError}</p>
          </div>
        )}
        <ParkMap />
      </main>

      {/* フローティング検索バー */}
      <div className={styles.searchBar} role="search">
        <button
          type="button"
          className={styles.searchButton}
          onClick={openSearchPanel}
          aria-expanded={isSearchPanelOpen}
          aria-controls="search-panel"
          aria-label="設備フィルタを開く"
        >
          🔍 設備で絞り込む
          {/* 件数バッジ */}
          <span
            className={styles.countBadge}
            aria-label={`${filteredParks.length}件の公園`}
          >
            {filteredParks.length}
          </span>
        </button>
      </div>

      {/* ボトムシート: 検索パネル */}
      <BottomSheet
        isOpen={showSearchPanel}
        onClose={closeSearchPanel}
        titleId="search-panel-title"
      >
        <div id="search-panel">
          <SearchPanel />
        </div>
      </BottomSheet>

      {/* ボトムシート: 公園詳細 */}
      <BottomSheet
        isOpen={showParkCard}
        onClose={() => selectPark(null)}
        titleId="park-card-title"
      >
        <ParkCard />
      </BottomSheet>

      {/* ボトムシートが開いているときの背景オーバーレイ */}
      {bottomSheetOpen && (
        <div
          className={styles.overlay}
          onClick={() => { closeSearchPanel(); selectPark(null); }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
