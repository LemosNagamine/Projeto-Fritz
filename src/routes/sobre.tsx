import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Users, Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o Acalanto" },
      { name: "description", content: "Conheça a história e os valores por trás da plataforma." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "12.4k", label: "mulheres ativas" },
  { value: "38k+", label: "trajetos protegidos" },
  { value: "5.2k", label: "ruas comentadas" },
  { value: "100%", label: "feito por mulheres" },
];

const values = [
  { icon: Heart, title: "Empatia", desc: "Cada decisão de design começa pela escuta de quem caminha pelas ruas todos os dias." },
  { icon: Shield, title: "Proteção", desc: "Não vendemos seus dados, não compartilhamos sua rota. Sua segurança é o produto." },
  { icon: Users, title: "Coletivo", desc: "Mulheres protegendo mulheres. A sabedoria da comunidade é nossa maior tecnologia." },
  { icon: Sparkles, title: "Beleza", desc: "Acreditamos que cuidar é também oferecer uma experiência acolhedora e bonita." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20">
      <section className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Nossa história</span>
        <h1 className="mt-4 font-display text-5xl md:text-7xl text-plum leading-[0.95]">
          Nasceu de um<br /><span className="italic text-primary">"me avisa quando chegar".</span>
        </h1>
        <p className="mt-6 text-lg text-foreground/75 leading-relaxed">
          Acalanto começou quando uma de nós percebeu que mandar mensagens dizendo "cheguei" para amigas
          era o gesto mais comum entre mulheres. E também o mais inseguro — porque ninguém percebe quando a
          mensagem não chega. Decidimos transformar esse pequeno ritual em uma camada de cuidado real.
        </p>
      </section>

      <section className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl bg-gradient-warm p-6 text-center">
            <p className="font-display text-3xl md:text-4xl text-plum">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Nossos valores</span>
          <h2 className="mt-3 font-display text-4xl text-plum">O que nos move.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-3xl bg-card border border-border/60 p-7 shadow-card hover:shadow-glow transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-blush flex items-center justify-center text-primary mb-4">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl text-plum">{v.title}</h3>
              <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[2.5rem] bg-plum text-cream p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-rose-soft/20 blur-3xl" />
        <div className="relative">
          <Heart className="h-10 w-10 mx-auto text-primary" />
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Caminhe com a gente.</h2>
          <p className="mt-4 text-cream/80 max-w-xl mx-auto">
            Cada nova mulher que entra fortalece a comunidade. Comece hoje seu primeiro trajeto protegido.
          </p>
          <Link to="/mapa" className="mt-8 inline-flex items-center gap-2 rounded-full bg-card text-primary px-8 py-4 text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform">
            Iniciar trajeto <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
