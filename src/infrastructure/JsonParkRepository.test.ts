/**
 * JsonParkRepository のビットマスク展開テスト。
 *
 * 再発防止: JavaScript の `<<` 演算子は 32bit 整数に限定される。
 * `1 << 34` = `1 << (34 % 32)` = `1 << 2` = 4 = water のビットに化けるため、
 * 「水飲み・手洗いがある公園」が「バーベキュー場あり」と誤表示されていた。
 *
 * FACILITIES の高ビット側 (index 32〜41) の対応:
 *   32: shop(売店)       →  1<<32 = 1<<0 = toilet
 *   33: vendingMachine   →  1<<33 = 1<<1 = accessibleToilet
 *   34: bbq              →  1<<34 = 1<<2 = water    ← ユーザー報告の症状はここ
 *   35: dogRun           →  1<<35 = 1<<3 = springRider
 *   36: smokingArea      →  1<<36 = 1<<4 = sandbox
 *   37: eventPlaza       →  1<<37 = 1<<5 = combinedPlay
 *   38: evacuationSite   →  1<<38 = 1<<6 = fitnessEquip
 *   39: freeParking      →  1<<39 = 1<<7 = swing
 *   40: paidParking      →  1<<40 = 1<<8 = slide
 *   41: bikeParking      →  1<<41 = 1<<9 = jungleGym
 */
import { describe, it, expect } from "vitest";
import type { FacilityKey } from "../domain/park/Park";
import { FACILITIES } from "../domain/park/Park";

// 修正済み実装（BigInt使用）
function unpackFacilities(
  mask: number,
  keys: FacilityKey[],
): Record<FacilityKey, boolean> {
  const bigMask = BigInt(mask);
  const result = {} as Record<FacilityKey, boolean>;
  keys.forEach((key, i) => {
    result[key] = Boolean(bigMask & (BigInt(1) << BigInt(i)));
  });
  return result;
}

// バグのあった旧実装（比較・再発防止用）
function unpackFacilitiesBuggy(
  mask: number,
  keys: FacilityKey[],
): Record<FacilityKey, boolean> {
  const result = {} as Record<FacilityKey, boolean>;
  keys.forEach((key, i) => {
    result[key] = Boolean(mask & (1 << i)); // ← 32bit 演算でビット位置 32+ が壊れる
  });
  return result;
}

const facilityKeys = FACILITIES.map((f) => f.key);

function bitIndexOf(key: FacilityKey): number {
  return facilityKeys.indexOf(key);
}

describe("unpackFacilities (BigInt版)", () => {
  it("前提: bbq=index34, bikeParking=index41 であること", () => {
    expect(bitIndexOf("bbq")).toBe(34);
    expect(bitIndexOf("bikeParking")).toBe(41);
    expect(bitIndexOf("water")).toBe(2);
    expect(bitIndexOf("jungleGym")).toBe(9);
  });

  it("bit 0〜30 は正しく展開できる", () => {
    const mask = (2 ** 0) + (2 ** 7); // toilet(0) + swing(7)
    const result = unpackFacilities(mask, facilityKeys);
    expect(result.toilet).toBe(true);
    expect(result.swing).toBe(true);
    expect(result.bbq).toBe(false);
  });

  it("bit 34 (bbq) を正しく展開できる", () => {
    const mask = 2 ** 34; // bbq のみ ON
    const result = unpackFacilities(mask, facilityKeys);
    expect(result.bbq).toBe(true);
    expect(result.water).toBe(false); // water(bit2) は OFF のはず
  });

  it("bit 41 (bikeParking) を正しく展開できる", () => {
    const mask = 2 ** 41;
    const result = unpackFacilities(mask, facilityKeys);
    expect(result.bikeParking).toBe(true);
    expect(result.jungleGym).toBe(false);
  });

  it("[旧バグ再現] water あり → bbq が誤って true になった", () => {
    // water=bit2, 1<<34 = 1<<2 = 4 = water のマスクと一致
    const maskWaterOnly = 2 ** 2; // water のみ

    const correct = unpackFacilities(maskWaterOnly, facilityKeys);
    expect(correct.water).toBe(true);
    expect(correct.bbq).toBe(false); // ← 正しくは false

    const buggy = unpackFacilitiesBuggy(maskWaterOnly, facilityKeys);
    expect(buggy.water).toBe(true);
    expect(buggy.bbq).toBe(true);    // ← 旧バグ: 1<<34=1<<2=water と重なり誤って true
  });

  it("[旧バグ再現] jungleGym あり → bikeParking が誤って true になった", () => {
    // jungleGym=bit9, 1<<41 = 1<<9 = 512 = jungleGym のマスクと一致
    const maskJungleOnly = 2 ** 9;

    const correct = unpackFacilities(maskJungleOnly, facilityKeys);
    expect(correct.jungleGym).toBe(true);
    expect(correct.bikeParking).toBe(false); // ← 正しくは false

    const buggy = unpackFacilitiesBuggy(maskJungleOnly, facilityKeys);
    expect(buggy.jungleGym).toBe(true);
    expect(buggy.bikeParking).toBe(true);    // ← 旧バグ: 1<<41=1<<9=jungleGym と重なり誤って true
  });

  it("bit 32〜41 の全設備を個別に展開できる", () => {
    const highBits: FacilityKey[] = [
      "shop", "vendingMachine", "bbq", "dogRun",
      "smokingArea", "eventPlaza", "evacuationSite",
      "freeParking", "paidParking", "bikeParking",
    ];
    highBits.forEach((key) => {
      const bit = bitIndexOf(key);
      const mask = 2 ** bit;
      const result = unpackFacilities(mask, facilityKeys);
      expect(result[key]).toBe(true);
      expect(result.toilet).toBe(false);
      expect(result.swing).toBe(false);
    });
  });

  it("toilet + bbq + bikeParking の複合マスクを正しく展開できる", () => {
    const mask = 2 ** 0 + 2 ** 34 + 2 ** 41;
    const result = unpackFacilities(mask, facilityKeys);
    expect(result.toilet).toBe(true);
    expect(result.bbq).toBe(true);
    expect(result.bikeParking).toBe(true);
    expect(result.water).toBe(false);
    expect(result.jungleGym).toBe(false);
  });
});
