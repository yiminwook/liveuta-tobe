# Liveuta Migration Guide

This repository is the new Liveuta application. The legacy application at
`C:\Users\grs04\Desktop\project\liveuta-asis` is a read-only behavioral
reference. Do not edit the legacy repository, and do not copy Next.js-specific
implementation patterns into this repository unchanged.

## Product and Migration Goal

- Preserve user-visible Liveuta behavior while replacing Next.js App Router
  with TanStack Start and TanStack Router.
- Remove the React Server Component architecture. Build with ordinary React
  components, typed routes, explicit loaders, and clear server/API boundaries.
- Replace Mantine and SCSS modules with Tailwind CSS v4 and shadcn/ui.
- Replace Day.js with date-fns and native `Date`.
- Keep deployment on the existing local Docker/Node.js environment so MongoDB,
  OracleDB, Firebase Admin, Google APIs, SSR, and HTTP APIs can remain available.
- Optimize for a small, predictable, AI-friendly codebase rather than recreating
  Next.js abstractions.

The analyzed source inventory and parity checklist live in
`docs/liveuta-migration-checklist.md`. Use it as the source of scope when
writing implementation plans, and update it when a parity decision changes.

<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Project-Local Skill Policy

- Treat all installed, generated, copied, or downloaded skills as
  project-scoped resources.
- Store project skills only inside this repository. Prefer
  `<project-root>/.agents/skills/` when a tool does not require a different
  repository-local path.
- Never write or install skills in user-level or global locations, including
  `%USERPROFILE%\.codex\skills`, `%USERPROFILE%\.agents\skills`,
  `$CODEX_HOME/skills`, or any path outside the current repository.
- Run skill discovery and management commands from the project root. Do not use
  global skill flags or global-only resolution modes.
- Before running a command that may persist a skill, verify that its destination
  is inside this repository. If that cannot be verified, stop and ask.

## Target Architecture

### Rendering and routing

- Use TanStack Router file routes under `src/routes`. Never edit
  `src/routeTree.gen.ts` by hand.
- Do not add `"use client"`, `"use server"`, `server-only`, or imports from
  `next/*`.
- TanStack Start SSR, route loaders, server functions, and server routes are
  allowed; they are not React Server Components. Use each only at an explicit
  environment boundary.
- Keep route files thin: validate params/search, preload required data, compose
  layouts, and render a feature entry component. Put product behavior in
  `src/features/<feature>/`.
- Define shareable filters, pagination, sorting, and tabs with Zod-backed
  `validateSearch`. The URL is their source of truth.
- Use `beforeLoad` for navigation guards and repeat authorization in the
  server/API operation. A client redirect is never an authorization boundary.
- Isolate browser-only packages and APIs such as ReactPlayer, Notification,
  localStorage, react-grid-layout, and window listeners behind focused
  components/hooks or `ClientOnly`.

### Server and API boundaries

- Keep existing public HTTP contracts under `/api/*` during migration unless
  a deliberate versioned API change is documented.
- Implement HTTP endpoints as TanStack Start server routes. Use
  `createServerFn` only for app-private RPC behavior that is not consumed by
  a service worker, external client, OAuth provider, or scheduled job.
- Components and route loaders must never query OracleDB or MongoDB directly.
  Call a service through a server route/function so rendering and persistence
  stay independently testable.
- Put server-only persistence and integrations in
  `src/server/<domain>/*.server.ts`; never import those modules from code that
  can enter the client bundle.
- Put shared request/response schemas in `src/lib/contracts/`, transport code
  in `src/lib/api/`, and query definitions next to the owning feature.
- Never import response types from route handler files. Contracts must be
  framework- and transport-independent.
- Parse request bodies, responses, params, search params, cookies, headers, and
  storage data with Zod at their boundary.
- Preserve legacy status codes and response shapes while a vertical slice is
  being migrated. Normalize legacy database field names once in the service or
  API adapter, not throughout UI components.
- Use TanStack Query for remote client state. Route loaders may call
  `queryClient.ensureQueryData`; do not create a competing route-loader cache.

### Node.js and Docker

- The production runtime is Node.js in local Docker. Use the current official
  TanStack Start Vite + Nitro Node output and start the generated
  `.output/server/index.mjs`.
- Keep `Dockerfile` multi-stage, run as a non-root user, copy only runtime
  output/assets, expose port 3000, and bind the server to `0.0.0.0`.
- Keep `docker-compose.yml` as the local deployment entry point. Do not add
  Cloudflare, Wrangler, Pages, or Workers configuration unless the deployment
  decision changes again.
- Keep secrets in runtime environment variables or an ignored env file. Never
  bake secrets into an image, commit them, echo them in logs, or expose them
  through `VITE_` variables.
- Reuse established MongoDB and OracleDB connection helpers, but verify
  connection cleanup, pool behavior, shutdown, and container health before
  increasing concurrency.
- A successful Vite development server is not deployment proof. Verify the
  production image and Compose service with representative document and API
  requests.

## UI and Styling

- Tailwind CSS v4 is the default for layout, spacing, typography, color,
  responsive behavior, and simple interaction states.
