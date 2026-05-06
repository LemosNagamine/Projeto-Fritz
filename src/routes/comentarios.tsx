import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { safetyStore, useSafetyStore, type StreetComment } from "@/lib/safety-store";
import { MessageCircle, Send, Shield, AlertTriangle, AlertCircle, Search } from "lucide-react";

export const Route = createFileRoute("/comentarios")({
  head: () => ({
    meta: [
      { title: "Comentários da comunidade — Acalanto" },
      { name: "description", content: "Leia e compartilhe relatos sobre a segurança das ruas." },
    ],
  }),
  component: CommentsPage,
});

function CommentsPage() {
  const comments = useSafetyStore((s) => s.comments);
  const [filter, setFilter] = useState<"all" | StreetComment["rating"]>("all");
  const [query, setQuery] = useState("");

  const [street, setStreet] = useState("");
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState<StreetComment["rating"]>("safe");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!street.trim() || !text.trim()) return;
    safetyStore.addComment({ street: street.trim(), text: text.trim(), author: author.trim() || "Anônima", rating });
    setStreet(""); setText(""); setAuthor("");
  }

  const filtered = comments.filter((c) => {
    if (filter !== "all" && c.rating !== filter) return false;
    if (query && !`${c.street} ${c.text}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-10">
      <header className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Comunidade</span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl text-plum">Vozes que protegem.</h1>
        <p className="mt-3 text-foreground/70">
          Compartilhe relatos sobre as ruas que conhece. Suas palavras podem proteger outra mulher hoje.
        </p>
      </header>

      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Feed */}
        <div>
          <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
            <div className="flex gap-2">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>Todos</FilterChip>
              <FilterChip active={filter === "safe"} onClick={() => setFilter("safe")} tone="safe">Seguras</FilterChip>
              <FilterChip active={filter === "caution"} onClick={() => setFilter("caution")} tone="caution">Cautela</FilterChip>
              <FilterChip active={filter === "danger"} onClick={() => setFilter("danger")} tone="danger">Perigosas</FilterChip>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 w-full sm:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar rua..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((c) => <CommentCard key={c.id} c={c} />)}
            {filtered.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border p-10 text-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="mt-3 text-sm text-muted-foreground">Nenhum comentário encontrado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <aside className="lg:sticky lg:top-24 self-start">
          <form onSubmit={submit} className="rounded-3xl bg-gradient-warm p-6 shadow-card space-y-4">
            <div>
              <h2 className="font-display text-2xl text-plum">Deixar relato</h2>
              <p className="text-xs text-foreground/70 mt-1">Sua experiência ajuda quem caminha amanhã.</p>
            </div>

            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Nome da rua"
              required
              className="w-full rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/50"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Seu nome (ou deixe anônimo)"
              className="w-full rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/50"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Como é caminhar por aqui?"
              required
              rows={4}
              className="w-full rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm outline-none focus:border-primary/50 resize-none"
            />

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Como classifica a rua?</p>
              <div className="grid grid-cols-3 gap-2">
                <RatingButton value="safe" current={rating} onClick={setRating} icon={Shield} label="Segura" />
                <RatingButton value="caution" current={rating} onClick={setRating} icon={AlertCircle} label="Cautela" />
                <RatingButton value="danger" current={rating} onClick={setRating} icon={AlertTriangle} label="Perigosa" />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-2xl bg-plum text-white py-3.5 font-semibold hover:scale-[1.02] transition-transform">
              <Send className="h-4 w-4" /> Publicar relato
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function CommentCard({ c }: { c: StreetComment }) {
  const tone = ratingTone[c.rating];
  return (
    <article className="rounded-3xl bg-card border border-border/60 p-5 shadow-card hover:shadow-glow transition-shadow animate-float-up">
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${tone.bg}`}>
          <tone.icon className={`h-4.5 w-4.5 ${tone.fg}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="font-display text-lg text-plum">{c.street}</h3>
            <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${tone.badge}`}>{tone.label}</span>
          </div>
          <p className="text-sm text-foreground/80 mt-1.5 leading-relaxed">"{c.text}"</p>
          <p className="text-xs text-muted-foreground mt-2">
            por <span className="font-medium">{c.author}</span> · {timeAgo(c.createdAt)}
          </p>
        </div>
      </div>
    </article>
  );
}

const ratingTone = {
  safe:    { label: "Segura",   icon: Shield,         bg: "bg-safe/15",    fg: "text-safe",    badge: "bg-safe/20 text-safe" },
  caution: { label: "Cautela",  icon: AlertCircle,    bg: "bg-warning/15", fg: "text-warning", badge: "bg-warning/20 text-warning" },
  danger:  { label: "Perigosa", icon: AlertTriangle,  bg: "bg-danger/15",  fg: "text-danger",  badge: "bg-danger/20 text-danger" },
} as const;

function FilterChip({ children, active, onClick, tone }: { children: React.ReactNode; active: boolean; onClick: () => void; tone?: "safe" | "caution" | "danger" }) {
  const toneCls = tone ? `bg-${tone}/15 text-${tone}` : "bg-blush text-foreground";
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
        active ? "bg-primary text-primary-foreground shadow-soft" : `${toneCls} hover:opacity-80`
      }`}
    >
      {children}
    </button>
  );
}

function RatingButton({ value, current, onClick, icon: Icon, label }: { value: StreetComment["rating"]; current: StreetComment["rating"]; onClick: (v: StreetComment["rating"]) => void; icon: any; label: string }) {
  const active = value === current;
  const tone = ratingTone[value];
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all ${
        active ? `${tone.bg} border-current ${tone.fg}` : "bg-card border-border/60 text-muted-foreground hover:border-primary/30"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

function timeAgo(t: number) {
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
  return `${Math.floor(diff / 86400)} d atrás`;
}
