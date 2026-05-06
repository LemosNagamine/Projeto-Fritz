import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { safetyStore, useSafetyStore } from "@/lib/safety-store";
import { User, Phone, Plus, Trash2, Heart, Shield } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Acalanto" },
      { name: "description", content: "Configure seus contatos de emergência e preferências de proteção." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const contacts = useSafetyStore((s) => s.contacts);
  const userName = useSafetyStore((s) => s.userName);
  const [name, setName] = useState(userName);
  const [vibration, setVibration] = useState(true);
  const [autoCall, setAutoCall] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);

  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cRel, setCRel] = useState("");

  function addContact(e: React.FormEvent) {
    e.preventDefault();
    if (!cName || !cPhone) return;
    safetyStore.addContact({ name: cName, phone: cPhone, relation: cRel || "Contato" });
    setCName(""); setCPhone(""); setCRel("");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-10">
      {/* Header */}
      <header className="rounded-[2.5rem] bg-gradient-warm p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="h-20 w-20 rounded-3xl bg-card flex items-center justify-center shadow-soft">
            <User className="h-9 w-9 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Bem-vinda</p>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); safetyStore.setUserName(e.target.value); }}
              className="font-display text-3xl md:text-4xl text-plum bg-transparent outline-none focus:border-b-2 border-primary"
            />
          </div>
        </div>
      </header>

      <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Emergency contacts */}
        <section className="rounded-3xl bg-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-2xl text-plum">Contatos de emergência</h2>
            <span className="text-xs rounded-full bg-blush px-3 py-1 text-primary font-semibold">{contacts.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Quem ligamos quando você precisa de ajuda.</p>

          <ul className="mt-5 space-y-2">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-blush/60 p-4">
                <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.relation} · <a href={`tel:${c.phone}`} className="text-primary hover:underline">{c.phone}</a></p>
                </div>
                <button
                  onClick={() => safetyStore.removeContact(c.id)}
                  className="h-9 w-9 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={addContact} className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Nome" required className="rounded-2xl bg-blush/40 border border-transparent focus:border-primary/40 px-4 py-3 text-sm outline-none" />
            <input value={cPhone} onChange={(e) => setCPhone(e.target.value)} placeholder="Telefone" required className="rounded-2xl bg-blush/40 border border-transparent focus:border-primary/40 px-4 py-3 text-sm outline-none" />
            <input value={cRel} onChange={(e) => setCRel(e.target.value)} placeholder="Relação" className="rounded-2xl bg-blush/40 border border-transparent focus:border-primary/40 px-4 py-3 text-sm outline-none" />
            <button type="submit" className="sm:col-span-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary text-primary-foreground py-3 font-semibold text-sm shadow-soft">
              <Plus className="h-4 w-4" /> Adicionar contato
            </button>
          </form>
        </section>

        {/* Preferences */}
        <aside className="space-y-4">
          <div className="rounded-3xl bg-card border border-border/60 p-6 shadow-card">
            <h2 className="font-display text-xl text-plum mb-4">Preferências</h2>
            <Toggle label="Vibração no check-in" value={vibration} onChange={setVibration} />
            <Toggle label="Ligar para emergência automática" value={autoCall} onChange={setAutoCall} />
            <Toggle label="Compartilhar localização ao vivo" value={shareLocation} onChange={setShareLocation} />
          </div>

          <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
            <Heart className="h-6 w-6" />
            <p className="font-display text-lg mt-2">Você cuida de outras mulheres.</p>
            <p className="text-xs text-primary-foreground/80 mt-1">Cada relato seu protege quem caminha depois.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Mini label="Trajetos" value="14" />
              <Mini label="Relatos" value="3" />
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border/60 p-5 flex items-center gap-3">
            <Shield className="h-5 w-5 text-safe shrink-0" />
            <p className="text-xs text-muted-foreground">Seus dados ficam apenas no seu dispositivo nesta versão demo.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 cursor-pointer">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur p-3">
      <p className="text-[10px] uppercase tracking-wider text-primary-foreground/80">{label}</p>
      <p className="font-display text-2xl">{value}</p>
    </div>
  );
}
