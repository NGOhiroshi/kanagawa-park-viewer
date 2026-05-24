import type { Park } from "./Park";

// インフラ層が実装すべきポート（インターフェース）
export interface ParkRepository {
  getAll(): Promise<Park[]>;
}
