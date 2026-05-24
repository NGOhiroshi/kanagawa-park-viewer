import { haversineDistance, formatDistance } from "../../../domain/geo/haversine";
import type { Coordinates } from "../../../domain/geo/haversine";
import { FACILITIES } from "../../../domain/park/Park";
import type { Park } from "../../../domain/park/Park";
import { useAppStore } from "../../../application/store";
import styles from "./ParkListItem.module.css";

interface Props {
  park: Park;
  origin: Coordinates;
  onClick: () => void;
}

export function ParkListItem({ park, origin, onClick }: Props) {
  const { condition } = useAppStore();

  const distance =
    park.lat !== null && park.lng !== null
      ? haversineDistance(origin, { lat: park.lat, lng: park.lng })
      : null;

  const activeFacilityLabels = [...condition.facilities]
    .filter((key) => park.facilities[key])
    .map((key) => FACILITIES.find((f) => f.key === key)?.ja ?? key);

  return (
    <button type="button" className={styles.item} onClick={onClick}>
      <div className={styles.top}>
        <span className={styles.name}>{park.name}</span>
        {distance !== null && (
          <span className={styles.distance}>{formatDistance(distance)}</span>
        )}
      </div>
      <p className={styles.address}>{park.address}</p>
      {activeFacilityLabels.length > 0 && (
        <div className={styles.badges} aria-label="絞り込み中の設備">
          {activeFacilityLabels.map((label) => (
            <span key={label} className={styles.badge}>{label}</span>
          ))}
        </div>
      )}
    </button>
  );
}
