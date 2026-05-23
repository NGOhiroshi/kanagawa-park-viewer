import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { parse } from "csv-parse/sync";
import { FACILITIES, type FacilityKey, type ParkBase } from "./schema.js";

const INPUT = "data/raw/parks_raw_sjis.csv";
const OUTPUT = "data/processed/parks.base.json";

const utf8 = new TextDecoder("shift-jis").decode(readFileSync(INPUT));
const rows: string[][] = parse(utf8, { skip_empty_lines: true, trim: true });

const header = rows[0];
const dataRows = rows.slice(1);

const colIndex = (ja: string): number => {
  const i = header.indexOf(ja);
  if (i < 0) throw new Error(`Column not found in CSV header: ${ja}`);
  return i;
};

const idx = {
  id: colIndex("ID"),
  name: colIndex("名称"),
  address: colIndex("所在地"),
  openedYear: colIndex("提供開始年"),
  areaSqm: colIndex("面積"),
  parkType: colIndex("公園種別"),
  hours: colIndex("開園時間"),
  closedDays: colIndex("休園日"),
  url: colIndex("関連リンク"),
  notes: colIndex("備考"),
  updatedAt: colIndex("最終更新日"),
};

const facilityIdx: Record<FacilityKey, number> = Object.fromEntries(
  FACILITIES.map((f) => [f.key, colIndex(f.ja)]),
) as Record<FacilityKey, number>;

const toNum = (s: string): number | null => {
  const n = Number(s);
  return Number.isFinite(n) && s.trim() !== "" ? n : null;
};

const toBool = (s: string): boolean => s.trim() === "1";

const parks: ParkBase[] = dataRows.map((row) => {
  const facilities = Object.fromEntries(
    FACILITIES.map((f) => [f.key, toBool(row[facilityIdx[f.key]] ?? "")]),
  ) as Record<FacilityKey, boolean>;

  return {
    id: row[idx.id],
    name: row[idx.name],
    address: row[idx.address],
    openedYear: toNum(row[idx.openedYear]),
    areaSqm: toNum(row[idx.areaSqm]),
    parkType: row[idx.parkType] ?? "",
    facilities,
    hours: row[idx.hours] ?? "",
    closedDays: row[idx.closedDays] ?? "",
    url: row[idx.url] ?? "",
    notes: row[idx.notes] ?? "",
    updatedAt: row[idx.updatedAt] ?? "",
  };
});

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(parks, null, 2));

const facilityTotals = FACILITIES.map((f) => ({
  facility: f.ja,
  count: parks.filter((p) => p.facilities[f.key]).length,
}));

console.log(`Parsed ${parks.length} parks → ${OUTPUT}`);
console.log("\nFacility coverage (top 10):");
facilityTotals
  .sort((a, b) => b.count - a.count)
  .slice(0, 10)
  .forEach((f) => console.log(`  ${f.facility.padEnd(20)} ${f.count}`));
console.log("\nFacility coverage (bottom 5 — rare facilities):");
facilityTotals
  .filter((f) => f.count > 0)
  .sort((a, b) => a.count - b.count)
  .slice(0, 5)
  .forEach((f) => console.log(`  ${f.facility.padEnd(20)} ${f.count}`));
