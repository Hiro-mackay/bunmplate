# bunmplate

Bun + TypeScript monorepo template with Elysia backend and React frontend.
Eden provides end-to-end type safety from server to client.

## Stack

- **Runtime**: Bun
- **Backend**: Elysia.js (DDD-lite architecture)
- **Frontend**: React + TanStack Router/Query + Eden
- **DB**: Drizzle ORM + PostgreSQL (postgres-js driver)
- **UI**: shadcn/ui (monorepo setup)
- **Linter/Formatter**: Biome
- **Container**: podman

## Workspace Structure

- `apps/server` - Elysia.js backend (port 3000)
- `apps/web` - React SPA (port 3001)
- `packages/drizzle` - Drizzle schemas + client
- `packages/ui` - shadcn/ui components
- `packages/tsconfig` - Shared TypeScript configs

## Commands

- `bun run dev` - Start all apps concurrently
- `bun run typecheck` - Type check all workspaces
- `bun run format` - Format with Biome
- `bun run lint` - Lint with Biome
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:push` - Push schema to DB
- `bun run db:studio` - Open Drizzle Studio

## Conventions

- Package names use `@bunmplate/` scope
- Workspace references via `workspace:*`
- Eden type export: `apps/server` exports `App` type, `apps/web` imports it
- No Turborepo - use Bun `--filter` + concurrently
