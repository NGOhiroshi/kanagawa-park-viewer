import { useEffect, useRef } from "react";
import styles from "./BottomSheet.module.css";

interface Props {
  readonly isOpen: boolean;
  readonly onClose?: () => void;
  /** アクセシビリティ: ダイアログのタイトル (aria-labelledby 用) */
  readonly titleId: string;
  readonly children: React.ReactNode;
  /** 高さを 90dvh に広げる（リスト表示用） */
  readonly tall?: boolean;
}

const SWIPE_CLOSE_THRESHOLD = 80;

export function BottomSheet({ isOpen, onClose, titleId, children, tall }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      sheetRef.current?.focus();
    } else if (previousFocusRef.current instanceof HTMLElement) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) sheetRef.current.style.transform = `translateY(${deltaY}px)`;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
      sheetRef.current.style.transform = "";
    }
    if (deltaY >= SWIPE_CLOSE_THRESHOLD && onClose) onClose();
  };

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`${styles.sheet} ${isOpen ? styles.open : ""} ${tall ? styles.tall : ""}`}
      style={{ outline: "none" }}
    >
      {/* ドラッグハンドル — タッチ操作でシートを閉じる */}
      <div
        className={styles.handleArea}
        aria-hidden="true"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handle} />
      </div>
      {children}
    </div>
  );
}
