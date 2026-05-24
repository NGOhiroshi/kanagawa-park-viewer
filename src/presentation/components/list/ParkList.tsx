import {
  sortByDistance,
  KANAGAWA_PREFECTURAL_OFFICE,
} from "../../../domain/geo/haversine";
import { useAppStore } from "../../../application/store";
import { ParkListItem } from "./ParkListItem";
import styles from "./ParkList.module.css";

const DISPLAY_LIMIT = 300;

export function ParkList() {
  const { filteredParks, userLocation, geolocationStatus, selectParkFromList } =
    useAppStore();

  const origin = userLocation ?? KANAGAWA_PREFECTURAL_OFFICE;
  const sorted = sortByDistance(filteredParks, origin);
  const displayed = sorted.slice(0, DISPLAY_LIMIT);

  return (
    <section aria-labelledby="park-list-title" className={styles.panel}>
      <div className={styles.header}>
        <h2 id="park-list-title" className={styles.title}>
          {filteredParks.length}件の公園
        </h2>
        {!userLocation && (
          <p className={styles.locationHint} role="note">
            {geolocationStatus === "denied" || geolocationStatus === "unavailable"
              ? "📍 神奈川県庁からの距離で表示しています"
              : "📍 現在地を許可すると近い順で表示されます"}
          </p>
        )}
      </div>

      <ul className={styles.list} aria-label="公園リスト（距離順）">
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
          ※ 上位 {DISPLAY_LIMIT} 件を表示しています（全 {sorted.length} 件）
        </p>
      )}
    </section>
  );
}
