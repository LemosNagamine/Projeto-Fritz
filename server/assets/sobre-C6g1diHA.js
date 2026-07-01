import { T as jsxRuntimeExports } from "./worker-entry-CiqFgXEX.js";
import { S as Shield, L as Link } from "./router-Bbd1Go0x.js";
import { H as Heart } from "./heart-CQrqlUtB.js";
import { U as Users, S as Sparkles } from "./users-BLrctLQ_.js";
import { A as ArrowRight } from "./arrow-right-BdxxChnO.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const stats = [{
  value: "12.4k",
  label: "mulheres ativas"
}, {
  value: "38k+",
  label: "trajetos protegidos"
}, {
  value: "5.2k",
  label: "ruas comentadas"
}, {
  value: "100%",
  label: "feito por mulheres"
}];
const values = [{
  icon: Heart,
  title: "Empatia",
  desc: "Cada decisão de design começa pela escuta de quem caminha pelas ruas todos os dias."
}, {
  icon: Shield,
  title: "Proteção",
  desc: "Não vendemos seus dados, não compartilhamos sua rota. Sua segurança é o produto."
}, {
  icon: Users,
  title: "Coletivo",
  desc: "Mulheres protegendo mulheres. A sabedoria da comunidade é nossa maior tecnologia."
}, {
  icon: Sparkles,
  title: "Beleza",
  desc: "Acreditamos que cuidar é também oferecer uma experiência acolhedora e bonita."
}];
function AboutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 md:px-6 py-12 md:py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "text-center max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: "Nossa história" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 font-display text-5xl md:text-7xl text-plum leading-[0.95]", children: [
        "Nasceu de um",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-primary", children: '"me avisa quando chegar".' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-foreground/75 leading-relaxed", children: 'Frida começou quando uma de nós percebeu que mandar mensagens dizendo "cheguei" para amigas era o gesto mais comum entre mulheres. E também o mais inseguro — porque ninguém percebe quando a mensagem não chega. Decidimos transformar esse pequeno ritual em uma camada de cuidado real.' })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-16 grid grid-cols-2 md:grid-cols-4 gap-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-gradient-warm p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-3xl md:text-4xl text-plum", children: s.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground mt-1", children: s.label })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: "Nossos valores" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 font-display text-4xl text-plum", children: "O que nos move." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid md:grid-cols-2 gap-4", children: values.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border/60 p-7 shadow-card hover:shadow-glow transition-shadow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-blush flex items-center justify-center text-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(v.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-plum", children: v.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/75 leading-relaxed", children: v.desc })
      ] }, v.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20 rounded-[2.5rem] bg-plum text-cream p-10 md:p-16 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-rose-soft/20 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-10 w-10 mx-auto text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-display text-4xl md:text-5xl", children: "Caminhe com a gente." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-cream/80 max-w-xl mx-auto", children: "Cada nova mulher que entra fortalece a comunidade. Comece hoje seu primeiro trajeto protegido." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/mapa", className: "mt-8 inline-flex items-center gap-2 rounded-full bg-card text-primary px-8 py-4 text-sm font-semibold shadow-glow hover:scale-[1.03] transition-transform", children: [
          "Iniciar trajeto ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] })
  ] });
}
export {
  AboutPage as component
};
