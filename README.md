# Acalanto — Rodando localmente no VSCode

App de segurança para mulheres com mapa customizado, rotas reais (OSRM) e modo de alerta.

## Pré-requisitos

Instale **uma** das opções abaixo:

- **Node.js 20+** (recomendado): https://nodejs.org
- ou **Bun 1.1+**: https://bun.sh

E o **VSCode**: https://code.visualstudio.com

### Extensões recomendadas no VSCode
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

---

## Passo a passo

### 1. Abrir o projeto
```bash
code .
```

### 2. Instalar dependências

Com **npm**:
```bash
npm install
```

Ou com **bun** (mais rápido):
```bash
bun install
```

> ⚠️ Se aparecer erro relacionado a `bun.lockb` ou `package-lock.json`, apague o arquivo de lock que **não** corresponde ao gerenciador que você está usando e rode o install de novo.

### 3. Rodar em modo desenvolvimento

```bash
npm run dev
```
ou
```bash
bun run dev
```

O Vite vai abrir em **http://localhost:8080** (ou outra porta se estiver ocupada — veja o terminal).

### 4. Build de produção (opcional)
```bash
npm run build
npm run preview
```

---

## Estrutura

```
src/
├── routes/              # Páginas (TanStack Router file-based)
│   ├── __root.tsx       # Layout raiz
│   ├── index.tsx        # Home
│   ├── mapa.tsx         # Mapa + alerta
│   ├── comentarios.tsx
│   ├── perfil.tsx
│   ├── como-funciona.tsx
│   └── sobre.tsx
├── components/
│   ├── StreetMap.tsx    # Mapa SVG customizado
│   ├── AlertOverlay.tsx # Sistema de alerta 3 fases
│   └── SiteHeader.tsx
├── lib/
│   ├── routing.ts       # OSRM + Nominatim
│   └── safety-store.ts  # Store mock
└── styles.css           # Design tokens (oklch)
```

---

## Problemas comuns (Troubleshooting)

### ❌ `Cannot find module` ou `Failed to resolve import`
Apague `node_modules` e o lockfile, depois reinstale:
```bash
rm -rf node_modules package-lock.json bun.lockb
npm install
```

### ❌ Porta 8080 já em uso
Mate o processo ou rode em outra porta:
```bash
npm run dev -- --port 3000
```

### ❌ Erro de geolocalização no navegador
O navegador exige **HTTPS** ou **localhost** para `navigator.geolocation`. Como `localhost` é permitido, deve funcionar — mas você precisa **autorizar** quando o navegador pedir.

### ❌ Mapa em branco / "Falha ao buscar rota"
As APIs públicas usadas (OSRM e Nominatim) podem ter rate-limit. Aguarde alguns segundos e tente de novo. Verifique o console (F12) para mensagens.

### ❌ Vibração não funciona
A API `navigator.vibrate` só funciona em **dispositivos móveis** (Android/Chrome). No desktop ela é ignorada silenciosamente — isso é normal.

### ❌ Erro de tipo TypeScript ao iniciar
Rode uma vez:
```bash
npm run dev
```
O TanStack Router gera `src/routeTree.gen.ts` automaticamente no primeiro start. Não edite esse arquivo manualmente.

### ❌ `bun: command not found` (Windows)
Use o **PowerShell** e instale:
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```
Ou simplesmente use `npm` que já vem com o Node.

---

## Notas sobre o backend
Esta versão é **frontend-only** (mock). Comentários, contatos de emergência e histórico ficam só na memória da sessão — somem ao recarregar. Se quiser persistência, ative o Lovable Cloud ou ligue um backend próprio.

## APIs externas usadas
- **OSRM** (`router.project-osrm.org`) — cálculo de rotas a pé
- **Nominatim** (`nominatim.openstreetmap.org`) — busca de endereços

Ambas são públicas e gratuitas. Para uso pesado/produção, hospede sua própria instância ou use Mapbox/Google.
