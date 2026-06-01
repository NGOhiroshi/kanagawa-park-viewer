import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAppStore } from "../../../application/store";
import { useLocale } from "../../../i18n/useLocale";
import { haversineDistance } from "../../../domain/geo/haversine";
import type { Park } from "../../../domain/park/Park";
import styles from "./ParkMap.module.css";

const GSI_TILE_URL = "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png";
const GSI_ATTRIBUTION = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>';

const DEFAULT_CENTER: [number, number] = [139.6425, 35.4476]; // 神奈川県庁
const DEFAULT_ZOOM = 10;

function makeParkGeoJSON(parks: Park[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: parks
      .filter((p) => p.lat !== null && p.lng !== null)
      .map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng!, p.lat!] },
        properties: { id: p.id, name: p.name },
      })),
  };
}

function createLocationMarkerEl(): HTMLElement {
  const el = document.createElement("div");
  el.setAttribute("aria-label", "現在地");
  el.style.cssText =
    "display:flex;flex-direction:column;align-items:center;gap:4px;user-select:none;";

  const badge = document.createElement("div");
  badge.textContent = "🧍";
  badge.style.cssText =
    "width:52px;height:52px;display:flex;align-items:center;justify-content:center;" +
    "background:#1d4ed8;border:3px solid #ffffff;border-radius:50%;font-size:28px;" +
    "box-shadow:0 0 0 5px rgba(29,78,216,0.30),0 3px 14px rgba(0,0,0,0.45);";

  const label = document.createElement("span");
  label.textContent = "現在地";
  label.style.cssText =
    "background:#1d4ed8;color:#ffffff;font-size:11px;font-weight:700;" +
    "padding:2px 7px;border-radius:4px;white-space:nowrap;" +
    "box-shadow:0 1px 5px rgba(0,0,0,0.35);";

  el.append(label, badge);
  return el;
}

export function ParkMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const hasFlownToUserRef = useRef(false);
  const locationMarkerRef = useRef<maplibregl.Marker | null>(null); // 常時表示
  const starMarkerRef = useRef<maplibregl.Marker | null>(null);     // フォーカス時のみ

  const { filteredParks, allParks, userLocation, focusedParkId, selectPark } = useAppStore();
  const { t } = useLocale();

  // マップ初期化（マウント時のみ）
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          gsi: {
            type: "raster",
            tiles: [GSI_TILE_URL],
            tileSize: 256,
            attribution: GSI_ATTRIBUTION,
            maxzoom: 18,
          },
        },
        layers: [{ id: "gsi-tiles", type: "raster", source: "gsi" }],
      },
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      const { filteredParks: currentParks } = useAppStore.getState();

      map.addSource("parks", {
        type: "geojson",
        data: makeParkGeoJSON(currentParks),
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 48,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "parks",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step", ["get", "point_count"],
            "#86efac", 10, "#22c55e", 50, "#16a34a",
          ],
          "circle-radius": ["step", ["get", "point_count"], 22, 10, 30, 50, 38],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "parks",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#ffffff" },
      });

      map.addLayer({
        id: "unclustered-park",
        type: "circle",
        source: "parks",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#22c55e",
          "circle-radius": 14,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.on("click", "clusters", async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id as number | undefined;
        if (clusterId == null) return;
        const source = map.getSource("parks") as maplibregl.GeoJSONSource;
        const center = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({ center, zoom });
      });

      map.on("click", "unclustered-park", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const id = feature.properties?.id as string | undefined;
        if (id) selectPark(id);
      });

      map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", "unclustered-park", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "unclustered-park", () => { map.getCanvas().style.cursor = ""; });
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [selectPark]);

  // filteredParks が変わったらソースを更新
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    const source = map.getSource("parks") as maplibregl.GeoJSONSource | undefined;
    if (!source) return;
    source.setData(makeParkGeoJSON(filteredParks));
  }, [filteredParks]);

  // 現在地が取れたら地図を移動（初回のみ）
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation || hasFlownToUserRef.current) return;
    hasFlownToUserRef.current = true;
    map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 13 });
  }, [userLocation]);

  // 現在地マーカー（常時表示 — 許可が取れた瞬間から表示）
  useEffect(() => {
    const map = mapRef.current;

    if (!map || !userLocation) {
      locationMarkerRef.current?.remove();
      locationMarkerRef.current = null;
      return;
    }

    if (locationMarkerRef.current) {
      locationMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      return;
    }

    // GPS が連続更新されると map.once("load", ...) が複数登録されて
    // ロード時に2個生成されるバグを防ぐ: addMarker 内でも二重生成をガード
    const addMarker = () => {
      if (locationMarkerRef.current) return;
      locationMarkerRef.current = new maplibregl.Marker({
        element: createLocationMarkerEl(),
        anchor: "bottom",
      })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map);
    };

    if (map.isStyleLoaded()) {
      addMarker();
    } else {
      map.once("load", addMarker);
      // effect 再実行時に未発火の listener を確実に除去
      return () => { map.off("load", addMarker); };
    }
  }, [userLocation]);

  // フォーカスマーカー（星のみ）
  // userLocation を deps に含めないことでフォーカス後のマップ操作をブロックしない
  useEffect(() => {
    const map = mapRef.current;

    starMarkerRef.current?.remove();
    starMarkerRef.current = null;

    if (!map || !focusedParkId) return;

    const park = allParks.find((p) => p.id === focusedParkId);
    if (park?.lat == null || park?.lng == null) return;

    // 星マーカー
    const starEl = document.createElement("div");
    starEl.setAttribute("aria-label", park.name);
    starEl.style.cssText =
      "display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;user-select:none;";

    const starEmoji = document.createElement("div");
    starEmoji.textContent = "⭐";
    starEmoji.style.cssText =
      "width:52px;height:52px;display:flex;align-items:center;justify-content:center;" +
      "background:#15803d;border:3px solid #ffffff;border-radius:50%;font-size:28px;" +
      "box-shadow:0 0 0 5px rgba(21,128,61,0.30),0 3px 14px rgba(0,0,0,0.45);";

    const starLabel = document.createElement("span");
    starLabel.textContent = park.name;
    starLabel.style.cssText =
      "background:#15803d;color:#ffffff;font-size:11px;font-weight:700;" +
      "padding:2px 7px;border-radius:4px;white-space:nowrap;max-width:180px;" +
      "overflow:hidden;text-overflow:ellipsis;box-shadow:0 1px 5px rgba(0,0,0,0.35);";

    starEl.append(starLabel, starEmoji);
    starEl.addEventListener("click", () => selectPark(focusedParkId));
    starMarkerRef.current = new maplibregl.Marker({ element: starEl, anchor: "bottom" })
      .setLngLat([park.lng, park.lat])
      .addTo(map);

    // fitBounds は focusedParkId 変化時に1度だけ実行
    // userLocation を getState() で読むことで deps に含めず、マップ操作を妨げない
    const { userLocation: currentLoc } = useAppStore.getState();
    if (currentLoc) {
      const distM = haversineDistance(
        { lat: park.lat, lng: park.lng },
        { lat: currentLoc.lat, lng: currentLoc.lng },
      );
      if (distM < 300) {
        map.flyTo({ center: [park.lng, park.lat], zoom: 16 });
      } else {
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([park.lng, park.lat]);
        bounds.extend([currentLoc.lng, currentLoc.lat]);
        map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
      }
    } else {
      map.flyTo({ center: [park.lng, park.lat], zoom: 16 });
    }
  }, [focusedParkId, allParks, selectPark]); // userLocation を含めない

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      role="img"
      aria-label={t.map.ariaLabel(filteredParks.length)}
    />
  );
}
