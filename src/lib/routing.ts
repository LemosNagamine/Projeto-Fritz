// Real routing via public OSRM + Overpass APIs.
// We render in our own SVG so the visual stays on-brand.

export type LngLat = [number, number];

export type RouteResult = {
  coords: LngLat[]; // raw lng/lat polyline
  distance: number; // meters
  duration: number; // seconds
};

const OSRM = "https://router.project-osrm.org";

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

// Project lng/lat into SVG 0..1000 coords given a bounding box.
export function project(coord: LngLat, bbox: { minLng: number; maxLng: number; minLat: number; maxLat: number }, size = 1000) {
  const x = ((coord[0] - bbox.minLng) / (bbox.maxLng - bbox.minLng)) * size;
  // Invert Y because SVG grows downward
  const y = (1 - (coord[1] - bbox.minLat) / (bbox.maxLat - bbox.minLat)) * size;
  return { x, y };
}

export function bboxFromCoords(coords: LngLat[], pad = 0.0008) {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return {
    minLng: Math.min(...lngs) - pad,
    maxLng: Math.max(...lngs) + pad,
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
  };
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
