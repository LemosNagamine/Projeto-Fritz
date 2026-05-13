import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StreetMap, MapLegend } from "@/components/StreetMap";
import { AlertOverlay } from "@/components/AlertOverlay";
import { geocode, type LngLat, type RouteResult } from "@/lib/routing";
import { useSafetyStore } from "@/lib/safety-store";
import { Search, Navigation, Shield, Clock, Loader2, MapPin, Footprints, Car, Phone, Send } from "lucide-react";

type TravelMode = "walk" | "car";
type CarMode = "uber" | "own";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa interativo — Frida" },
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
  const [mode, setMode] = useState<TravelMode>("walk");
  const [carMode, setCarMode] = useState<CarMode | null>(null);
  const [uberSent, setUberSent] = useState(false);
  const contacts = useSafetyStore((s) => s.contacts);
  const allowedContacts = contacts.filter((c) => c.notify);

  function notifyContactsUber() {
    if (allowedContacts.length === 0) return;
    const msg = `Estou a caminho de ${destName || "meu destino"} via Uber. Origem: ${originName || "local atual"}. Acompanhe meu trajeto pelo Frida.`;
    const numbers = allowedContacts.map((c) => c.phone.replace(/\D/g, "")).filter(Boolean).join(",");
    try {
      const url = `sms:${numbers}?&body=${encodeURIComponent(msg)}`;
      window.location.href = url;
    } catch {}
    setUberSent(true);
  }

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

  // Tempo realista calculado pela distância:
  // caminhada urbana ~4,8 km/h (com semáforos, esquinas e travessias)
  // carro em trânsito urbano ~25 km/h média
  const distKm = route ? route.distance / 1000 : 0;
  const walkMinutes = route ? Math.max(1, Math.round((distKm / 4.8) * 60)) : 0;
  const driveMinutes = route ? Math.max(1, Math.round((distKm / 25) * 60)) : 0;
  const formatTime = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}min` : `${m} min`);
  const km = distKm.toFixed(1);

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

              {/* Mode picker */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ModeButton
                  active={mode === "walk"}
                  onClick={() => { setMode("walk"); setCarMode(null); setUberSent(false); }}
                  icon={<Footprints className="h-4 w-4" />}
                  label="A pé"
                  hint={formatTime(walkMinutes)}
                />
                <ModeButton
                  active={mode === "car"}
                  onClick={() => { setMode("car"); }}
                  icon={<Car className="h-4 w-4" />}
                  label="De carro"
                  hint={formatTime(driveMinutes)}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Stat icon={mode === "car" ? Car : Footprints} label="Tempo" value={formatTime(mode === "car" ? driveMinutes : walkMinutes)} />
                <Stat icon={Navigation} label="Distância" value={`${km} km`} />
              </div>

              {mode === "car" && (
                <div className="mt-3 space-y-2 animate-float-up">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Como você vai?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <ModeButton
                      active={carMode === "uber"}
                      onClick={() => setCarMode("uber")}
                      icon={<Send className="h-4 w-4" />}
                      label="Uber / 99"
                      hint="Avisa contatos"
                    />
                    <ModeButton
                      active={carMode === "own"}
                      onClick={() => { setCarMode("own"); setUberSent(false); }}
                      icon={<Car className="h-4 w-4" />}
                      label="Carro próprio"
                      hint="Modo proteção"
                    />
                  </div>

                  {carMode === "uber" && (
                    <div className="rounded-2xl bg-card/80 backdrop-blur p-3 space-y-2">
                      <p className="text-xs text-foreground/80">
                        Vamos avisar {allowedContacts.length} contato{allowedContacts.length === 1 ? "" : "s"} permitido{allowedContacts.length === 1 ? "" : "s"} com a sua rota.
                      </p>
                      {allowedContacts.length === 0 ? (
                        <p className="text-[11px] text-destructive">Nenhum contato com permissão. Vá em Perfil para ativar.</p>
                      ) : (
                        <ul className="space-y-1">
                          {allowedContacts.map((c) => (
                            <li key={c.id} className="flex items-center gap-2 text-xs">
                              <Phone className="h-3 w-3 text-primary" />
                              <span className="font-medium">{c.name}</span>
                              <span className="text-muted-foreground">{c.phone}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={notifyContactsUber}
                        disabled={allowedContacts.length === 0}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary text-primary-foreground py-2.5 text-xs font-semibold shadow-soft disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" /> {uberSent ? "Avisado ✓" : "Avisar contatos agora"}
                      </button>
                    </div>
                  )}
                </div>
              )}

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

function ModeButton({ active, onClick, icon, label, hint }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; hint: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left transition-all ${
        active
          ? "border-primary bg-primary/10 text-plum shadow-soft"
          : "border-border bg-card/70 text-foreground/80 hover:bg-card"
      }`}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {icon} {label}
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums">{hint}</span>
    </button>
  );
}
