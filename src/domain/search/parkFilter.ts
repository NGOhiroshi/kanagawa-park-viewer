import type { Park } from "../park/Park";
import type { SearchCondition } from "./SearchCondition";

/**
 * 純粋関数: 検索条件に従って公園リストをフィルタリングする。
 * React非依存のため単体テストが容易。
 */
export function filterParks(parks: Park[], condition: SearchCondition): Park[] {
  if (condition.facilities.size === 0) return parks;

  const keys = [...condition.facilities];

  if (condition.mode === "AND") {
    return parks.filter((park) => keys.every((key) => park.facilities[key]));
  } else {
    return parks.filter((park) => keys.some((key) => park.facilities[key]));
  }
}
