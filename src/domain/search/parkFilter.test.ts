import { describe, it, expect } from "vitest";
import { filterParks } from "./parkFilter";
import type { Park } from "../park/Park";
import type { SearchCondition } from "./SearchCondition";

// テスト用の最小 Park オブジェクトを生成するファクトリ
function makepark(id: string, facilities: Partial<Record<string, boolean>> = {}): Park {
  return {
    id,
    name: `公園${id}`,
    address: "神奈川県テスト市",
    lat: 35.5,
    lng: 139.5,
    parkType: "近隣公園",
    openedYear: null,
    areaSqm: null,
    hours: "",
    closedDays: "",
    url: "",
    notes: "",
    updatedAt: "",
    facilities: {
      toilet: false, accessibleToilet: false, water: false,
      springRider: false, sandbox: false, combinedPlay: false,
      fitnessEquip: false, swing: false, slide: false,
      jungleGym: false, horizontalBar: false, seesaw: false,
      tarzanRope: false, rollerSlide: false, bouncyDome: false,
      lawn: false, waterPlay: false, runningCourse: false,
      tennis: false, basketball: false, baseball: false,
      futsal: false, soccer: false, skatepark: false,
      pool: false, gym: false, trackField: false,
      rabbits: false, hamsters: false, chicks: false, ponies: false,
      cafe: false, shop: false, vendingMachine: false, bbq: false,
      dogRun: false, smokingArea: false, eventPlaza: false,
      evacuationSite: false, freeParking: false, paidParking: false,
      bikeParking: false,
      ...facilities,
    },
  };
}

const parks = [
  makepark("A", { swing: true, sandbox: true, toilet: true }),
  makepark("B", { swing: true, sandbox: false, toilet: true }),
  makepark("C", { swing: false, sandbox: true, toilet: false }),
  makepark("D", { swing: false, sandbox: false, toilet: false }),
];

describe("filterParks", () => {
  it("条件が空のときは全件返す", () => {
    const condition: SearchCondition = { mode: "AND", facilities: new Set() };
    expect(filterParks(parks, condition)).toHaveLength(4);
  });

  it("AND: すべての設備を持つ公園のみ返す", () => {
    const condition: SearchCondition = {
      mode: "AND",
      facilities: new Set(["swing", "sandbox"] as const),
    };
    const result = filterParks(parks, condition);
    expect(result.map((p) => p.id)).toEqual(["A"]);
  });

  it("OR: いずれかの設備を持つ公園を返す", () => {
    const condition: SearchCondition = {
      mode: "OR",
      facilities: new Set(["swing", "sandbox"] as const),
    };
    const result = filterParks(parks, condition);
    expect(result.map((p) => p.id)).toEqual(["A", "B", "C"]);
  });

  it("AND: 1件も該当しなければ空配列を返す", () => {
    const condition: SearchCondition = {
      mode: "AND",
      facilities: new Set(["swing", "sandbox", "pool"] as const),
    };
    expect(filterParks(parks, condition)).toHaveLength(0);
  });

  it("OR: 1つの条件でフィルタリングできる", () => {
    const condition: SearchCondition = {
      mode: "OR",
      facilities: new Set(["toilet"] as const),
    };
    const result = filterParks(parks, condition);
    expect(result.map((p) => p.id)).toEqual(["A", "B"]);
  });
});
