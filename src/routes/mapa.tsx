import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StreetMap, MapLegend } from "@/components/StreetMap";
import { AlertOverlay } from "@/components/AlertOverlay";
import { geocode, type LngLat, type RouteResult } from "@/lib/routing";
import { Search, Navigation, Shield, Clock, Loader2, MapPin } from "lucide-react";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa interativo — Acalanto" },
      { name: "description", content: "Calcule a rota mais segura e ative o modo proteção durante o trajeto." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originName, setOriginName] = useState("");
  const [destName, setDestName] = useState("");
  const [start, setStart] = useState<LngLat | null>(null);
  const [end, setEnd] = useState<LngLat | null>(null);
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertActive, setAlertActive] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSearching(true);
    try {
      const [a, b] = await Promise.all([geocode(origin), geocode(destination)]);
      if (!a || !b) throw new Error("Não encontramos um dos endereços. Tente algo mais específico.");
      setStart(a.coord); setEnd(b.coord);
      setOriginName(a.name.split(",").slice(0, 2).join(", "));
      setDestName(b.name.split(",").slice(0, 2).join(", "));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }

  function useExample() {
    setOrigin("Praça da Sé, São Paulo");
    setDestination("Estação da Luz, São Paulo");
  }

  const minutes = route ? Math.max(1, Math.round(route.duration / 60)) : 0;
  const km = route ? (route.distance / 1000).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 md:py-10">
      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-3xl bg-card border border-border/60 p-5 shadow-card">
            <h1 className="font-display text-2xl text-plum">Para onde vamos?</h1>
            <p className="text-sm text-muted-foreground mt-1">Calculamos a melhor rota e ativamos sua proteção.</p>

            <form onSubmit={handleSearch} className="mt-5 space-y-3">
              <Field icon={<div className="h-2.5 w-2.5 rounded-full bg-safe" />} label="Origem">
                <input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Onde você está?"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                  required
                />
              </Field>
              <Field icon={<div className="h-2.5 w-2.5 rounded-full bg-primary" />} label="Destino">
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Para onde vai?"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                  required
                />
              </Field>

              <button
                type="submit"
                disabled={searching}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-glow transition-shadow disabled:opacity-60"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {searching ? "Buscando rota..." : "Calcular rota segura"}
              </button>
              <button type="button" onClick={useExample} className="w-full text-xs text-primary hover:underline">
                Usar exemplo
              </button>
            </form>

            {error && <div className="mt-3 rounded-xl bg-destructive/10 text-destructive px-3 py-2 text-xs">{error}</div>}
          </div>

          {route && (
            <div className="rounded-3xl bg-gradient-warm p-5 animate-float-up">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Trajeto pronto</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Stat icon={Clock} label="Tempo" value={`${minutes} min`} />
                <Stat icon={Navigation} label="Distância" value={`${km} km`} />
              </div>
              <div className="mt-3 text-xs text-foreground/75 space-y-1">
                <p className="flex gap-1.5"><MapPin className="h-3 w-3 text-safe shrink-0 mt-0.5" /> {originName}</p>
                <p className="flex gap-1.5"><MapPin className="h-3 w-3 text-primary shrink-0 mt-0.5" /> {destName}</p>
              </div>

              <button
                onClick={() => { setAlertActive(true); setProgress(0); }}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-plum text-white py-3.5 text-sm font-semibold hover:scale-[1.02] transition-transform"
              >
                <Shield className="h-4 w-4" /> Ativar modo proteção
              </button>
            </div>
          )}

          <div className="rounded-3xl bg-card border border-border/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legenda</p>
            <div className="mt-3"><MapLegend /></div>
          </div>
        </aside>

        {/* Map */}
        <div className="relative h-[60vh] lg:h-[80vh] min-h-[480px]">
          <StreetMap
            start={start}
            end={end}
            onRouteReady={setRoute}
            progress={progress}
            alert={alertActive}
          />
        </div>
      </div>

      <AlertOverlay
        active={alertActive}
        estimatedSeconds={Math.max(30, route?.duration ?? 60)}
        destinationName={destName.split(",")[0]}
        onCancel={() => setAlertActive(false)}
        onProgress={setProgress}
      />
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-blush/60 px-4 py-3 border border-transparent focus-within:border-primary/40 transition-colors">
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        {children}
      </div>
    </label>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card/70 backdrop-blur p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="font-display text-xl text-plum tabular-nums">{value}</p>
    </div>
  );
}
