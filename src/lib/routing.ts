// Real routing via public OSRM + Overpass APIs.
// We render in our own SVG so the visual stays on-brand.

export type LngLat = [number, number];

export type RouteResult = {
  coords: LngLat[]; // raw lng/lat polyline
  distance: number; // meters
  duration: number; // seconds
};

export type BBox = { minLng: number; maxLng: number; minLat: number; maxLat: number };

export type StreetWay = {
  id: number;
  coords: LngLat[];
  kind: "primary" | "secondary" | "residential" | "footway" | "service";
};

export type AreaFeature = {
  id: number;
  coords: LngLat[];
  kind: "park" | "water" | "building";
};

const OSRM = "https://router.project-osrm.org";
const OVERPASS = "https://overpass-api.de/api/interpreter";

export async function fetchRoute(start: LngLat, end: LngLat): Promise<RouteResult> {
  const url = `${OSRM}/route/v1/foot/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar rota");
  const data = await res.json();
  const route = data.routes?.[0];
  if (!route) throw new Error("Nenhuma rota encontrada");
  return {
    coords: route.geometry.coordinates as LngLat[],
    distance: route.distance,
    duration: route.duration,
  };
}

// Mercator-ish projection that preserves aspect ratio so streets look natural,
// not stretched/skewed. Returns SVG coordinates inside a viewBox of width=size.
export function makeProjector(bbox: BBox, size = 1000) {
  const midLat = (bbox.minLat + bbox.maxLat) / 2;
  const cos = Math.cos((midLat * Math.PI) / 180);
  const lngSpan = (bbox.maxLng - bbox.minLng) * cos;
  const latSpan = bbox.maxLat - bbox.minLat;
  const span = Math.max(lngSpan, latSpan);
  // Center the smaller dimension
  const offsetX = (size - (lngSpan / span) * size) / 2;
  const offsetY = (size - (latSpan / span) * size) / 2;
  const height = size;
  return {
    height,
    project([lng, lat]: LngLat) {
      const x = offsetX + ((lng - bbox.minLng) * cos) / span * size;
      const y = offsetY + (1 - (lat - bbox.minLat) / span) * size;
      return { x, y };
    },
  };
}

export function bboxFromCoords(coords: LngLat[], padFactor = 0.18): BBox {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const padLng = Math.max((maxLng - minLng) * padFactor, 0.0015);
  const padLat = Math.max((maxLat - minLat) * padFactor, 0.0015);
  return {
    minLng: minLng - padLng,
    maxLng: maxLng + padLng,
    minLat: minLat - padLat,
    maxLat: maxLat + padLat,
  };
}

// Fetch streets + areas around the bbox via Overpass so the map shows real
// surrounding context, not invented decorative curves.
export async function fetchMapContext(bbox: BBox): Promise<{ streets: StreetWay[]; areas: AreaFeature[] }> {
  const bboxStr = `${bbox.minLat},${bbox.minLng},${bbox.maxLat},${bbox.maxLng}`;
  const query = `[out:json][timeout:15];
(
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|living_street|pedestrian|footway|path|service)$"](${bboxStr});
  way["leisure"="park"](${bboxStr});
  way["landuse"~"^(grass|recreation_ground|forest)$"](${bboxStr});
  way["natural"="water"](${bboxStr});
  way["waterway"="riverbank"](${bboxStr});
);
out geom;`;
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query),
  });
  if (!res.ok) throw new Error("Falha ao buscar contexto do mapa");
  const data = await res.json();
  const streets: StreetWay[] = [];
  const areas: AreaFeature[] = [];
  for (const el of data.elements ?? []) {
    if (el.type !== "way" || !el.geometry) continue;
    const coords: LngLat[] = el.geometry.map((g: { lat: number; lon: number }) => [g.lon, g.lat]);
    const tags = el.tags ?? {};
    if (tags.highway) {
      const h = tags.highway;
      let kind: StreetWay["kind"] = "residential";
      if (h === "motorway" || h === "trunk" || h === "primary") kind = "primary";
      else if (h === "secondary" || h === "tertiary") kind = "secondary";
      else if (h === "footway" || h === "path" || h === "pedestrian") kind = "footway";
      else if (h === "service") kind = "service";
      streets.push({ id: el.id, coords, kind });
    } else if (tags.leisure === "park" || tags.landuse) {
      areas.push({ id: el.id, coords, kind: "park" });
    } else if (tags.natural === "water" || tags.waterway === "riverbank") {
      areas.push({ id: el.id, coords, kind: "water" });
    }
  }
  return { streets, areas };
}

// Simple geocoding via Nominatim
export async function geocode(query: string): Promise<{ name: string; coord: LngLat } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "pt-BR" } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.length) return null;
  return {
    name: data[0].display_name,
    coord: [parseFloat(data[0].lon), parseFloat(data[0].lat)],
  };
}
