import { describe, it, expect } from "vitest";
import { haversineDistance, sortByDistance, formatDistance } from "./haversine";

describe("haversineDistance", () => {
  it("同一地点は 0m", () => {
    const a = { lat: 35.5, lng: 139.5 };
    expect(haversineDistance(a, a)).toBe(0);
  });

  it("横浜〜川崎は約 15km", () => {
    const yokohama = { lat: 35.4437, lng: 139.638 };
    const kawasaki  = { lat: 35.5308, lng: 139.7026 };
    const dist = haversineDistance(yokohama, kawasaki);
    // 実測値は約 11km（直線距離）
    expect(dist).toBeGreaterThan(10_000);
    expect(dist).toBeLessThan(14_000);
  });
});

describe("sortByDistance", () => {
  it("近い順に並ぶ", () => {
    const origin = { lat: 35.5, lng: 139.5 };
    const items = [
      { id: "far",  lat: 35.6, lng: 139.6 },
      { id: "near", lat: 35.5, lng: 139.51 },
      { id: "mid",  lat: 35.52, lng: 139.52 },
    ];
    const sorted = sortByDistance(items, origin);
    expect(sorted.map((i) => i.id)).toEqual(["near", "mid", "far"]);
  });

  it("座標なし公園は末尾に来る", () => {
    const origin = { lat: 35.5, lng: 139.5 };
    const items = [
      { id: "no-coords", lat: null, lng: null },
      { id: "with-coords", lat: 35.5, lng: 139.51 },
    ];
    const sorted = sortByDistance(items, origin);
    expect(sorted[0].id).toBe("with-coords");
    expect(sorted[1].id).toBe("no-coords");
  });
});

describe("formatDistance", () => {
  it("1000m 未満はメートル表示", () => {
    expect(formatDistance(350)).toBe("350m");
  });

  it("1000m 以上はキロメートル表示", () => {
    expect(formatDistance(1234)).toBe("1.2km");
  });
});
