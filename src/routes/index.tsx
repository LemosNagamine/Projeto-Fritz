import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, MapPin, Users, Bell, ArrowRight, Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acalanto — caminhe segura" },
      { name: "description", content: "Aplicativo de segurança para mulheres com rotas inteligentes, modo de proteção e check-in automático." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-rose-soft/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-28 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur border border-primary/15 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Feito por mulheres, para mulheres
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-7xl leading-[0.95] text-plum">
              Caminhe<br />
              <span className="italic text-primary">com confiança.</span>
            </h1>
            <p className="mt-6 text-lg text-foreground/75 max-w-xl leading-relaxed">
              Acalanto detecta áreas isoladas, calcula sua rota mais segura e fica de olho no seu trajeto.
              Se algo der errado, agimos por você.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/mapa"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
              >
                Iniciar trajeto seguro <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/como-funciona"
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/60 backdrop-blur px-7 py-3.5 text-sm font-semibold text-plum hover:bg-card transition-colors"
              >
                Como funciona
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["#f5c2c7", "#e8a4b3", "#d68a9c", "#c47086"].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background" style={{ background: c }} />
                ))}
              </div>
              <p>Mais de <span className="font-semibold text-foreground">12.4k mulheres</span> caminhando juntas hoje</p>
            </div>
          </div>

          {/* Phone mock */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-[9/19] rounded-[3rem] bg-plum p-3 shadow-glow">
              <div className="h-full w-full rounded-[2.5rem] bg-cream overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
                  <div className="mt-2 h-5 w-24 rounded-full bg-plum" />
                </div>
                <div className="pt-12 px-5 h-full flex flex-col">
                  <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">Modo proteção</p>
                  <h3 className="font-display text-xl text-plum mt-1">A caminho de casa</h3>
                  <div className="mt-3 rounded-2xl bg-blush p-3">
                    <p className="text-[10px] text-muted-foreground">Tempo restante</p>
                    <p className="font-display text-3xl text-foreground tabular-nums">08:42</p>
                    <div className="mt-2 h-1.5 rounded-full bg-card overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-primary rounded-full" />
                    </div>
                  </div>
                  <div className="mt-3 flex-1 rounded-2xl bg-gradient-warm p-3 relative overflow-hidden">
                    <svg viewBox="0 0 200 240" className="absolute inset-0 w-full h-full">
                      <path d="M 20 220 Q 60 180 100 150 T 180 30" fill="none" stroke="oklch(0.62 0.2 5)" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" />
                      <circle cx="20" cy="220" r="6" fill="oklch(0.7 0.12 160)" />
                      <circle cx="180" cy="30" r="6" fill="oklch(0.6 0.22 5)" />
                      <circle cx="100" cy="150" r="10" fill="white" stroke="oklch(0.62 0.18 5)" strokeWidth="3" />
                    </svg>
                  </div>
                  <div className="mt-3 mb-3 flex items-center gap-2 rounded-2xl bg-card border border-border p-2.5">
                    <div className="h-7 w-7 rounded-full bg-safe flex items-center justify-center">
                      <Shield className="h-3.5 w-3.5 text-white" />
                    </div>
                    <p className="text-[11px] font-medium text-foreground leading-tight">Rota evitando 2 zonas perigosas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Como te protegemos</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-plum">Cada passo, acompanhado.</h2>
          <p className="mt-4 text-foreground/70">Quatro camadas de proteção que se ativam automaticamente sempre que você precisa.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group relative rounded-3xl bg-card border border-border/60 p-6 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-gradient-warm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-plum">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-10 md:p-16 text-center shadow-glow">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0px, transparent 50%), radial-gradient(circle at 80% 70%, white 0px, transparent 50%)" }} />
          <Heart className="h-10 w-10 text-primary-foreground mx-auto" />
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-primary-foreground">Você não está sozinha.</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto">
            Junte-se a uma comunidade que cuida umas das outras. Comente sobre as ruas, ajude outras mulheres e caminhe protegida.
          </p>
          <Link to="/mapa" className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-8 py-4 text-sm font-semibold text-primary shadow-soft hover:scale-105 transition-transform">
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const features = [
  { icon: MapPin, title: "Rotas inteligentes", desc: "Calculamos o caminho mais seguro evitando áreas escuras e isoladas." },
  { icon: Bell, title: "Modo proteção", desc: "Cronômetro automático no trajeto e check-in obrigatório ao chegar." },
  { icon: Shield, title: "Emergência ativa", desc: "Se você não responder em 5 min, ligamos para a polícia e delegacia." },
  { icon: Users, title: "Comunidade", desc: "Comentários reais de outras mulheres sobre cada rua e bairro." },
];
