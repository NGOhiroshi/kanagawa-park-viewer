import styles from "./FacilityBadge.module.css";

interface Props {
  readonly label: string;
  readonly present: boolean;
}

/**
 * 設備の有無を示すバッジ。
 *
 * アクセシビリティポイント:
 * - ✓ / ✗ は aria-hidden で装飾扱い
 * - aria-label に "設備名: あり/なし" を付与
 * - 色だけでなくテキストでも状態を伝える（色盲ユーザー配慮）
 */
export function FacilityBadge({ label, present }: Props) {
  return (
    <div
      className={`${styles.badge} ${present ? styles.present : styles.absent}`}
      aria-label={`${label}: ${present ? "あり" : "なし"}`}
    >
      <span aria-hidden="true" className={styles.icon}>
        {present ? "✓" : "✗"}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
