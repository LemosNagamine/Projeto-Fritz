import { Link, useLocation } from "@tanstack/react-router";
import { Shield, Map, MessageCircle, User, Info, BookOpen } from "lucide-react";

const links = [
  { to: "/", label: "Início", icon: Shield },
  { to: "/mapa", label: "Mapa", icon: Map },
  { to: "/comentarios", label: "Comentários", icon: MessageCircle },
  { to: "/perfil", label: "Perfil", icon: User },
  { to: "/como-funciona", label: "Como funciona", icon: BookOpen },
  { to: "/sobre", label: "Sobre", icon: Info },
] as const;

export function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg text-plum">Acalanto</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">caminhe segura</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground/70 hover:bg-blush hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/mapa"
          className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform"
        >
          Iniciar trajeto
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="flex justify-around px-2 py-2">
          {links.slice(0, 5).map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
