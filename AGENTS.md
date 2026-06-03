# Repository Guidelines

Single source of truth for contributors (human and AI) working in this repo.

## Project structure

Two independent npm projects under one repo, wired together at the root by Husky + lint-staged.

- `client/` — Vite + React 18 + TypeScript SPA
- `server/` — Express 4 + Mongoose API (TypeScript, ESM, `"type": "module"`)
- `docker-compose.yml` — production stack (`mongo` + `server` + nginx-served `client`)
- Root `package.json` — workspace-style scripts and pre-commit tooling only; no runtime code

## Commands

Run from the repo root:

| Script                 | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev:client`   | Vite dev server on `:5173`         |
| `npm run dev:server`   | tsx watch on `:5000`               |
| `npm run build:client` | `tsc -b && vite build`             |
| `npm run build:server` | `tsc -p tsconfig.build.json`       |
| `npm run lint`         | ESLint over client `.ts`/`.tsx`    |
| `npm run typecheck`    | `tsc --noEmit` for client + server |
| `npm run test`         | Vitest (server)                    |
| `npm run format`       | Prettier across the repo           |

Each sub-project also exposes the same scripts directly (`cd client && npm run dev`, etc.).

Docker (production): `docker compose up -d --build` from the repo root. Local dev does **not** use Docker.

## Architecture — non-obvious things

### REST endpoints under `/api`

`server/src/routes.ts` mounts resource routers: `/api/auth`, `/api/users`, `/api/expenses`, `/api/pocket-money`, `/api/lent-money`, `/api/reports`, `/api/sessions`. Follow REST conventions for new endpoints — no verb-named actions.

### Frontend state is split two ways

- **TanStack Query** for all server state (cache, mutations) — wired in [client/src/main.tsx](client/src/main.tsx) with `staleTime: 5m` + `refetchOnWindowFocus: false`.
- **React Context** for theme + sidebar state (Redux was removed; don't reintroduce it).
- **React Hook Form + Zod** (resolvers) for forms — schemas in `client/src/features/<domain>/schemas.ts`.

### Path alias `@` → `client/src/`

Configured in [client/vite.config.ts](client/vite.config.ts). Always import internal modules as `@/components/...`, `@/features/...` — never relative `../../..`.

### Vite manualChunks has a landmine

[client/vite.config.ts](client/vite.config.ts) splits `pdf` / `framer` / `charts` / `recharts`. **Don't** split `react` / `react-dom` into their own chunk — it breaks with "Cannot read properties of undefined (reading 'forwardRef')" because some vendor modules touch React at module-eval time.

### Route guards are declarative

`client/src/routes/RequireAuth.tsx` and `RedirectIfAuthed.tsx` wrap route subtrees. Don't add side-effect guards in layout components — they cause UI flashes.

### Backend response shape

Controllers throw `new ApiError(status, msg)` ([server/src/shared/lib/ApiError.ts](server/src/shared/lib/ApiError.ts)) and return `new ApiResponse(status, data, msg)` ([server/src/shared/lib/ApiResponse.ts](server/src/shared/lib/ApiResponse.ts)). Wrap async controllers in `asyncHandler` ([server/src/shared/lib/asyncHandler.ts](server/src/shared/lib/asyncHandler.ts)) so rejections forward to Express.

### CORS allowlist is hardcoded

[server/src/app.ts](server/src/app.ts) hardcodes the allowed origin regex (e.g. `/\.lokeshwardewangan\.in$/`, `/\.vercel\.app$/`). Adding a new origin means editing this file — there's no env var for it.

### Sentry initialises on import

[client/src/App.tsx](client/src/App.tsx) calls `Sentry.init` unconditionally at module load with `tracesSampleRate: 1.0` and `sendDefaultPii: true`. If `VITE_SENTRY_DSN` is unset, Sentry no-ops — but be aware that 100% trace sampling + PII is on whenever the DSN is present.

### Docker `VITE_*` are build-time only

In [docker-compose.yml](docker-compose.yml), every `VITE_*` is passed as a `build.args` entry and inlined into the bundle at image build time. Changing them needs `docker compose build client` — a `restart` won't pick them up. The runtime API base for the dockerized client is `/api`, proxied by nginx to `server:5000`.

### IST timezone math

The server ships only to IST users. Date helpers in [server/src/shared/lib/date.ts](server/src/shared/lib/date.ts) shift to IST before slicing the day; using raw UTC would lose expenses logged between 00:00–05:30 IST.

## Conventions

- **TypeScript strict** everywhere. Avoid `any`.
- **Naming**: PascalCase components, `useXxx` hooks. Server modules are grouped by domain: `domain.routes.ts` / `domain.controller.ts` / `domain.service.ts` / `domain.model.ts` / `domain.validator.ts`.
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `perf:`, `docs:`, `refactor:`, `test:`.
- **Branches**: `feature/...`, `fix/...`, `chore/...`.
- **Prettier configs** are per-project: client uses `prettier-plugin-tailwindcss` + `trailingComma: "es5"`; server uses `trailingComma: "all"` + `printWidth: 100`.

## Testing

- **Server**: Vitest in `server/tests/` — covers auth, expenses, feed. Run with `npm run test` (root) or `npm run test:watch` (server).
- **Client**: no test suite yet. Quality gates are `lint` + `typecheck` + `build`. New tests go next to the feature as `*.test.tsx` or under `__tests__/`.

## Pre-commit hook

`.husky/pre-commit` runs `npx lint-staged`. The config in root `package.json` formats only staged files with Prettier. Heavier checks (build, typecheck, vitest) belong in CI, not the hook. If a hook becomes a blocker for a WIP commit, ask the user before passing `--no-verify`.

## Configuration

- `client/.env.example` and `server/.env.example` are the source of truth for app-level config. Copy each to `.env` (or `.env.local` for the client) and fill in.
- Root `.env.example` is **only** for `docker-compose` — it holds the Mongo + nginx-port wiring, not app secrets.
- Never commit `.env`. Production uses Vercel env vars (server) and Docker secrets (compose stack).
