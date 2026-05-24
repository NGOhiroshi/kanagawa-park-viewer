import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useAppStore } from "../../../application/store";
import styles from "./ParkMap.module.css";

const GSI_TILE_URL = "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png";
const GSI_ATTRIBUTION = '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>';

// 神奈川中心
const DEFAULT_CENTER: [number, number] = [139.45, 35.54];
const DEFAULT_ZOOM = 10;

export function ParkMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const { filteredParks, userLocation, selectPark } = useAppStore();

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

    // ナビゲーションコントロール（アクセシビリティ: キーボードでズーム可）
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    // 現在地ボタン
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showAccuracyCircle: false,
      }),
      "top-right",
    );

    map.on("load", () => {
      // 公園ソース（クラスタリング有効）
      map.addSource("parks", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 48,
      });

      // クラスター円
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "parks",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step", ["get", "point_count"],
            "#86efac",  // 〜10件: 薄いグリーン
            10, "#22c55e",  // 〜50件: プライマリグリーン
            50, "#16a34a",  // 50件〜: 濃いグリーン
          ],
          "circle-radius": [
            "step", ["get", "point_count"],
            20, 10, 28, 50, 36,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // クラスター件数ラベル
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

      // 個別公園マーカー
      map.addLayer({
        id: "unclustered-park",
        type: "circle",
        source: "parks",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#22c55e",
          "circle-radius": 8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // クラスタークリック → ズームイン
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0]?.properties?.cluster_id as number | undefined;
        if (clusterId == null) return;
        const source = map.getSource("parks") as maplibregl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          const center = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          map.easeTo({ center, zoom });
        });
      });

      // 個別マーカークリック → 公園選択
      map.on("click", "unclustered-park", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const id = feature.properties?.id as string | undefined;
        if (id) selectPark(id);
      });

      // カーソル変更（UXフィードバック）
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
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource("parks") as maplibregl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: filteredParks
        .filter((p) => p.lat !== null && p.lng !== null)
        .map((p) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [p.lng!, p.lat!],
          },
          properties: { id: p.id, name: p.name },
        })),
    });
  }, [filteredParks]);

  // 現在地が取れたら地図を移動
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation) return;
    map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 13 });
  }, [userLocation]);

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      // スクリーンリーダー向け: マップは alt テキストで補完
      role="img"
      aria-label={`神奈川県の公園マップ。${filteredParks.length}件を表示中。`}
    />
  );
}
