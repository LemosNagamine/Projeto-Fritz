import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CiqFgXEX.js";
import { u as useSafetyStore, s as safetyStore } from "./safety-store-D89l2vSr.js";
import { c as createLucideIcon, U as User, S as Shield } from "./router-Bbd1Go0x.js";
import { P as Phone } from "./phone-D6jnnVTi.js";
import { H as Heart } from "./heart-CQrqlUtB.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
const __iconNode = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
function ProfilePage() {
  const contacts = useSafetyStore((s) => s.contacts);
  const userName = useSafetyStore((s) => s.userName);
  const [name, setName] = reactExports.useState(userName);
  const [vibration, setVibration] = reactExports.useState(true);
  const [autoCall, setAutoCall] = reactExports.useState(true);
  const [shareLocation, setShareLocation] = reactExports.useState(true);
  const [cName, setCName] = reactExports.useState("");
  const [cPhone, setCPhone] = reactExports.useState("");
  const [cRel, setCRel] = reactExports.useState("");
  function addContact(e) {
    e.preventDefault();
    if (!cName || !cPhone) return;
    safetyStore.addContact({
      name: cName,
      phone: cPhone,
      relation: cRel || "Contato",
      notify: true
    });
    setCName("");
    setCPhone("");
    setCRel("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl px-4 md:px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "rounded-[2.5rem] bg-gradient-warm p-8 md:p-10 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-3xl bg-card flex items-center justify-center shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-9 w-9 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-primary", children: "Bem-vinda" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => {
            setName(e.target.value);
            safetyStore.setUserName(e.target.value);
          }, className: "font-display text-3xl md:text-4xl text-plum bg-transparent outline-none focus:border-b-2 border-primary" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid lg:grid-cols-[1fr_360px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl bg-card border border-border/60 p-6 shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl text-plum", children: "Contatos de emergência" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs rounded-full bg-blush px-3 py-1 text-primary font-semibold", children: contacts.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Quem ligamos quando você precisa de ajuda. Ative o sino para permitir alertas automáticos (ex.: modo Uber)." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-2", children: contacts.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 rounded-2xl bg-blush/60 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-card flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: c.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              c.relation,
              " · ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${c.phone}`, className: "text-primary hover:underline", children: c.phone })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "switch", "aria-checked": c.notify, onClick: () => safetyStore.setContactNotify(c.id, !c.notify), title: c.notify ? "Receberá alertas" : "Não receberá alertas", className: `relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${c.notify ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow-soft transition-transform duration-200 ${c.notify ? "translate-x-5" : "translate-x-0"}` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => safetyStore.removeContact(c.id), className: "h-9 w-9 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors", "aria-label": "Remover", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }, c.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: addContact, className: "mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: cName, onChange: (e) => setCName(e.target.value), placeholder: "Nome", required: true, className: "rounded-2xl bg-blush/40 border border-transparent focus:border-primary/40 px-4 py-3 text-sm outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: cPhone, onChange: (e) => setCPhone(e.target.value), placeholder: "Telefone", required: true, className: "rounded-2xl bg-blush/40 border border-transparent focus:border-primary/40 px-4 py-3 text-sm outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: cRel, onChange: (e) => setCRel(e.target.value), placeholder: "Relação", className: "rounded-2xl bg-blush/40 border border-transparent focus:border-primary/40 px-4 py-3 text-sm outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "sm:col-span-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary text-primary-foreground py-3 font-semibold text-sm shadow-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Adicionar contato"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border/60 p-6 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl text-plum mb-4", children: "Preferências" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Vibração no check-in", value: vibration, onChange: setVibration }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Ligar para emergência automática", value: autoCall, onChange: setAutoCall }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: "Compartilhar localização ao vivo", value: shareLocation, onChange: setShareLocation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-6 w-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg mt-2", children: "Você cuida de outras mulheres." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary-foreground/80 mt-1", children: "Cada relato seu protege quem caminha depois." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Trajetos", value: "14" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mini, { label: "Relatos", value: "3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border/60 p-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-safe shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Seus dados ficam apenas no seu dispositivo nesta versão demo." })
        ] })
      ] })
    ] })
  ] });
}
function Toggle({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0 cursor-pointer", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground flex-1 min-w-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "switch", "aria-checked": value, onClick: () => onChange(!value), className: `relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${value ? "bg-primary" : "bg-muted"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block h-6 w-6 transform rounded-full bg-white shadow-soft transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}` }) })
  ] });
}
function Mini({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white/15 backdrop-blur p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-primary-foreground/80", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl", children: value })
  ] });
}
export {
  ProfilePage as component
};
