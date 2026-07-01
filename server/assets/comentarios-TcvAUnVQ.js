import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CiqFgXEX.js";
import { u as useSafetyStore, s as safetyStore } from "./safety-store-D89l2vSr.js";
import { S as Search, T as TriangleAlert, a as Send } from "./triangle-alert-By7muiHF.js";
import { c as createLucideIcon, M as MessageCircle, S as Shield } from "./router-Bbd1Go0x.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function CommentsPage() {
  const comments = useSafetyStore((s) => s.comments);
  const [filter, setFilter] = reactExports.useState("all");
  const [query, setQuery] = reactExports.useState("");
  const [street, setStreet] = reactExports.useState("");
  const [text, setText] = reactExports.useState("");
  const [author, setAuthor] = reactExports.useState("");
  const [rating, setRating] = reactExports.useState("safe");
  function submit(e) {
    e.preventDefault();
    if (!street.trim() || !text.trim()) return;
    safetyStore.addComment({
      street: street.trim(),
      text: text.trim(),
      author: author.trim() || "Anônima",
      rating
    });
    setStreet("");
    setText("");
    setAuthor("");
  }
  const filtered = comments.filter((c) => {
    if (filter !== "all" && c.rating !== filter) return false;
    if (query && !`${c.street} ${c.text}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 md:px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: "Comunidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 font-display text-4xl md:text-5xl text-plum", children: "Vozes que protegem." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-foreground/70", children: "Compartilhe relatos sobre as ruas que conhece. Suas palavras podem proteger outra mulher hoje." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid lg:grid-cols-[1fr_360px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "all", onClick: () => setFilter("all"), children: "Todos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "safe", onClick: () => setFilter("safe"), tone: "safe", children: "Seguras" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "caution", onClick: () => setFilter("caution"), tone: "caution", children: "Cautela" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "danger", onClick: () => setFilter("danger"), tone: "danger", children: "Perigosas" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Buscar rua...", className: "bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground/60" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CommentCard, { c }, c.id)),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border p-10 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-8 w-8 text-muted-foreground mx-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Nenhum comentário encontrado." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:sticky lg:top-24 self-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "rounded-3xl bg-gradient-warm p-6 shadow-card space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-plum", children: "Deixar relato" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/70 mt-1", children: "Sua experiência ajuda quem caminha amanhã." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: street, onChange: (e) => setStreet(e.target.value), placeholder: "Nome da rua", required: true, className: "w-full rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: author, onChange: (e) => setAuthor(e.target.value), placeholder: "Seu nome (ou deixe anônimo)", className: "w-full rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Como é caminhar por aqui?", required: true, rows: 4, className: "w-full rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/50 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Como classifica a rua?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RatingButton, { value: "safe", current: rating, onClick: setRating, icon: Shield, label: "Segura" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RatingButton, { value: "caution", current: rating, onClick: setRating, icon: CircleAlert, label: "Cautela" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RatingButton, { value: "danger", current: rating, onClick: setRating, icon: TriangleAlert, label: "Perigosa" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "w-full flex items-center justify-center gap-2 rounded-2xl bg-plum text-white py-3.5 font-semibold hover:scale-[1.02] transition-transform", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " Publicar relato"
        ] })
      ] }) })
    ] })
  ] });
}
function CommentCard({
  c
}) {
  const tone = ratingTone[c.rating];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "rounded-3xl bg-card border border-border/60 p-5 shadow-card hover:shadow-glow transition-shadow animate-float-up", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-10 w-10 rounded-2xl flex items-center justify-center ${tone.bg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(tone.icon, { className: `h-4.5 w-4.5 ${tone.fg}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg text-plum", children: c.street }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${tone.badge}`, children: tone.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/80 mt-1.5 leading-relaxed", children: [
        '"',
        c.text,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
        "por ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: c.author }),
        " · ",
        timeAgo(c.createdAt)
      ] })
    ] })
  ] }) });
}
const ratingTone = {
  safe: {
    label: "Segura",
    icon: Shield,
    bg: "bg-safe/15",
    fg: "text-safe",
    badge: "bg-safe/20 text-safe"
  },
  caution: {
    label: "Cautela",
    icon: CircleAlert,
    bg: "bg-warning/15",
    fg: "text-warning",
    badge: "bg-warning/20 text-warning"
  },
  danger: {
    label: "Perigosa",
    icon: TriangleAlert,
    bg: "bg-danger/15",
    fg: "text-danger",
    badge: "bg-danger/20 text-danger"
  }
};
function FilterChip({
  children,
  active,
  onClick,
  tone
}) {
  const toneCls = tone ? `bg-${tone}/15 text-${tone}` : "bg-blush text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${active ? "bg-primary text-primary-foreground shadow-soft" : `${toneCls} hover:opacity-80`}`, children });
}
function RatingButton({
  value,
  current,
  onClick,
  icon: Icon,
  label
}) {
  const active = value === current;
  const tone = ratingTone[value];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => onClick(value), className: `flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${active ? `${tone.bg} border-current ${tone.fg}` : "bg-card border-border/60 text-muted-foreground hover:border-primary/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold", children: label })
  ] });
}
function timeAgo(t) {
  const diff = (Date.now() - t) / 1e3;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
  return `${Math.floor(diff / 86400)} d atrás`;
}
export {
  CommentsPage as component
};
