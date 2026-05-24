export interface Coordinates {
  lat: number;
  lng: number;
}

export const KANAGAWA_PREFECTURAL_OFFICE: Coordinates = { lat: 35.4476, lng: 139.6425 };

const EARTH_RADIUS_M = 6_371_000;

/** 2点間の直線距離をメートルで返す（ハバーサイン公式）。 */
export function haversineDistance(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const chord =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
}

/** 距離順ソート（座標なし公園は末尾）。元の配列を変更しない。 */
export function sortByDistance<T extends { lat: number | null; lng: number | null }>(
  items: T[],
  origin: Coordinates,
): T[] {
  const withCoords = items.filter(
    (item): item is T & { lat: number; lng: number } =>
      item.lat !== null && item.lng !== null,
  );
  const noCoords = items.filter((item) => item.lat === null || item.lng === null);

  return [
    ...withCoords.sort(
      (a, b) =>
        haversineDistance(origin, { lat: a.lat, lng: a.lng }) -
        haversineDistance(origin, { lat: b.lat, lng: b.lng }),
    ),
    ...noCoords,
  ];
}

/** メートルを人間が読みやすい文字列に変換（例: "1.2km", "350m"）。 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
}
