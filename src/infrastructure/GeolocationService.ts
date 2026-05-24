import type { Coordinates } from "../domain/geo/haversine";

export type GeolocationError =
  | { type: "permission_denied" }
  | { type: "unavailable" }
  | { type: "timeout" }
  | { type: "not_supported" };

export function watchUserLocation(
  onSuccess: (coords: Coordinates) => void,
  onError: (error: GeolocationError) => void,
): () => void {
  if (!navigator.geolocation) {
    onError({ type: "not_supported" });
    return () => {};
  }

  const id = navigator.geolocation.watchPosition(
    (pos) => onSuccess({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
    (err) => {
      if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
        onError({ type: "permission_denied" });
      } else if (err.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
        onError({ type: "unavailable" });
      } else {
        onError({ type: "timeout" });
      }
    },
    { enableHighAccuracy: true, timeout: 10_000 },
  );

  return () => navigator.geolocation.clearWatch(id);
}
