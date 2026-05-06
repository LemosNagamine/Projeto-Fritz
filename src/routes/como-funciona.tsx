import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Shield, Vibrate, PhoneCall, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — Acalanto" },
      { name: "description", content: "Entenda passo a passo como o Acalanto te protege durante o trajeto." },
    ],
  }),
  component: HowItWorksPage,
});

const steps = [
  { n: "01", icon: MapPin, title: "Defina seu trajeto", desc: "Digite onde você está e para onde vai. Buscamos a melhor rota a pé, evitando zonas marcadas como perigosas pela comunidade." },
  { n: "02", icon: Shield, title: "Ative o modo proteção", desc: "Confirmamos um tempo estimado de chegada com base na rota real e iniciamos o cronômetro do seu trajeto." },
  { n: "03", icon: Vibrate, title: "Check-in ao chegar", desc: "Quando o tempo acabar, seu celular vibra e abrimos uma janela de 5 minutos para você confirmar que chegou bem." },
  { n: "04", icon: PhoneCall, title: "Emergência automática", desc: "Se não obtivermos resposta no prazo, abrimos o discador para 190 (PM) e 180 (Delegacia da Mulher) imediatamente." },
];

function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20">
      <header className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Como funciona</span>
        <h1 className="mt-3 font-display text-4xl md:text-6xl text-plum">Quatro passos<br /><span className="italic text-primary">até em casa.</span></h1>
        <p className="mt-5 text-foreground/70">Uma camada invisível de cuidado que age automaticamente.</p>
      </header>

      <div className="mt-16 space-y-8">
        {steps.map((s, i) => (
          <div key={s.n} className={`grid md:grid-cols-[180px_1fr] gap-5 items-center ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2">
              <span className="font-display text-6xl md:text-7xl text-primary/20 leading-none">{s.n}</span>
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-3xl bg-gradient-warm flex items-center justify-center text-primary shadow-soft">
                <s.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="rounded-3xl bg-card border border-border/60 p-6 md:p-8 shadow-card">
              <h2 className="font-display text-2xl text-plum">{s.title}</h2>
              <p className="mt-2 text-foreground/75 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Promises */}
      <section className="mt-20 rounded-[2.5rem] bg-gradient-warm p-8 md:p-12">
        <h2 className="font-display text-3xl text-plum text-center">O que prometemos a você</h2>
        <ul className="mt-8 grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            "Suas rotas e relatos ficam privados.",
            "Funciona mesmo com sinal fraco — apenas a rota inicial precisa de internet.",
            "O check-in pode ser feito com um único toque.",
            "A emergência só é acionada após 5 minutos sem resposta.",
          ].map((p) => (
            <li key={p} className="flex gap-3 items-start rounded-2xl bg-card/70 backdrop-blur p-4">
              <div className="h-6 w-6 rounded-full bg-safe flex items-center justify-center shrink-0">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm text-foreground/85">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16 text-center">
        <Link to="/mapa" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform">
          Experimentar agora <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
