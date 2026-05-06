import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { fetchRoute, type LngLat, type RouteResult } from "@/lib/routing";
import { safetyStore } from "@/lib/safety-store";
import { Loader2, MapPin } from "lucide-react";

type Props = {
  start: LngLat | null;
  end: LngLat | null;
  onRouteReady?: (r: RouteResult) => void;
  progress?: number;
  alert?: boolean;
};

// CARTO Positron — light, minimalist basemap (used by mapcn).
// Matches our soft, on-brand aesthetic better than default OSM tiles.
const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const ROUTE_SOURCE = "acalanto-route";
const ROUTE_CASING = "acalanto-route-casing";
const ROUTE_LINE = "acalanto-route-line";

export function StreetMap({ start, end, onRouteReady, progress = 0, alert = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const startMarker = useRef<maplibregl.Marker | null>(null);
  const endMarker = useRef<maplibregl.Marker | null>(null);
  const moverMarker = useRef<maplibregl.Marker | null>(null);
  const zoneMarkers = useRef<maplibregl.Marker[]>([]);

  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [styleReady, setStyleReady] = useState(false);

  // Init map once
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    let frameId = 0;

    const ensureMap = () => {
      if (mapRef.current) return;
      const { width, height } = container.getBoundingClientRect();
      if (width < 40 || height < 40) {
        frameId = window.requestAnimationFrame(ensureMap);
        return;
      }

      const map = new maplibregl.Map({
        container,
        style: STYLE_URL,
        center: [-46.633, -23.55],
        zoom: 12,
        attributionControl: { compact: true },
        trackResize: true,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        setStyleReady(true);
        window.requestAnimationFrame(() => map.resize());
      });

      resizeObserverRef.current = new ResizeObserver(() => {
        window.requestAnimationFrame(() => map.resize());
      });
      resizeObserverRef.current.observe(container);
      mapRef.current = map;
    };

    ensureMap();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      setStyleReady(false);
    };
  }, []);

  // Fetch route when start/end change
  useEffect(() => {
    if (!start || !end) {
      setRoute(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRoute(start, end)
      .then((r) => {
        if (cancelled) return;
        setRoute(r);
        onRouteReady?.(r);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [start?.[0], start?.[1], end?.[0], end?.[1]]);

  // Render route + markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady) return;

    // Clear existing route layers/source
    if (map.getLayer(ROUTE_LINE)) map.removeLayer(ROUTE_LINE);
    if (map.getLayer(ROUTE_CASING)) map.removeLayer(ROUTE_CASING);
    if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);

    startMarker.current?.remove();
    endMarker.current?.remove();
    moverMarker.current?.remove();
    startMarker.current = null;
    endMarker.current = null;
    moverMarker.current = null;

    if (!route || route.coords.length < 2) return;

    map.addSource(ROUTE_SOURCE, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: route.coords },
      },
    });
    map.addLayer({
      id: ROUTE_CASING,
      type: "line",
      source: ROUTE_SOURCE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": "#ffffff", "line-width": 9, "line-opacity": 0.95 },
    });
    map.addLayer({
      id: ROUTE_LINE,
      type: "line",
      source: ROUTE_SOURCE,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": alert ? "#dc2a55" : "#e85d8a",
        "line-width": 5,
      },
    });

    startMarker.current = new maplibregl.Marker({ element: dotEl("#10b981", "Início") })
      .setLngLat(route.coords[0])
      .addTo(map);
    endMarker.current = new maplibregl.Marker({ element: dotEl("#e85d8a", "Destino") })
      .setLngLat(route.coords[route.coords.length - 1])
      .addTo(map);

    // Fit bounds
    const bounds = route.coords.reduce(
      (b, c) => b.extend(c as [number, number]),
      new maplibregl.LngLatBounds(route.coords[0] as [number, number], route.coords[0] as [number, number]),
    );
      map.fitBounds(bounds, { padding: 60, duration: 700 });
      window.requestAnimationFrame(() => map.resize());
  }, [route, styleReady, alert]);

  // Update moving point along route based on progress
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !route || route.coords.length < 2) return;
    const idx = Math.min(route.coords.length - 1, Math.floor(progress * (route.coords.length - 1)));
    const pos = route.coords[idx] as [number, number];
    if (!moverMarker.current) {
      moverMarker.current = new maplibregl.Marker({ element: pulseEl(alert) }).setLngLat(pos).addTo(map);
    } else {
      moverMarker.current.setLngLat(pos);
    }
  }, [progress, route, alert]);

  // Render danger/caution zones (mock, near São Paulo center)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady) return;
    zoneMarkers.current.forEach((m) => m.remove());
    zoneMarkers.current = [];

    const zones = safetyStore.getState().zones;
    // Map mock x/y (0..1000) to a small area around current view center.
    const center = map.getCenter();
    zones.forEach((z) => {
      const lng = center.lng + ((z.x - 500) / 500) * 0.04;
      const lat = center.lat - ((z.y - 500) / 500) * 0.03;
      const marker = new maplibregl.Marker({ element: zoneEl(z.level) })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setText(`${z.name} — ${z.reason}`))
        .addTo(map);
      zoneMarkers.current.push(marker);
    });
  }, [styleReady, route]);

  return (
    <div
      className={`acalanto-map relative w-full h-full min-h-[420px] overflow-hidden rounded-3xl border border-border/60 bg-card ${
        alert ? "ring-4 ring-danger/40" : ""
      }`}
    >
      <div ref={containerRef} className="absolute inset-0" />

      {(loading || (!route && !error)) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-background/40 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 shadow-soft border border-border/60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MapPin className="h-4 w-4 text-primary" />}
            <span className="text-xs font-medium text-foreground/80">
              {loading ? "Calculando a rota mais segura..." : "Informe origem e destino para ver a rota"}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-3 left-3 right-3 rounded-xl bg-destructive/95 text-destructive-foreground px-3 py-2 text-xs shadow-card">
          {error}
        </div>
      )}
    </div>
  );
}

function dotEl(color: string, label: string) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:4px;";
  wrap.innerHTML = `
    <span style="background:white;color:#3a1d2e;font:600 10px/1 'Plus Jakarta Sans',system-ui;padding:3px 8px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,.12);border:1px solid rgba(0,0,0,.06);white-space:nowrap;">${label}</span>
    <span style="display:block;width:18px;height:18px;border-radius:999px;background:white;border:4px solid ${color};box-shadow:0 2px 6px rgba(0,0,0,.18);"></span>
  `;
  return wrap;
}

function pulseEl(alert: boolean) {
  const c = alert ? "#dc2a55" : "#e85d8a";
  const el = document.createElement("div");
  el.style.cssText = `position:relative;width:22px;height:22px;`;
  el.innerHTML = `
    <span style="position:absolute;inset:0;border-radius:999px;background:${c};opacity:.25;animation:acal-pulse 1.6s ease-out infinite;"></span>
    <span style="position:absolute;inset:5px;border-radius:999px;background:${c};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25);"></span>
    <style>@keyframes acal-pulse{0%{transform:scale(.6);opacity:.45}100%{transform:scale(1.8);opacity:0}}</style>
  `;
  return el;
}

function zoneEl(level: "caution" | "danger") {
  const c = level === "danger" ? "#dc2a55" : "#f5a524";
  const el = document.createElement("div");
  el.style.cssText = `width:16px;height:16px;border-radius:999px;background:${c};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25);cursor:pointer;`;
  return el;
}

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-safe" /> Início</span>
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Destino</span>
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-warning" /> Cautela</span>
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-danger" /> Zona perigosa</span>
      <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Rota a pé</span>
    </div>
  );
}
