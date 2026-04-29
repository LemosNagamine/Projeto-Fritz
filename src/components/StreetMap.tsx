import { useEffect, useMemo, useState } from "react";
import { fetchRoute, bboxFromCoords, project, type LngLat, type RouteResult } from "@/lib/routing";
import { safetyStore, type DangerZone } from "@/lib/safety-store";
import { Loader2, MapPin, Navigation } from "lucide-react";

type Props = {
  start: LngLat | null;
  end: LngLat | null;
  onRouteReady?: (r: RouteResult) => void;
  progress?: number; // 0..1, position along route (for the moving dot)
  alert?: boolean;
};

// Hand-drawn decorative streets that frame the real route, so the map
// looks rich even before/while OSRM responds.
const decorStreets = [
  "M 0 200 Q 250 220 500 180 T 1000 220",
  "M 0 420 Q 300 380 600 440 T 1000 400",
  "M 0 640 Q 200 680 500 620 T 1000 660",
  "M 0 860 Q 350 820 700 880 T 1000 840",
  "M 200 0 Q 240 250 180 500 T 220 1000",
  "M 480 0 Q 520 300 460 600 T 500 1000",
  "M 760 0 Q 800 280 740 540 T 780 1000",
];

export function StreetMap({ start, end, onRouteReady, progress = 0, alert = false }: Props) {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const zones = safetyStore.getState().zones;

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

  const projected = useMemo(() => {
    if (!route) return null;
    const bbox = bboxFromCoords(route.coords);
    const pts = route.coords.map((c) => project(c, bbox));
    return { pts, bbox };
  }, [route]);

  // Position of the moving dot along the path
  const movingPoint = useMemo(() => {
    if (!projected) return null;
    const { pts } = projected;
    if (pts.length < 2) return pts[0];
    const idx = Math.min(pts.length - 1, Math.floor(progress * (pts.length - 1)));
    return pts[idx];
  }, [projected, progress]);

  const pathD = useMemo(() => {
    if (!projected) return "";
    return projected.pts.reduce((acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
  }, [projected]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-3xl border border-border/60 ${alert ? "ring-4 ring-danger/40" : ""}`}>
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="40%">
            <stop offset="0%" stopColor="oklch(0.98 0.02 30)" />
            <stop offset="100%" stopColor="oklch(0.93 0.04 15)" />
          </radialGradient>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.22 5)" />
            <stop offset="100%" stopColor="oklch(0.55 0.24 350)" />
          </linearGradient>
          <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="oklch(0.7 0.05 10 / 0.25)" />
          </pattern>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1000" height="1000" fill="url(#mapBg)" />
        <rect width="1000" height="1000" fill="url(#dots)" />

        {/* Decorative parks */}
        <ellipse cx="150" cy="500" rx="110" ry="80" fill="var(--map-park)" opacity="0.55" />
        <ellipse cx="850" cy="700" rx="130" ry="95" fill="var(--map-park)" opacity="0.55" />
        <ellipse cx="600" cy="200" rx="80" ry="60" fill="var(--map-park)" opacity="0.45" />

        {/* Decorative streets (rendered always for richness) */}
        {decorStreets.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="oklch(0.88 0.02 15)" strokeWidth="22" fill="none" strokeLinecap="round" />
            <path d={d} stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d={d} stroke="oklch(0.92 0.03 20)" strokeWidth="0.6" strokeDasharray="6 8" fill="none" />
          </g>
        ))}

        {/* Danger / caution zones */}
        {zones.map((z) => (
          <ZoneMarker key={z.id} zone={z} />
        ))}

        {/* Route */}
        {pathD && (
          <>
            <path d={pathD} stroke="oklch(0.55 0.2 5 / 0.18)" strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={pathD}
              stroke="url(#routeGrad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              style={{
                strokeDasharray: 4000,
                strokeDashoffset: 4000,
                animation: "draw-route 2.2s var(--ease-soft) forwards",
              }}
            />
            <path d={pathD} stroke="white" strokeWidth="2" strokeDasharray="4 8" fill="none" opacity="0.7" />
          </>
        )}

        {/* Start + End markers */}
        {projected && (
          <>
            <Marker x={projected.pts[0].x} y={projected.pts[0].y} color="oklch(0.7 0.12 160)" label="Início" />
            <Marker x={projected.pts.at(-1)!.x} y={projected.pts.at(-1)!.y} color="oklch(0.6 0.22 5)" label="Destino" />
          </>
        )}

        {/* Moving user dot */}
        {movingPoint && (
          <g>
            <circle cx={movingPoint.x} cy={movingPoint.y} r="22" fill="oklch(0.62 0.18 5 / 0.25)" className="animate-pulse-ring" style={{ transformOrigin: `${movingPoint.x}px ${movingPoint.y}px` } as React.CSSProperties} />
            <circle cx={movingPoint.x} cy={movingPoint.y} r="14" fill="white" stroke="oklch(0.62 0.18 5)" strokeWidth="3" />
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

function ZoneMarker({ zone }: { zone: DangerZone }) {
  const color = zone.level === "danger" ? "oklch(0.6 0.22 25)" : "oklch(0.78 0.16 70)";
  return (
    <g>
      <circle cx={zone.x} cy={zone.y} r={zone.radius} fill={color} opacity="0.12" />
      <circle cx={zone.x} cy={zone.y} r={zone.radius * 0.6} fill={color} opacity="0.18" />
      <circle cx={zone.x} cy={zone.y} r="10" fill={color} />
      <circle cx={zone.x} cy={zone.y} r="4" fill="white" />
    </g>
  );
}

function Marker({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="18" fill="white" stroke={color} strokeWidth="4" />
      <circle cx={x} cy={y} r="7" fill={color} />
      <text x={x} y={y - 28} textAnchor="middle" fontSize="18" fontWeight="600" fill="oklch(0.32 0.08 350)" style={{ paintOrder: "stroke", stroke: "white", strokeWidth: 4 }}>
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
