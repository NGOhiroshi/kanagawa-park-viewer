import {
  sortByDistance,
  KANAGAWA_PREFECTURAL_OFFICE,
} from "../../../domain/geo/haversine";
import { useAppStore } from "../../../application/store";
import { useLocale } from "../../../i18n/useLocale";
import { ParkListItem } from "./ParkListItem";
import styles from "./ParkList.module.css";

const DISPLAY_LIMIT = 300;

export function ParkList() {
  const { filteredParks, userLocation, geolocationStatus, selectParkFromList } =
    useAppStore();
  const { t } = useLocale();

  const origin = userLocation ?? KANAGAWA_PREFECTURAL_OFFICE;
  const sorted = sortByDistance(filteredParks, origin);
  const displayed = sorted.slice(0, DISPLAY_LIMIT);

  return (
    <section aria-labelledby="park-list-title" className={styles.panel}>
      <div className={styles.header}>
        <h2 id="park-list-title" className={styles.title}>
          {t.list.title(filteredParks.length)}
        </h2>
        {!userLocation && (
          <p className={styles.locationHint} role="note">
            {geolocationStatus === "denied" || geolocationStatus === "unavailable"
              ? t.list.fromPrefOffice
              : t.list.allowLocation}
          </p>
        )}
      </div>

      <ul className={styles.list} aria-label={t.list.ariaLabel}>
        {displayed.map((park) => (
          <li key={park.id}>
            <ParkListItem
              park={park}
              origin={origin}
              onClick={() => selectParkFromList(park.id)}
            />
          </li>
        ))}
      </ul>

      {sorted.length > DISPLAY_LIMIT && (
        <p className={styles.truncatedNote}>
          {t.list.truncated(DISPLAY_LIMIT, sorted.length)}
        </p>
      )}
    </section>
  );
}
