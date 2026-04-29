import { useEffect, useMemo, useState } from "react";
import {
  fetchRoute,
  fetchMapContext,
  bboxFromCoords,
  makeProjector,
  type LngLat,
  type RouteResult,
  type StreetWay,
  type AreaFeature,
  type BBox,
} from "@/lib/routing";
import { safetyStore, type DangerZone } from "@/lib/safety-store";
import { Loader2, MapPin, Navigation } from "lucide-react";

type Props = {
  start: LngLat | null;
  end: LngLat | null;
  onRouteReady?: (r: RouteResult) => void;
  progress?: number; // 0..1, position along route (for the moving dot)
  alert?: boolean;
};

const STREET_STYLE: Record<StreetWay["kind"], { casing: number; fill: number; color: string }> = {
  primary: { casing: 14, fill: 10, color: "#fff5d6" },
  secondary: { casing: 11, fill: 8, color: "#ffffff" },
  residential: { casing: 8, fill: 6, color: "#ffffff" },
  service: { casing: 5, fill: 3.5, color: "#ffffff" },
  footway: { casing: 3, fill: 2, color: "#f4d8c0" },
};

export function StreetMap({ start, end, onRouteReady, progress = 0, alert = false }: Props) {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [context, setContext] = useState<{ streets: StreetWay[]; areas: AreaFeature[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const zones = safetyStore.getState().zones;

  useEffect(() => {
    if (!start || !end) {
      setRoute(null);
      setContext(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRoute(start, end)
      .then(async (r) => {
        if (cancelled) return;
        setRoute(r);
        onRouteReady?.(r);
        const bbox = bboxFromCoords(r.coords);
        try {
          const ctx = await fetchMapContext(bbox);
          if (!cancelled) setContext(ctx);
        } catch {
          // context is optional; route still renders
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [start?.[0], start?.[1], end?.[0], end?.[1]]);

  const projector = useMemo(() => {
    if (!route) return null;
    const bbox = bboxFromCoords(route.coords);
    return { ...makeProjector(bbox, 1000), bbox };
  }, [route]);

  const projectedRoute = useMemo(() => {
    if (!projector || !route) return null;
    return route.coords.map((c) => projector.project(c));
  }, [projector, route]);

  const movingPoint = useMemo(() => {
    if (!projectedRoute || projectedRoute.length === 0) return null;
    if (projectedRoute.length < 2) return projectedRoute[0];
    const idx = Math.min(projectedRoute.length - 1, Math.floor(progress * (projectedRoute.length - 1)));
    return projectedRoute[idx];
  }, [projectedRoute, progress]);

  const pathD = useMemo(() => {
    if (!projectedRoute) return "";
    return projectedRoute.reduce(
      (acc, p, i) => acc + (i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
      "",
    );
  }, [projectedRoute]);

  const projectedStreets = useMemo(() => {
    if (!projector || !context) return [];
    return context.streets.map((s) => ({
      id: s.id,
      kind: s.kind,
      d: pointsToPath(s.coords.map((c) => projector.project(c))),
    }));
  }, [projector, context]);

  const projectedAreas = useMemo(() => {
    if (!projector || !context) return [];
    return context.areas.map((a) => ({
      id: a.id,
      kind: a.kind,
      d: pointsToClosedPath(a.coords.map((c) => projector.project(c))),
    }));
  }, [projector, context]);

  const zoneViewBoxScale = 1; // zones are mock points already in 0..1000

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-3xl border border-border/60 ${alert ? "ring-4 ring-danger/40" : ""}`}>
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdf6ee" />
            <stop offset="100%" stopColor="#f7e9dc" />
          </linearGradient>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.22 5)" />
            <stop offset="100%" stopColor="oklch(0.55 0.24 350)" />
          </linearGradient>
          <filter id="routeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1000" height="1000" fill="url(#mapBg)" />

        {/* Real parks / water */}
        {projectedAreas.map((a) => (
          <path
            key={a.id}
            d={a.d}
            fill={a.kind === "water" ? "#cfe6f0" : "#dfe9c8"}
            opacity={a.kind === "water" ? 0.85 : 0.7}
          />
        ))}

        {/* Real streets — casing first, then fill, ordered by hierarchy */}
        {(["service", "footway", "residential", "secondary", "primary"] as const).map((kind) => (
          <g key={`casing-${kind}`}>
            {projectedStreets
              .filter((s) => s.kind === kind)
              .map((s) => (
                <path
                  key={s.id}
                  d={s.d}
                  stroke="#e8c9b0"
                  strokeWidth={STREET_STYLE[kind].casing}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
          </g>
        ))}
        {(["service", "footway", "residential", "secondary", "primary"] as const).map((kind) => (
          <g key={`fill-${kind}`}>
            {projectedStreets
              .filter((s) => s.kind === kind)
              .map((s) => (
                <path
                  key={s.id}
                  d={s.d}
                  stroke={STREET_STYLE[kind].color}
                  strokeWidth={STREET_STYLE[kind].fill}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={kind === "footway" ? "4 4" : undefined}
                />
              ))}
          </g>
        ))}

        {/* Danger / caution zones (mock, in 0..1000 space) */}
        {zones.map((z) => (
          <ZoneMarker key={z.id} zone={z} scale={zoneViewBoxScale} />
        ))}

        {/* Route */}
        {pathD && (
          <>
            <path d={pathD} stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <path
              d={pathD}
              stroke="url(#routeGrad)"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#routeGlow)"
              style={{
                strokeDasharray: 4000,
                strokeDashoffset: 4000,
                animation: "draw-route 2.2s var(--ease-soft) forwards",
              }}
            />
          </>
        )}

        {/* Start + End markers */}
        {projectedRoute && projectedRoute.length > 0 && (
          <>
            <Marker x={projectedRoute[0].x} y={projectedRoute[0].y} color="oklch(0.7 0.12 160)" label="Início" />
            <Marker x={projectedRoute.at(-1)!.x} y={projectedRoute.at(-1)!.y} color="oklch(0.6 0.22 5)" label="Destino" />
          </>
        )}

        {/* Moving user dot */}
        {movingPoint && (
          <g>
            <circle cx={movingPoint.x} cy={movingPoint.y} r="22" fill="oklch(0.62 0.18 5 / 0.25)" className="animate-pulse-ring" />
            <circle cx={movingPoint.x} cy={movingPoint.y} r="13" fill="white" stroke="oklch(0.62 0.18 5)" strokeWidth="3" />
            <circle cx={movingPoint.x} cy={movingPoint.y} r="6" fill="oklch(0.62 0.18 5)" />
          </g>
        )}
      </svg>

      {/* Loading / error overlays */}
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-card/95 backdrop-blur px-4 py-2 text-xs font-medium shadow-card">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          Calculando a melhor rota…
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-destructive/10 text-destructive px-4 py-2 text-xs font-medium">
          {error}
        </div>
      )}
      {!start || !end ? (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="rounded-2xl bg-card/90 backdrop-blur px-6 py-4 text-center shadow-card max-w-xs">
            <Navigation className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Defina origem e destino</p>
            <p className="text-xs text-muted-foreground mt-1">Calcularemos a rota mais segura para você</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function pointsToPath(pts: { x: number; y: number }[]) {
  if (!pts.length) return "";
  return pts.reduce(
    (acc, p, i) => acc + (i === 0 ? `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}` : ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
    "",
  );
}

function pointsToClosedPath(pts: { x: number; y: number }[]) {
  return pointsToPath(pts) + " Z";
}

function ZoneMarker({ zone, scale }: { zone: DangerZone; scale: number }) {
  const color = zone.level === "danger" ? "oklch(0.6 0.22 25)" : "oklch(0.78 0.16 70)";
  return (
    <g>
      <circle cx={zone.x * scale} cy={zone.y * scale} r={zone.radius} fill={color} opacity="0.12" />
      <circle cx={zone.x * scale} cy={zone.y * scale} r={zone.radius * 0.6} fill={color} opacity="0.18" />
      <circle cx={zone.x * scale} cy={zone.y * scale} r="10" fill={color} />
      <circle cx={zone.x * scale} cy={zone.y * scale} r="4" fill="white" />
    </g>
  );
}

function Marker({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="16" fill="white" stroke={color} strokeWidth="4" />
      <circle cx={x} cy={y} r="6" fill={color} />
      <text x={x} y={y - 24} textAnchor="middle" fontSize="16" fontWeight="600" fill="oklch(0.32 0.08 350)" style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 4 } as React.CSSProperties}>
        {label}
      </text>
    </g>
  );
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