- shadcn/ui source components live under `src/components/ui/`. Keep them
  generic; domain composition belongs in `src/features/` or
  `src/components/`.
- Use the shared `cn` helper for conditional classes. Do not introduce CSS
  Modules, Sass, CSS-in-JS, Mantine, or another component system.
- Store stable semantic tokens in `src/styles.css` with `@theme` and CSS
  variables. Preserve the legacy `theme1` through `theme5` storage contract
  until a tested migration is introduced.
- Keep plain global CSS only for resets, theme variables, keyframes,
  browser/vendor selectors, or third-party DOM that cannot be styled cleanly
  with utilities.
- Do not replace one opaque SCSS class with one opaque custom utility. Delete a
  legacy stylesheet only after responsive, theme, hover, focus, disabled,
  loading, and reduced-motion behavior is verified.
- Use accessible shadcn primitives and preserve keyboard operation, visible
  focus, labels, roles, portal stacking, and scroll locking.

## Dates and Localization

- Use date-fns functions and native `Date`; do not add Day.js, Moment, or a
  mutable date wrapper.
- Keep wire/storage timestamps as ISO 8601 strings or documented epoch values.
  Convert at the boundary and never rely on ambiguous implicit string parsing.
- Pass `date-fns/locale` explicitly: `ko`, `enUS`, or `ja`. Never mutate
  a global date locale.
- Translate Day.js tokens intentionally: `YYYY -> yyyy`, `DD -> dd`,
  `ddd -> EEE`, and `A -> a`.
- shadcn Calendar is based on `react-day-picker`, not `react-calendar`.
  Add it only when a migrated feature actually needs a calendar/date picker.
- Preserve `ko`, `en`, and `ja`, with `ko` as fallback. Route-visible
  product text must come from locale resources.

## State and Cross-Cutting Behavior

- Use Zustand or React context only for genuinely shared client state: player,
  session, modal stack, command palette, and shell state. Keep local UI state
  local.
- Preserve the legacy player/PiP, modal promise, hotkey, service-worker,
  notification, analytics, error-reporting, and five-theme contracts through
  focused adapters and behavior tests.
- Do not copy known legacy security defects. In particular, add runtime input
  validation, endpoint authorization, object ownership checks, OAuth state,
  verification-code rate limits, and protected cache invalidation.
- Development-only pages and diagnostics must be disabled or guarded in
  production.

## Migration Workflow

- Migrate by vertical slice: characterization test -> contract/service -> route
  and search schema -> feature UI -> visual/E2E verification -> checklist update.
- Treat `liveuta-asis` behavior, screenshots in `liveuta-asis/doc/`, and
  locale messages as acceptance references. Preserve behavior intentionally,
  not implementation bugs.
- Prefer shared foundations in this order: runtime/API contracts, locale and
  five-theme shell, shadcn primitives, date utilities, then product pages.
- Copy public assets only when a migrated slice uses them. Preserve attribution
  and avoid copying obsolete build artifacts.
- Remove starter/demo code and old dependencies only after replacement behavior
  passes. Do not delete the legacy deployment until production parity is proven.
- Keep commits small and feature-focused. Do not combine a visual redesign with
  a framework migration unless explicitly requested.

## TDD and Testing Policy

- Use test-driven development for behavior changes: write a meaningful failing
  test first, run it and confirm the expected failure, implement the smallest
  change, then refactor while keeping the suite green.
- Use Vitest for unit/integration tests and Playwright for route-level parity
  flows once it is added.
- Test every extracted React component and custom hook by default in jsdom
  through rendered behavior rather than implementation details.
- Keep static imports as the default. Dynamic `import()` in tests is allowed
  only for pure utilities, never components, hooks, or integrations.
- Avoid Node `fs` APIs when imported fixtures, in-memory data, dependency
  injection, MSW, or public interfaces can express the behavior.
- Mock only true external boundaries, nondeterminism, or expensive
  collaborators. Prefer real internal modules and user-visible outcomes.
- Add contract tests for every migrated API and route tests for search parsing,
  locale redirects, auth guards, loading, empty, error, and success states.
- Every migrated product route needs a Playwright happy path. Critical flows
  cover schedule filters, favorite/block, sign-in, setlist CRUD, PiP
  continuity, and direct navigation to nested URLs.

## Verification and Definition of Done

Run affected tests during red-green-refactor, then run:

```powershell
pnpm test
pnpm exec tsc --noEmit
pnpm build
docker compose build
docker compose up -d
docker compose ps
```

Smoke-test `/`, a locale route, a nested route refresh, one static asset, and
every changed API. Stop the Compose service after verification if the user does
not want it left running. Also run `git diff --check`.

A migration item is complete only when:

- its legacy-visible behavior and responsive states are checked against the
  migration inventory;
- loading, empty, error, unauthenticated, and authorized states are handled;
- no Next.js, Mantine, SCSS, or Day.js dependency leaked into the migrated slice;
- keyboard and focus behavior remain usable;
- relevant Vitest and Playwright tests pass;
- type checking, production build, and Docker smoke checks pass; and
- the migration checklist is updated with evidence, not only a checked box.
