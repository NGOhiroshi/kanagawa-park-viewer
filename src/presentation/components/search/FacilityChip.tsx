import type { FacilityKey } from "../../../domain/park/Park";
import { useAppStore } from "../../../application/store";
import styles from "./FacilityChip.module.css";

// 主要設備の絵文字マッピング（アイコン代わりに使用）
const FACILITY_EMOJI: Partial<Record<FacilityKey, string>> = {
  toilet:           "🚻",
  accessibleToilet: "♿",
  water:            "🚰",
  swing:            "🪁",
  sandbox:          "⏳",
  slide:            "🛝",
  combinedPlay:     "🧩",
  jungleGym:        "🏗️",
  lawn:             "🌿",
  waterPlay:        "💧",
  bbq:              "🔥",
  dogRun:           "🐕",
  freeParking:      "🅿️",
  paidParking:      "🅿️",
  tennis:           "🎾",
  pool:             "🏊",
};

interface Props {
  facilityKey: FacilityKey;
  label: string;
}

/**
 * 設備フィルタ用チップボタン。
 *
 * アクセシビリティポイント:
 * - aria-pressed で選択状態をスクリーンリーダーに伝える
 * - 絵文字は aria-hidden で装飾扱いにし、ラベル文字が読み上げられる
 * - 最小タップサイズ 44px
 */
export function FacilityChip({ facilityKey, label }: Props) {
  const { condition, toggleFacility } = useAppStore();
  const isSelected = condition.facilities.has(facilityKey);
  const emoji = FACILITY_EMOJI[facilityKey];

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => toggleFacility(facilityKey)}
      className={`${styles.chip} ${isSelected ? styles.selected : ""}`}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
    </button>
  );
}
