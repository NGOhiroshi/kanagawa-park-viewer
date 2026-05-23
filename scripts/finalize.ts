/**
 * Merge parsed CSV + geocoded coords into a compact frontend-ready JSON.
 *
 * Output format (tuple-per-park, smallest gzipped footprint):
 *   {
 *     facilityKeys: [...],  // bit order for the facilities mask
 *     parks: [
 *       [id, name, address, lat, lng, facilitiesMask, type, year, area, hours, closed, url, notes, updated],
 *       ...
 *     ]
 *   }
 *
 * Lat/lng are rounded to 5 decimals (~1m precision).
 * Facilities are bit-packed into a single number (42 flags fit safely in 53-bit JS integers).
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { gzipSync } from "node:zlib";
import { FACILITIES, type ParkBase } from "./schema.js";

const BASE = "data/processed/parks.base.json";
const GEOCODE = "data/processed/geocode_cache.json";
const OUTPUT = "public/parks.json";

interface GeocodeResult {
  lat: number;
  lng: number;
  matchedAddress: string;
  strategy: string;
}

const parks = JSON.parse(readFileSync(BASE, "utf-8")) as ParkBase[];
const geocode = JSON.parse(readFileSync(GEOCODE, "utf-8")) as Record<
  string,
  GeocodeResult
>;

const facilityKeys = FACILITIES.map((f) => f.key);
const round5 = (n: number) => Math.round(n * 1e5) / 1e5;

const packFacilities = (f: Record<string, boolean>): number => {
  let mask = 0;
  facilityKeys.forEach((key, i) => {
    if (f[key]) mask += 2 ** i;
  });
  return mask;
};

type ParkTuple = [
  string, // id
  string, // name
  string, // address
  number | null, // lat
  number | null, // lng
  number, // facilities mask
  string, // parkType
  number | null, // openedYear
  number | null, // areaSqm
  string, // hours
  string, // closedDays
  string, // url
  string, // notes
  string, // updatedAt
];

const tuples: ParkTuple[] = parks.map((p) => {
  const g = geocode[p.id];
  return [
    p.id,
    p.name,
    p.address,
    g ? round5(g.lat) : null,
    g ? round5(g.lng) : null,
    packFacilities(p.facilities),
    p.parkType,
    p.openedYear,
    p.areaSqm,
    p.hours,
    p.closedDays,
    p.url,
    p.notes,
    p.updatedAt,
  ];
});

const withCoords = tuples.filter((t) => t[3] !== null).length;
const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  facilityKeys,
  fieldOrder: [
    "id",
    "name",
    "address",
    "lat",
    "lng",
    "facilities",
    "parkType",
    "openedYear",
    "areaSqm",
    "hours",
    "closedDays",
    "url",
    "notes",
    "updatedAt",
  ],
  parks: tuples,
};

mkdirSync(dirname(OUTPUT), { recursive: true });
const json = JSON.stringify(out);
writeFileSync(OUTPUT, json);
const gz = gzipSync(json, { level: 9 });

console.log(`Wrote ${OUTPUT}`);
console.log(`  parks:            ${tuples.length}`);
console.log(`  with coords:      ${withCoords} (${((withCoords / tuples.length) * 100).toFixed(2)}%)`);
console.log(`  raw size:         ${(json.length / 1024).toFixed(0)} KB`);
console.log(`  gzipped size:     ${(gz.length / 1024).toFixed(0)} KB`);
