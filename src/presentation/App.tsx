import { useEffect } from "react";
import { useAppStore, useSelectedPark } from "../application/store";
import { watchUserLocation } from "../infrastructure/GeolocationService";
import { ParkMap } from "./components/map/ParkMap";
import { SearchPanel } from "./components/search/SearchPanel";
import { ParkCard } from "./components/park/ParkCard";
import { ParkList } from "./components/list/ParkList";
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
    isListOpen,
    openSearchPanel,
    closeSearchPanel,
    closeList,
    selectPark,
    currentView,
    setView,
    condition,
    nameQuery,
    userLocation,
    geolocationStatus,
    setUserLocation,
    setGeolocationStatus,
  } = useAppStore();
  const selectedPark = useSelectedPark();

  // 初回マウント時にデータ読み込み
  useEffect(() => {
    loadParks();
  }, [loadParks]);

  // 現在地を継続取得
  useEffect(() => {
    return watchUserLocation(
      (coords) => {
        setUserLocation(coords);
        setGeolocationStatus("granted");
      },
      (err) => {
        setGeolocationStatus(
          err.type === "permission_denied" ? "denied" : "unavailable",
        );
      },
    );
  }, [setUserLocation, setGeolocationStatus]);

  const showSearchPanel = isSearchPanelOpen && !selectedPark;
  const showParkCard = selectedPark !== null;
  const bottomSheetOpen = showSearchPanel || showParkCard || isListOpen;
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
          <span
            className={`${styles.countBadge} ${activeFilterCount > 0 ? styles.countBadgeActive : ""}`}
            aria-label={`${filteredParks.length}件の公園`}
          >
            {filteredParks.length}
          </span>
        </button>

        {/* 現在地ボタン: タップで位置情報許可ダイアログを出す */}
        <button
          type="button"
          className={`${styles.locationBtn} ${geolocationStatus === "granted" ? styles.locationBtnActive : ""} ${geolocationStatus === "denied" ? styles.locationBtnDenied : ""}`}
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setGeolocationStatus("granted");
              },
              (err) => {
                setGeolocationStatus(err.code === 1 ? "denied" : "unavailable");
              },
            );
          }}
          aria-label={
            geolocationStatus === "granted" && userLocation
              ? "現在地取得中"
              : geolocationStatus === "denied"
              ? "位置情報がブロックされています"
              : "現在地を取得する"
          }
          aria-pressed={geolocationStatus === "granted"}
        >
          📍
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

      {/* ボトムシート: 公園リスト（ParkCard 表示中は非表示、閉じると戻る） */}
      <BottomSheet
        isOpen={isListOpen && !selectedPark}
        onClose={closeList}
        titleId="park-list-title"
        tall
      >
        <ParkList />
      </BottomSheet>

      {/* ボトムシートが開いているときの背景オーバーレイ */}
      {bottomSheetOpen && (
        <div
          className={styles.overlay}
          onClick={() => { closeSearchPanel(); selectPark(null); closeList(); }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
