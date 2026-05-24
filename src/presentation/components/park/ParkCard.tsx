import { FACILITIES } from "../../../domain/park/Park";
import { useAppStore, useSelectedPark } from "../../../application/store";
import { useLocale } from "../../../i18n/useLocale";
import { FacilityBadge } from "./FacilityBadge";
import styles from "./ParkCard.module.css";

const GOOGLE_MAPS_URL = (name: string, address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;

export function ParkCard() {
  const park = useSelectedPark();
  const { selectPark, focusPark, closeList, isListOpen } = useAppStore();
  const { t } = useLocale();

  if (!park) return null;

  const presentFacilities = FACILITIES.filter((f) => park.facilities[f.key]);
  const absentFacilities  = FACILITIES.filter((f) => !park.facilities[f.key]);

  const handleFocus = () => {
    focusPark(park.id);
    closeList();
    selectPark(null);
  };

  return (
    <article aria-label={park.name} className={styles.card}>
      <div className={styles.topActions}>
        {isListOpen ? (
          <button
            type="button"
            onClick={() => selectPark(null)}
            className={styles.backBtn}
            aria-label={t.card.backToListAria}
          >
            {t.card.backToList}
          </button>
        ) : (
          <div />
        )}
        <button
          type="button"
          onClick={() => { selectPark(null); closeList(); }}
          className={styles.closeBtn}
          aria-label={t.card.close(park.name)}
        >
          ✕
        </button>
      </div>

      <h2 id="park-card-title" className={styles.parkName}>{park.name}</h2>
      {park.parkType && <p className={styles.parkType}>{park.parkType}</p>}

      <dl className={styles.info}>
        <div className={styles.infoRow}>
          <dt>{t.card.address}</dt>
          <dd>{park.address || t.card.unknownAddress}</dd>
        </div>
        {park.hours && (
          <div className={styles.infoRow}>
            <dt>{t.card.hours}</dt>
            <dd>{park.hours}</dd>
          </div>
        )}
        {park.closedDays && (
          <div className={styles.infoRow}>
            <dt>{t.card.closedDays}</dt>
            <dd>{park.closedDays}</dd>
          </div>
        )}
        {park.areaSqm && (
          <div className={styles.infoRow}>
            <dt>{t.card.area}</dt>
            <dd>{park.areaSqm.toLocaleString()} m²</dd>
          </div>
        )}
      </dl>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleFocus}
          className={styles.focusBtn}
          aria-label={t.card.focusMapAria(park.name)}
        >
          {t.card.focusMap}
        </button>
        <a
          href={GOOGLE_MAPS_URL(park.name, park.address)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapsLink}
          aria-label={t.card.navigateAria(park.name)}
        >
          {t.card.navigate}
        </a>
        {park.url && (
          <a
            href={park.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.officialLink}
            aria-label={t.card.officialSiteAria(park.name)}
          >
            {t.card.officialSite}
          </a>
        )}
      </div>

      <section aria-label={t.card.facilitiesAria}>
        <h3 className={styles.sectionTitle}>{t.card.facilities}</h3>
        <div className={styles.facilityGrid}>
          {presentFacilities.map((f) => (
            <FacilityBadge key={f.key} facilityKey={f.key} label={t.facilityNames[f.key]} present={true} />
          ))}
          {absentFacilities.map((f) => (
            <FacilityBadge key={f.key} facilityKey={f.key} label={t.facilityNames[f.key]} present={false} />
          ))}
        </div>
      </section>
    </article>
  );
}
