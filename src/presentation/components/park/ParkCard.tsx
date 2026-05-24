import { FACILITIES } from "../../../domain/park/Park";
import { useAppStore, useSelectedPark } from "../../../application/store";
import { FacilityBadge } from "./FacilityBadge";
import styles from "./ParkCard.module.css";

const GOOGLE_MAPS_URL = (name: string, address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + address)}`;

/**
 * 選択中の公園詳細カード（ボトムシート内）。
 *
 * アクセシビリティポイント:
 * - 見出しレベル h2 で公園名を宣言（BottomSheet の aria-labelledby と連携）
 * - Google Maps リンクは target="_blank" + rel="noopener" +
 *   aria-label で「新しいタブで開く」を明示
 * - 設備リストは dl (term/description) でセマンティックに表現
 */
export function ParkCard() {
  const park = useSelectedPark();
  const { selectPark } = useAppStore();

  if (!park) return null;

  const presentFacilities = FACILITIES.filter((f) => park.facilities[f.key]);
  const absentFacilities  = FACILITIES.filter((f) => !park.facilities[f.key]);

  return (
    <article aria-label={park.name} className={styles.card}>
      {/* 閉じるボタン */}
      <button
        type="button"
        onClick={() => selectPark(null)}
        className={styles.closeBtn}
        aria-label={`${park.name} の詳細を閉じる`}
      >
        ✕
      </button>

      <h2 id="park-card-title" className={styles.parkName}>{park.name}</h2>
      {park.parkType && <p className={styles.parkType}>{park.parkType}</p>}

      {/* 基本情報 */}
      <dl className={styles.info}>
        <div className={styles.infoRow}>
          <dt>住所</dt>
          <dd>{park.address || "不明"}</dd>
        </div>
        {park.hours && (
          <div className={styles.infoRow}>
            <dt>開園時間</dt>
            <dd>{park.hours}</dd>
          </div>
        )}
        {park.closedDays && (
          <div className={styles.infoRow}>
            <dt>休園日</dt>
            <dd>{park.closedDays}</dd>
          </div>
        )}
        {park.areaSqm && (
          <div className={styles.infoRow}>
            <dt>面積</dt>
            <dd>{park.areaSqm.toLocaleString()} m²</dd>
          </div>
        )}
      </dl>

      {/* アクションリンク */}
      <div className={styles.actions}>
        <a
          href={GOOGLE_MAPS_URL(park.name, park.address)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapsLink}
          aria-label={`${park.name} をGoogle Mapsで開く（新しいタブ）`}
        >
          🗺️ Google Maps でナビ
        </a>
        {park.url && (
          <a
            href={park.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.officialLink}
            aria-label={`${park.name} の公式ページを開く（新しいタブ）`}
          >
            公式ページ ↗
          </a>
        )}
      </div>

      {/* 設備一覧: あり → なし の順 */}
      <section aria-label="設備一覧">
        <h3 className={styles.sectionTitle}>設備</h3>
        <div className={styles.facilityGrid}>
          {presentFacilities.map((f) => (
            <FacilityBadge key={f.key} facilityKey={f.key} label={f.ja} present={true} />
          ))}
          {absentFacilities.map((f) => (
            <FacilityBadge key={f.key} facilityKey={f.key} label={f.ja} present={false} />
          ))}
        </div>
      </section>
    </article>
  );
}
