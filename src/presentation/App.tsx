import { useEffect, useState } from "react";
import { useAppStore, useSelectedPark } from "../application/store";
import { watchUserLocation } from "../infrastructure/GeolocationService";
import { useLocale } from "../i18n/useLocale";
import { ParkMap } from "./components/map/ParkMap";
import { SearchPanel } from "./components/search/SearchPanel";
import { ParkCard } from "./components/park/ParkCard";
import { ParkList } from "./components/list/ParkList";
import { SettingsPanel } from "./components/settings/SettingsPanel";
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
  const { t } = useLocale();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    loadParks();
  }, [loadParks]);

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
  const bottomSheetOpen = showSearchPanel || showParkCard || isListOpen || isSettingsOpen;
  const activeFilterCount = condition.facilities.size + (nameQuery.trim() ? 1 : 0);

  if (currentView === "about") {
    return <AboutPage />;
  }

  return (
    <>
      <main id="main-content" className={styles.mapWrapper} aria-label={t.map.ariaLabel(filteredParks.length)}>
        {isLoading && (
          <div className={styles.loadingOverlay} role="status" aria-live="polite">
            <p>{t.loading}</p>
          </div>
        )}
        {loadError && (
          <div className={styles.errorBanner} role="alert">
            <p>⚠️ {loadError}</p>
          </div>
        )}
        <ParkMap />
      </main>

      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.searchButton}
          onClick={openSearchPanel}
          aria-expanded={isSearchPanelOpen}
          aria-controls="search-panel"
          aria-label={t.topBar.findParksAria}
        >
          🔍
          <span className={styles.searchLabel}>{t.topBar.findParks}</span>
          <span
            className={`${styles.countBadge} ${activeFilterCount > 0 ? styles.countBadgeActive : ""}`}
            aria-label={t.topBar.parksCount(filteredParks.length)}
          >
            {filteredParks.length}
          </span>
        </button>

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
              ? t.topBar.locationGranted
              : geolocationStatus === "denied"
              ? t.topBar.locationDenied
              : t.topBar.locationGet
          }
          aria-pressed={geolocationStatus === "granted"}
        >
          📍
        </button>

        <button
          type="button"
          className={styles.settingsBtn}
          onClick={() => setIsSettingsOpen(true)}
          aria-label={t.topBar.settings}
        >
          ⚙️
        </button>

        <button
          type="button"
          className={styles.aboutBtn}
          onClick={() => setView("about")}
          aria-label={t.topBar.aboutApp}
        >
          ℹ️
        </button>
      </div>

      <BottomSheet
        isOpen={showSearchPanel}
        onClose={closeSearchPanel}
        titleId="search-panel-title"
      >
        <div id="search-panel">
          <SearchPanel />
        </div>
      </BottomSheet>

      <BottomSheet
        isOpen={showParkCard}
        onClose={() => selectPark(null)}
        titleId="park-card-title"
      >
        <ParkCard />
      </BottomSheet>

      <BottomSheet
        isOpen={isListOpen && !selectedPark}
        onClose={closeList}
        titleId="park-list-title"
        tall
      >
        <ParkList />
      </BottomSheet>

      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        titleId="settings-panel-title"
      >
        <SettingsPanel />
      </BottomSheet>

      {bottomSheetOpen && (
        <div
          className={styles.overlay}
          onClick={() => {
            closeSearchPanel();
            selectPark(null);
            closeList();
            setIsSettingsOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
