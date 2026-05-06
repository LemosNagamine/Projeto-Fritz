import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Phone, Check, X, Vibrate } from "lucide-react";

type Phase = "idle" | "in-transit" | "awaiting-checkin" | "calling";

type Props = {
  active: boolean;
  estimatedSeconds: number;
  destinationName?: string;
  onCancel: () => void;
  onProgress?: (p: number) => void;
};

const CHECKIN_WINDOW = 5 * 60; // 5 minutes

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function vibrate(pattern: number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(pattern); } catch {}
  }
}

export function AlertOverlay({ active, estimatedSeconds, destinationName, onCancel, onProgress }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transitLeft, setTransitLeft] = useState(estimatedSeconds);
  const [checkinLeft, setCheckinLeft] = useState(CHECKIN_WINDOW);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (active) {
      setPhase("in-transit");
      setTransitLeft(estimatedSeconds);
      setCheckinLeft(CHECKIN_WINDOW);
      startedAt.current = Date.now();
      vibrate([200, 100, 200]);
    } else {
      setPhase("idle");
    }
  }, [active, estimatedSeconds]);

  // Transit countdown
  useEffect(() => {
    if (phase !== "in-transit") return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const left = Math.max(0, estimatedSeconds - elapsed);
      setTransitLeft(left);
      onProgress?.(Math.min(1, elapsed / estimatedSeconds));
      if (left <= 0) {
        setPhase("awaiting-checkin");
        startedAt.current = Date.now();
        vibrate([400, 200, 400, 200, 400]);
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase, estimatedSeconds, onProgress]);

  // Check-in countdown + repeated vibration
  useEffect(() => {
    if (phase !== "awaiting-checkin") return;
    const id = setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const left = Math.max(0, CHECKIN_WINDOW - elapsed);
      setCheckinLeft(left);
      if (left <= 0) {
        setPhase("calling");
        vibrate([1000, 200, 1000]);
      }
    }, 250);
    const vibId = setInterval(() => vibrate([300, 150, 300]), 2000);
    return () => { clearInterval(id); clearInterval(vibId); };
  }, [phase]);

  if (!active || phase === "idle") return null;

  if (phase === "in-transit") {
    return (
      <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,28rem)]">
        <div className="rounded-3xl bg-card/95 backdrop-blur-xl border border-primary/20 shadow-glow p-5 animate-float-up">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">Modo proteção ativo</p>
              <h3 className="font-display text-lg leading-tight text-plum mt-0.5">
                A caminho de {destinationName || "destino"}
              </h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-3xl text-foreground tabular-nums">{format(transitLeft)}</span>
                <span className="text-xs text-muted-foreground">tempo estimado restante</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-blush overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all"
                  style={{ width: `${Math.min(100, (1 - transitLeft / estimatedSeconds) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Quando chegar, vamos pedir uma confirmação. Mantenha o celular por perto.
              </p>
              <button
                onClick={onCancel}
                className="mt-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Encerrar trajeto
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "awaiting-checkin") {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-float-up">
        <div className="max-w-md w-full bg-card rounded-3xl shadow-glow border border-warning/30 overflow-hidden">
          <div className="bg-gradient-warm p-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-warning/20 flex items-center justify-center animate-shake">
              <Vibrate className="h-7 w-7 text-warning" />
            </div>
            <h2 className="font-display text-2xl text-plum mt-4">Você chegou em segurança?</h2>
            <p className="text-sm text-foreground/70 mt-2 max-w-sm mx-auto">
              Seu celular está vibrando. Confirme em até <span className="font-semibold tabular-nums">{format(checkinLeft)}</span> ou ligaremos para emergência.
            </p>
          </div>
          <div className="p-6 space-y-3">
            <div className="rounded-2xl bg-blush p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Tempo para resposta</span>
                <span className="font-display text-2xl text-danger tabular-nums">{format(checkinLeft)}</span>
              </div>
              <div className="h-2 rounded-full bg-card overflow-hidden">
                <div
                  className="h-full bg-gradient-danger transition-all"
                  style={{ width: `${Math.min(100, (1 - checkinLeft / CHECKIN_WINDOW) * 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => { vibrate([0]); onCancel(); }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-safe text-white py-4 font-semibold shadow-soft hover:scale-[1.02] transition-transform"
            >
              <Check className="h-5 w-5" /> Estou bem, cheguei!
            </button>
            <a
              href="tel:190"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-danger text-danger py-3 font-semibold hover:bg-danger hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" /> Preciso de ajuda agora
            </a>
          </div>
        </div>
      </div>
    );
  }

  // calling phase
  return (
    <div className="fixed inset-0 z-50 bg-gradient-danger flex items-center justify-center p-4 animate-float-up">
      <div className="max-w-md w-full text-center text-white">
        <div className="mx-auto h-24 w-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
          <Phone className="h-10 w-10 text-white animate-shake" />
        </div>
        <h2 className="font-display text-3xl mt-6">Acionando emergência</h2>
        <p className="text-white/85 mt-2">
          Sem resposta em 5 minutos. Vamos chamar a Polícia (190) e a Delegacia da Mulher (180).
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <a href="tel:190" className="rounded-2xl bg-white text-danger py-4 font-bold text-lg shadow-glow">Ligar 190</a>
          <a href="tel:180" className="rounded-2xl bg-white text-danger py-4 font-bold text-lg shadow-glow">Ligar 180</a>
        </div>
        <button
          onClick={() => { vibrate([0]); onCancel(); }}
          className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
        >
          <X className="h-4 w-4" /> Falso alarme — encerrar
        </button>
      </div>
    </div>
  );
}
