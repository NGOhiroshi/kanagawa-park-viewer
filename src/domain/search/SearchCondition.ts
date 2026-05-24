import type { FacilityKey } from "../park/Park";

export type SearchMode = "AND" | "OR";

export interface SearchCondition {
  readonly mode: SearchMode;
  readonly facilities: ReadonlySet<FacilityKey>;
}

export const EMPTY_CONDITION: SearchCondition = {
  mode: "AND",
  facilities: new Set(),
};

export function toggleFacility(
  condition: SearchCondition,
  key: FacilityKey,
): SearchCondition {
  const next = new Set(condition.facilities);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  return { ...condition, facilities: next };
}

export function setMode(
  condition: SearchCondition,
  mode: SearchMode,
): SearchCondition {
  return { ...condition, mode };
}

export function clearCondition(condition: SearchCondition): SearchCondition {
  return { ...condition, facilities: new Set() };
}
