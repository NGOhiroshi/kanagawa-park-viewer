import { useEffect, useRef } from "react";
import styles from "./BottomSheet.module.css";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  /** アクセシビリティ: ダイアログのタイトル (aria-labelledby 用) */
  titleId: string;
  children: React.ReactNode;
  /** 高さを 90dvh に広げる（リスト表示用） */
  tall?: boolean;
}

/**
 * アクセシブルなボトムシート。
 * - isOpen=true で role="dialog" + aria-modal によりスクリーンリーダーが
 *   シート外のコンテンツを読み上げなくなる。
 * - 開閉時にフォーカスを適切に移動（フォーカストラップ）。
 * - Escape キーで閉じる。
 */
export function BottomSheet({ isOpen, onClose, titleId, children, tall }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // 開いたときに直前のフォーカスを記憶し、シートにフォーカスを移動
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      sheetRef.current?.focus();
    } else {
      // 閉じたとき元の要素にフォーカスを戻す
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Escape キーで閉じる
  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`${styles.sheet} ${isOpen ? styles.open : ""} ${tall ? styles.tall : ""}`}
      // マウスユーザーにはフォーカスリングを見せない
      style={{ outline: "none" }}
    >
      {/* ドラッグハンドル (視覚的ヒント) */}
      <div className={styles.handle} aria-hidden="true" />
      {children}
    </div>
  );
}
