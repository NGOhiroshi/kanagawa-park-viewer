import type { Park, FacilityKey } from "../domain/park/Park";
import type { ParkRepository } from "../domain/park/ParkRepository";

// parks.json のタプル形式に対応した型
type ParkTuple = [
  string,        // id
  string,        // name
  string,        // address
  number | null, // lat
  number | null, // lng
  number,        // facilities bitmask
  string,        // parkType
  number | null, // openedYear
  number | null, // areaSqm
  string,        // hours
  string,        // closedDays
  string,        // url
  string,        // notes
  string,        // updatedAt
];

interface ParksJson {
  version: number;
  generatedAt: string;
  facilityKeys: FacilityKey[];
  fieldOrder: string[];
  parks: ParkTuple[];
}

function unpackFacilities(
  mask: number,
  keys: FacilityKey[],
): Record<FacilityKey, boolean> {
  const result = {} as Record<FacilityKey, boolean>;
  keys.forEach((key, i) => {
    result[key] = Boolean(mask & (1 << i));
  });
  return result;
}

function tupleToPark(tuple: ParkTuple, facilityKeys: FacilityKey[]): Park {
  const [id, name, address, lat, lng, facilitiesMask, parkType, openedYear, areaSqm, hours, closedDays, url, notes, updatedAt] = tuple;
  return {
    id,
    name,
    address,
    lat,
    lng,
    facilities: unpackFacilities(facilitiesMask, facilityKeys),
    parkType,
    openedYear,
    areaSqm,
    hours,
    closedDays,
    url,
    notes,
    updatedAt,
  };
}

export class JsonParkRepository implements ParkRepository {
  private cache: Park[] | null = null;

  async getAll(): Promise<Park[]> {
    if (this.cache) return this.cache;

    const res = await fetch("/parks.json");
    if (!res.ok) throw new Error(`parks.json の取得に失敗: ${res.status}`);

    const data: ParksJson = await res.json();
    this.cache = data.parks.map((tuple) => tupleToPark(tuple, data.facilityKeys));
    return this.cache;
  }
}

export const parkRepository = new JsonParkRepository();
