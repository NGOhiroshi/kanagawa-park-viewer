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

  // --- 位置情報 ---
  userLocation: Coordinates | null;

  // --- UI状態 ---
  selectedParkId: string | null;
  isSearchPanelOpen: boolean;

  // --- アクション ---
  loadParks: () => Promise<void>;
  toggleFacility: (key: FacilityKey) => void;
  setMode: (mode: SearchMode) => void;
  clearCondition: () => void;
  selectPark: (id: string | null) => void;
  setUserLocation: (coords: Coordinates) => void;
  openSearchPanel: () => void;
  closeSearchPanel: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  allParks: [],
  filteredParks: [],
  isLoading: false,
  loadError: null,
  condition: EMPTY_CONDITION,
  userLocation: null,
  selectedParkId: null,
  isSearchPanelOpen: false,

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
    const { condition, allParks } = get();
    const next = toggleFacility(condition, key);
    set({ condition: next, filteredParks: filterParks(allParks, next) });
  },

  setMode: (mode) => {
    const { condition, allParks } = get();
    const next = setMode(condition, mode);
    set({ condition: next, filteredParks: filterParks(allParks, next) });
  },

  clearCondition: () => {
    const next = clearCondition(get().condition);
    set({ condition: next, filteredParks: get().allParks });
  },

  selectPark: (id) => {
    set({ selectedParkId: id, isSearchPanelOpen: false });
  },

  setUserLocation: (coords) => {
    set({ userLocation: coords });
  },

  openSearchPanel: () => {
    set({ isSearchPanelOpen: true, selectedParkId: null });
  },

  closeSearchPanel: () => {
    set({ isSearchPanelOpen: false });
  },
}));

// セレクター: 選択中の公園オブジェクトを返す
export function useSelectedPark(): Park | null {
  const { allParks, selectedParkId } = useAppStore();
  if (!selectedParkId) return null;
  return allParks.find((p) => p.id === selectedParkId) ?? null;
}
