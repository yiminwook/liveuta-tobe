# Docker Template for TanStack Start + Vite

Use these snippets as a baseline and merge them with the repository's existing configuration.

## Application Setup

Install Nitro with the active package manager:

```bash
pnpm add nitro
```

Keep existing Vite plugins and ordering constraints. Add Nitro after TanStack Start and before the React plugin:

```ts
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tanstackStart(), nitro(), viteReact()],
})
```

Production scripts:

```json
{
  "scripts": {
    "build": "vite build",
    "start": "node .output/server/index.mjs"
  }
}
```

If Corepack will run inside the image, prefer an existing `packageManager` declaration. When adding one, use repository history or the accepted active `pnpm --version`; do not claim the lockfile proves an exact pnpm patch version. Never silently upgrade the package-manager major during an image build.

## Dockerfile

This pnpm example assumes Node 22 and a `packageManager` field in `package.json`:

```dockerfile
# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV="production"
ENV HOST="0.0.0.0"
ENV PORT="3000"
COPY --from=builder --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

Use Debian slim instead of Alpine when native runtime dependencies are incompatible with musl. If a native dependency needs a compatibility library at runtime, install it in the runner stage too; installing it only in the builder does not help the running container. Do not install build tools in the runner without runtime evidence.

## Compose

Map the desired host port to the stable container port. The example exposes `http://localhost:3010`:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: liveuta
    restart: always
    ports:
      - "3010:3000"
    environment:
      NODE_ENV: production
      HOST: 0.0.0.0
      PORT: 3000
```

Add a health check only when the selected route is stable, unauthenticated, does not redirect, and has no external dependency. Prefer a dedicated endpoint when one exists. Node 22 can perform the check without installing curl; `/` below is only an example:

```yaml
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
```

## Docker Ignore

```dockerignore
node_modules
.output
.git
.env
.env.*
coverage
*.log
.agents
.codex
.vscode
.cursor
```

## Verification

On PowerShell:

```powershell
pnpm test
pnpm exec tsc --noEmit
pnpm run build
git diff --check
docker compose config
docker compose up --build -d
docker compose ps
docker compose logs --tail 100 app
docker compose exec app node -e "console.log(process.getuid?.())"
(Invoke-WebRequest http://localhost:3010/ -UseBasicParsing).StatusCode
```

Also request a nested document route and an asset URL found in the returned SSR HTML. Inspect the initial HTML rather than relying only on client-side rendering.

## Diagnose Before Changing Configuration

| Symptom | First evidence to collect |
| --- | --- |
| `.output/server/index.mjs` missing | Build output and whether `nitro()` is present after `tanstackStart()` |
| Container exits immediately | `docker compose ps -a` and `docker compose logs app` |
| Host gets connection refused | Container status, published ports, `HOST=0.0.0.0`, and internal `PORT` |
| Docker named pipe not found | Whether Docker Desktop / the Docker engine is running |
| Docker named pipe access denied | Whether the current shell or sandbox may access the engine |
| Runtime module or native binary error | Whether `.output` is self-contained and whether Alpine/musl is compatible |
| Different pnpm major appears in build | `packageManager`, Corepack output, and the lockfile's producing version |

Do not fix these symptoms by switching to `vite dev`, copying the whole workspace into the runner, running as root, or deleting Docker volumes.

## Sources

- [TanStack Start hosting: Nitro and Node.js / Docker](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#node-js-docker)
- [Nitro](https://nitro.build/)
