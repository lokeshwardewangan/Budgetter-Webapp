# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

Two independent npm projects under one repo. The root `package.json` only wires Husky — there is no root install, no workspaces, and no test runner. Run all commands from inside `client/` or `server/`.

- `client/` — Vite + React 18 + TypeScript SPA
- `server/` — Express 4 + Mongoose API (ESM, `"type": "module"` in `server/package.json`)
- `docker-compose.yml` — production stack (`mongo` + `server` + nginx-served `client`)

## Commands

Frontend (`cd client`):
- `npm run dev` — Vite dev server on `:5173`
- `npm run build` — `tsc -b && vite build` (the pre-commit hook runs this)
- `npm run lint` — ESLint over `.ts`/`.tsx`
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — Prettier

Backend (`cd server`):
- `npm run dev` — nodemon on `src/index.js`, expects `:5000`
- `npm run start` — production start
- `npm run format` — Prettier

There is **no test suite anywhere** — quality gates are lint + typecheck + build only. Adding tests is fine; place them as `*.test.tsx` next to the feature or in `__tests__/`.

Docker (production, from repo root): `docker compose up -d --build`. See README "Docker" section for full flow. Local dev does **not** use Docker.

## Architecture — non-obvious things

### Backend API surface is RPC-style, not REST

Routes mount at `/api/user` and `/api/user/report` ([server/src/app.js:41-42](server/src/app.js#L41-L42)) — note the **singular** `user`, despite what the README's tables show. Endpoints are verb-named actions (`/add-today-expenses`, `/get-all-users`, `/received-lent-money`, `/delete-active-session`), not resource paths. When adding endpoints, follow the existing `verifyJwtToken`-then-controller chaining in [server/src/routes/user.routes.js](server/src/routes/user.routes.js) rather than introducing REST conventions.

### Auth middleware is fragile

[server/src/middleware/auth.middleware.js](server/src/middleware/auth.middleware.js) reads the JWT from `Authorization: Bearer <token>` only (no cookie fallback, despite the commented-out code) and **swallows all errors via `console.log`** without calling `next(err)` or returning a response. A bad token currently causes the request to hang. If you touch auth, fix this rather than copying the pattern.

Every authenticated request also writes to `activeSessions.$.lastUsedAt` on the user doc — bulk endpoints will produce one extra Mongo write per call.

### Server is ESM, root is CommonJS

`server/package.json` declares `"type": "module"` so all `.js` files under `server/src` use `import`/`export` with explicit `.js` extensions (e.g. `from './app.js'`). The repo-root `package.json` says `"type": "commonjs"`, but it only holds Husky — don't get confused and switch the server back to require-syntax.

### Frontend state is split three ways

- **Redux Toolkit** ([client/src/app/store.ts](client/src/app/store.ts)) for UI/global client state — slices live in `client/src/features/<domain>/`.
- **TanStack Query** for all server state (cache, mutations) — wired in [client/src/main.tsx](client/src/main.tsx).
- **Formik + Yup** for form state and validation; schemas in `client/src/schemas/`.

Don't put server data in Redux. Don't add a second forms library.

### Path alias `@` → `client/src/`

Configured in [client/vite.config.ts:8-9](client/vite.config.ts#L8-L9). Always import internal modules as `@/components/...`, `@/features/...`, etc. — not relative `../../..` paths.

### Vite manualChunks has a known landmine

[client/vite.config.ts:14-31](client/vite.config.ts#L14-L31) splits `pdf` / `framer` / `charts` / `recharts`. The inline comment says **don't** split `react`/`react-dom` into their own chunk — it breaks with "Cannot read properties of undefined (reading 'forwardRef')" because some vendor modules touch React at module-eval time. Leave that alone.

### CORS is an allowlist regex, not a config var

[server/src/app.js:14-24](server/src/app.js#L14-L24) hardcodes `/\.lokeshwardewangan\.in$/` and `/\.vercel\.app$/`. Adding a new origin means editing this file — no env var exists for it.

### Backend response shape

All controllers throw `new ApiError(status, msg)` ([server/src/utils/ApiError.js](server/src/utils/ApiError.js)) for errors and return `new ApiResponse(status, data, msg)` ([server/src/utils/ApiResponse.js](server/src/utils/ApiResponse.js)) for success. Wrap async controllers in `asyncHandler` from [server/src/utils/asyncHandler.js](server/src/utils/asyncHandler.js) to forward rejections to Express. Keep this pattern when adding endpoints.

### Pre-commit hook is heavy

[.husky/pre-commit](.husky/pre-commit) runs `cd client && npm run build && npm run format && git add .` then `cd server && npm run format && git add .` on every commit. A full TypeScript compile + Vite build runs each time — expect ~15–40s per commit. If you need to bypass during a WIP commit, the user must opt in explicitly (no `--no-verify` unless asked).

### Sentry is initialized at module-load

[client/src/App.tsx:13-17](client/src/App.tsx#L13-L17) calls `Sentry.init` unconditionally at import time with `tracesSampleRate: 1.0` and `sendDefaultPii: true`. If `VITE_SENTRY_DSN` is unset, Sentry no-ops — but be aware that 100% trace sampling + PII is on by default in this codebase.

### Docker `VITE_*` are build-time only

In the compose stack ([docker-compose.yml:96-103](docker-compose.yml#L96-L103)), every `VITE_*` variable is passed as a `build.args` entry and inlined into the bundle when the client image builds. Changing them needs `docker compose build client` — a `restart` won't pick them up. The runtime API base for the dockerized client is `/api`, proxied by nginx to `server:5000` (no hardcoded host).

## Conventions

- Naming: PascalCase components, `useXxx` hooks, `xxxSlice` for Redux slices, `domain.routes.js` / `domain.controllers.js` / `domain.model.js` on the server.
- Frontend is strict TypeScript — avoid `any` (the existing `state: any` in `App.tsx` is a wart, not a pattern to follow).
- Commit messages use Conventional Commits (`feat:`, `fix:`, `chore:`, `perf:`, `docs:`). Branch names: `feature/...`, `fix/...`, `chore/...`.
- Prettier config (from CONTRIBUTING.md): `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `tabWidth: 2`. `prettier-plugin-tailwindcss` reorders class names on save.
