---
name: tanstack-start-docker
description: Use when a TanStack Start React app using Vite must be configured, reviewed, run, or debugged as a local Node.js SSR deployment with Docker, Docker Compose, Nitro, `.output/server/index.mjs`, port mapping, or container health checks.
---

# TanStack Start with Local Docker

Deploy the production Node server produced by Nitro. Do not run the Vite development server in the production container or replace SSR with static hosting.

Primary source: [TanStack Start Node.js / Docker hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#node-js-docker).

## Inspect First

Read `package.json`, its lockfile, Vite config, existing Docker files, ignore rules, environment usage, and repository instructions. Preserve the package manager, existing Vite plugins and their required order, application port conventions, unrelated scripts, and user changes.

Determine whether the app already has:

- `nitro` installed and `nitro()` after `tanstackStart()`;
- `build: vite build` and `start: node .output/server/index.mjs`;
- a reproducible package-manager version;
- runtime secrets, writable directories, native dependencies, or health endpoints that affect the image.

## Configure

Use the repository package manager to install `nitro`. Merge these essentials without overwriting the real config:

```ts
plugins: [/* existing plugins */, tanstackStart(), nitro(), viteReact()]
```

```json
{
  "scripts": {
    "build": "vite build",
    "start": "node .output/server/index.mjs"
  }
}
```

Before writing Docker or Compose files, read [references/docker-template.md](references/docker-template.md). Adapt names and host ports from repository evidence; do not hardcode example values into unrelated projects.

## Container Invariants

- Use a multi-stage build with the lockfile and frozen dependency installation.
- Run the final image as a non-root user and copy only `.output` unless runtime evidence requires more.
- Bind the server to `0.0.0.0`; map the host port in Compose instead of changing the internal application port.
- Pass runtime configuration at container start. Never bake `.env` files or secrets into image layers.
- Ignore `node_modules`, `.output`, Git data, editor data, logs, and local secret files in the build context.
- Keep production and development containers separate; do not add source bind mounts to the production deployment.

## Verify

Run the project tests and production build first. Confirm `.output/server/index.mjs` and `.output/public` exist. Then run:

```text
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs --tail 100 app
```

Verify the container is running as non-root and request `/`, a direct nested route, a built asset, and each changed server endpoint through the published host port. A successful image build alone does not prove SSR or routing works.

Starting or replacing the requested local app container is in scope for a local deployment task. Never use `docker compose down -v`, remove images, or delete volumes unless the user explicitly authorizes the data loss.

In the handoff, report the URL, container status, port mapping, verification commands, environment variables still required, and whether Docker was actually started.
