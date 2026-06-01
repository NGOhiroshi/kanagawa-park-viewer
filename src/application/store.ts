import { create } from "zustand";
import type { Park, FacilityKey } from "../domain/park/Park";
import {
  type SearchCondition,
  type SearchMode,
  EMPTY_CONDITION,
  toggleFacility,
  setMode,
  clearCondition,
} from "../domain/search/SearchCondition";
import { filterParks } from "../domain/search/parkFilter";
import type { Coordinates } from "../domain/geo/haversine";
import { parkRepository } from "../infrastructure/JsonParkRepository";

interface AppState {
  // --- データ ---
  allParks: Park[];
  filteredParks: Park[];
  isLoading: boolean;
  loadError: string | null;

  // --- 検索条件 ---
  condition: SearchCondition;
  nameQuery: string;

  // --- 位置情報 ---
  userLocation: Coordinates | null;

  // --- UI状態 ---
  selectedParkId: string | null;
  isSearchPanelOpen: boolean;
  isListOpen: boolean;
  focusedParkId: string | null;
  currentView: "map" | "about";
  geolocationStatus: "idle" | "granted" | "denied" | "unavailable";

  // --- アクション ---
  loadParks: () => Promise<void>;
  toggleFacility: (key: FacilityKey) => void;
  setMode: (mode: SearchMode) => void;
  clearCondition: () => void;
  setNameQuery: (query: string) => void;
  selectPark: (id: string | null) => void;
  selectParkFromList: (id: string) => void;
  setUserLocation: (coords: Coordinates) => void;
  setGeolocationStatus: (status: "idle" | "granted" | "denied" | "unavailable") => void;
  openSearchPanel: () => void;
  closeSearchPanel: () => void;
  openList: () => void;
  closeList: () => void;
  focusPark: (id: string | null) => void;
  setView: (view: "map" | "about") => void;
}

/** 名前フィルタ + 設備フィルタを合成して適用する */
function applyFilters(
  allParks: Park[],
  condition: SearchCondition,
  nameQuery: string,
): Park[] {
  const facilityFiltered = filterParks(allParks, condition);
  if (!nameQuery.trim()) return facilityFiltered;
  const q = nameQuery.trim().toLowerCase();
  return facilityFiltered.filter((p) =>
    p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q),
  );
}

export const useAppStore = create<AppState>((set, get) => ({
  allParks: [],
  filteredParks: [],
  isLoading: false,
  loadError: null,
  condition: EMPTY_CONDITION,
  nameQuery: "",
  userLocation: null,
  selectedParkId: null,
  isSearchPanelOpen: false,
  isListOpen: false,
  focusedParkId: null,
  currentView: "map",
  geolocationStatus: "idle",

  loadParks: async () => {
    set({ isLoading: true, loadError: null });
    try {
      const parks = await parkRepository.getAll();
      set({ allParks: parks, filteredParks: parks, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        loadError: err instanceof Error ? err.message : "データ読み込みに失敗しました",
      });
    }
  },

  toggleFacility: (key) => {
    const { condition, allParks, nameQuery } = get();
    const next = toggleFacility(condition, key);
    set({ condition: next, filteredParks: applyFilters(allParks, next, nameQuery) });
  },

  setMode: (mode) => {
    const { condition, allParks, nameQuery } = get();
    const next = setMode(condition, mode);
    set({ condition: next, filteredParks: applyFilters(allParks, next, nameQuery) });
  },

  clearCondition: () => {
    const { allParks, nameQuery } = get();
    const next = clearCondition(get().condition);
    set({ condition: next, filteredParks: applyFilters(allParks, next, nameQuery) });
  },

  setNameQuery: (query) => {
    const { allParks, condition } = get();
    set({ nameQuery: query, filteredParks: applyFilters(allParks, condition, query) });
  },

  selectPark: (id) => {
    if (id === null) {
      // カードを閉じる: isListOpen・focusedParkId は変更しない
      // (リストへ戻る / フォーカス継続のため)
      set({ selectedParkId: null });
    } else {
      // マップ上のピンをタップ: リストも閉じる、フォーカスも解除
      set({ selectedParkId: id, isSearchPanelOpen: false, isListOpen: false, focusedParkId: null });
    }
  },

  selectParkFromList: (id) => {
    // リストから公園を選択: isListOpen は true のまま（「リストに戻る」用）
    set({ selectedParkId: id, isSearchPanelOpen: false, focusedParkId: null });
  },

  setUserLocation: (coords) => {
    set({ userLocation: coords });
  },

  setGeolocationStatus: (status) => {
    set({ geolocationStatus: status });
  },

  openSearchPanel: () => {
    set({ isSearchPanelOpen: true, selectedParkId: null, isListOpen: false });
  },

  closeSearchPanel: () => {
    set({ isSearchPanelOpen: false });
  },

  openList: () => {
    set({ isListOpen: true, isSearchPanelOpen: false, selectedParkId: null, focusedParkId: null });
  },

  closeList: () => {
    set({ isListOpen: false });
  },

  focusPark: (id) => {
    set({ focusedParkId: id });
  },

  setView: (view) => {
    set({ currentView: view, isSearchPanelOpen: false, selectedParkId: null, isListOpen: false, focusedParkId: null });
  },
}));

// セレクター: 選択中の公園オブジェクトを返す
export function useSelectedPark(): Park | null {
  const { allParks, selectedParkId } = useAppStore();
  if (!selectedParkId) return null;
  return allParks.find((p) => p.id === selectedParkId) ?? null;
}
