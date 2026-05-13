import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-plum">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">Caminho não encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta página não existe. Vamos te levar de volta com segurança.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Frida — caminhe segura" },
      { name: "description", content: "Plataforma de segurança para mulheres com rotas inteligentes, alertas em zonas perigosas e check-in obrigatório." },
      { name: "theme-color", content: "#e8b8c4" },
      { property: "og:title", content: "Frida — caminhe segura" },
      { property: "og:description", content: "Caminhe com confiança: rotas seguras, alertas e comunidade." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
