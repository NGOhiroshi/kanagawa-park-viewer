import { useEffect } from "react";
import { useAppStore, useSelectedPark } from "../application/store";
import { ParkMap } from "./components/map/ParkMap";
import { SearchPanel } from "./components/search/SearchPanel";
import { ParkCard } from "./components/park/ParkCard";
import { BottomSheet } from "./components/common/BottomSheet";
import { AboutPage } from "./components/about/AboutPage";
import styles from "./App.module.css";

export function App() {
  const {
    loadParks,
    filteredParks,
    isLoading,
    loadError,
    isSearchPanelOpen,
    openSearchPanel,
    closeSearchPanel,
    selectPark,
    currentView,
    setView,
    condition,
    nameQuery,
  } = useAppStore();
  const selectedPark = useSelectedPark();

  // 初回マウント時にデータ読み込み
  useEffect(() => {
    loadParks();
  }, [loadParks]);

  const showSearchPanel = isSearchPanelOpen && !selectedPark;
  const showParkCard = selectedPark !== null;
  const bottomSheetOpen = showSearchPanel || showParkCard;
  const activeFilterCount = condition.facilities.size + (nameQuery.trim() ? 1 : 0);

  if (currentView === "about") {
    return <AboutPage />;
  }

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
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.searchButton}
          onClick={openSearchPanel}
          aria-expanded={isSearchPanelOpen}
          aria-controls="search-panel"
          aria-label="公園を検索・絞り込む"
        >
          🔍
          <span className={styles.searchLabel}>公園を探す</span>
          {/* アクティブなフィルタ件数バッジ */}
          <span
            className={`${styles.countBadge} ${activeFilterCount > 0 ? styles.countBadgeActive : ""}`}
            aria-label={`${filteredParks.length}件の公園`}
          >
            {filteredParks.length}
          </span>
        </button>

        {/* About ページリンク */}
        <button
          type="button"
          className={styles.aboutBtn}
          onClick={() => setView("about")}
          aria-label="このアプリについて"
        >
          ℹ️
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
