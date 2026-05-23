import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { ParkBase } from "./schema.js";

const INPUT = "data/processed/parks.base.json";
const CACHE = "data/processed/geocode_cache.json";
const FAILURES = "data/processed/geocode_failures.json";

const GSI_ENDPOINT = "https://msearch.gsi.go.jp/address-search/AddressSearch";
const CONCURRENCY = 5;
const SAVE_EVERY = 100;

interface GeocodeResult {
  lat: number;
  lng: number;
  matchedAddress: string;
  strategy: "full" | "stripped";
}

type Cache = Record<string, GeocodeResult>;
type Failures = Record<string, { name: string; address: string; reason: string }>;

const loadJson = <T>(path: string, fallback: T): T => {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf-8")) as T;
};

const saveJson = (path: string, data: unknown) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Strip trailing 番地 like "1-2-3" or "1丁目2-3" — last hyphen-number sequence
const stripBanchi = (addr: string): string =>
  addr.replace(/[\d０-９]+[-‐－―ー‒][\d０-９\-‐－―ー‒]+$/, "").trim();

interface GsiHit {
  geometry: { coordinates: [number, number] };
  properties: { title: string };
}

const geocodeQuery = async (query: string): Promise<GsiHit | null> => {
  const url = `${GSI_ENDPOINT}?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "kanagawa-park-viewer/0.1 (personal project)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const hits: GsiHit[] = await res.json();
  return hits[0] ?? null;
};

const geocodeOne = async (
  address: string,
): Promise<GeocodeResult | { error: string }> => {
  try {
    let hit = await geocodeQuery(address);
    if (hit) {
      return {
        lat: hit.geometry.coordinates[1],
        lng: hit.geometry.coordinates[0],
        matchedAddress: hit.properties.title,
        strategy: "full",
      };
    }
    const stripped = stripBanchi(address);
    if (stripped !== address && stripped.length > 0) {
      await sleep(100);
      hit = await geocodeQuery(stripped);
      if (hit) {
        return {
          lat: hit.geometry.coordinates[1],
          lng: hit.geometry.coordinates[0],
          matchedAddress: hit.properties.title,
          strategy: "stripped",
        };
      }
    }
    return { error: "no match" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
};

const main = async () => {
  const parks = JSON.parse(readFileSync(INPUT, "utf-8")) as ParkBase[];
  const cache: Cache = loadJson(CACHE, {});
  const failures: Failures = loadJson(FAILURES, {});

  const todo = parks.filter((p) => !cache[p.id] && !failures[p.id]);
  console.log(
    `Total ${parks.length} parks. Cached ${Object.keys(cache).length}, failed ${Object.keys(failures).length}, todo ${todo.length}.`,
  );

  if (todo.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  let done = 0;
  let okCount = 0;
  let failCount = 0;
  const startedAt = Date.now();

  const persist = () => {
    saveJson(CACHE, cache);
    saveJson(FAILURES, failures);
  };

  // Worker pool
  let index = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = index++;
      if (i >= todo.length) return;
      const park = todo[i];
      const result = await geocodeOne(park.address);
      if ("error" in result) {
        failures[park.id] = {
          name: park.name,
          address: park.address,
          reason: result.error,
        };
        failCount++;
      } else {
        cache[park.id] = result;
        okCount++;
      }
      done++;
      if (done % SAVE_EVERY === 0) {
        persist();
        const elapsed = (Date.now() - startedAt) / 1000;
        const rate = done / elapsed;
        const eta = (todo.length - done) / rate;
        console.log(
          `  ${done}/${todo.length} (ok=${okCount} fail=${failCount}) ${rate.toFixed(1)}/s ETA ${Math.round(eta)}s`,
        );
      }
      await sleep(50); // per-worker politeness
    }
  });

  await Promise.all(workers);
  persist();
  const elapsed = (Date.now() - startedAt) / 1000;
  console.log(
    `\nDone. ${done} processed in ${elapsed.toFixed(0)}s (ok=${okCount} fail=${failCount}).`,
  );
  console.log(`Cache: ${CACHE}`);
  console.log(`Failures: ${FAILURES}`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
