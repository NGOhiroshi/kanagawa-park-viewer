import type { SearchMode } from "../../../domain/search/SearchCondition";
import { useAppStore } from "../../../application/store";
import styles from "./AndOrToggle.module.css";

/**
 * AND / OR 切り替えトグルボタン。
 *
 * アクセシビリティポイント:
 * - role="group" + aria-label でボタングループをラベル付け
 * - aria-pressed でアクティブ状態を明示（スクリーンリーダーが "押されています" と読む）
 * - 最小タップサイズ 44px を CSS で保証
 */
export function AndOrToggle() {
  const { condition, setMode } = useAppStore();

  return (
    <div role="group" aria-label="検索条件の組み合わせ方" className={styles.group}>
      <ModeButton label="AND" current={condition.mode} onClick={setMode} />
      <ModeButton label="OR"  current={condition.mode} onClick={setMode} />
    </div>
  );
}

function ModeButton({
  label,
  current,
  onClick,
}: {
  label: SearchMode;
  current: SearchMode;
  onClick: (mode: SearchMode) => void;
}) {
  const isActive = label === current;
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onClick(label)}
      className={`${styles.btn} ${isActive ? styles.active : ""}`}
    >
      {label}
      <span className="sr-only">
        {label === "AND" ? "（すべて含む）" : "（どれか含む）"}
      </span>
    </button>
  );
}
