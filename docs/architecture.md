# Architecture

## Overview

bunmplate is a Bun monorepo template providing end-to-end type safety between an Elysia.js backend and a React frontend via Eden treaty.

## Workspace Structure

```
apps/
  server/   - Elysia.js backend (port 3000)
  web/      - React SPA (port 3001)
packages/
  drizzle/  - Drizzle ORM schemas + client
  ui/       - shadcn/ui components
  tsconfig/ - Shared TypeScript configs
```

## Eden Type-Safety Flow

```
Elysia route (TypeBox validation)
  --> TypeScript infers App type
  --> apps/server exports "App" from "./type"
  --> apps/web imports type { App } from "@bunmplate/server/type"
  --> treaty<App>(url) --> api.posts.index.get() is fully typed
```

Zero codegen. Types propagate automatically from server to client.

## Server Architecture (DDD-lite)

Each feature follows a layered architecture:

```
features/{name}/
  domain/
    entities/     - Core domain entities
    valueObjects/ - Validated value types (branded types)
  application/
    useCases/     - Business operations
    ports/        - Interface contracts (dependency inversion)
    dtos.ts       - Data transfer objects
  infrastructure/ - Port implementations (Drizzle repos, etc.)
  presentation/   - Elysia controllers (HTTP layer)
  ioc.ts          - Dependency wiring
```

### Shared Kernel

- **Result<T, E>**: Ok/Err discriminated union for domain-level error handling
- **AppError**: Typed application errors with HTTP status mapping (extends Error)
- **Brand<T, B>**: Nominal typing for value objects

### Error Handling Policy

Result is for **decisions**, throw is for **interruptions**. The boundary is the layer.

| Layer | Mechanism | Rationale |
|-------|-----------|-----------|
| Domain (Value Objects) | `Result<T, AppError>` | Value Object creation is a business rule judgment, not an exception. The caller decides how to handle failure — branch on `ok`/`err` or convert to throw via `unwrap()`. Domain stays pure (no stack-unwinding side effects). |
| Application (UseCases) | `throw AppError` | "Cannot proceed" conditions (not found, unauthorized, conflict). UseCases are the last decision point before the HTTP boundary — throwing is simpler than threading Result through controllers. |
| Presentation (Controllers) | Elysia `onError` | `errorPlugin` catches all thrown errors and maps them to the unified error envelope. Controllers never catch errors themselves. |

`unwrap()` bridges the two: it converts a domain `Result` into an application-layer `throw`, used at the point where the UseCase decides a validation failure is unrecoverable.

```
createEmail(input)           -- Domain: returns Result<Email, AppError>
  |
  unwrap(createEmail(input)) -- Application: throws AppError if err
  |
  errorPlugin catches        -- Presentation: maps to HTTP 4xx/5xx envelope
```

**Guidelines:**
- New Value Objects MUST return `Result`, not throw
- UseCases SHOULD throw `AppError` for unrecoverable conditions
- Infrastructure errors (DB, network) propagate as thrown exceptions and are caught by `errorPlugin` as unknown errors
- Never catch errors inside controllers — let `errorPlugin` handle uniformly

### Plugins

- **requestIdPlugin**: Reads or generates `X-Request-Id`, derives `requestId` into context
- **errorPlugin**: Factory `createErrorPlugin(logger)` — handles validation errors, AppError, and unknown errors with structured logging
- **authGuard**: JWT verification via `jose`, derives `auth.userId`

## Frontend Architecture

Feature-based structure following TanStack conventions:

```
features/{name}/
  api/        - TanStack Query hooks (queries + mutations)
  components/ - Feature-specific React components
  pages/      - Page components used by routes
  validation/ - Zod schemas (imported from @bunmplate/drizzle)
```

### Key Libraries

- **TanStack Router**: File-based routing with type-safe params
- **TanStack Query**: Server state management with caching
- **Eden**: Type-safe HTTP client derived from Elysia server types
- **Zustand**: Client state (auth store with persistence)
- **shadcn/ui**: UI components from packages/ui

## Database

- **Drizzle ORM** with PostgreSQL (postgres-js driver)
- Schemas organized per feature: `packages/drizzle/src/schemas/{feature}/`
- Each feature has: `table.ts` (schema), `query.ts` (relations), `validation.ts` (Zod)
- Validation schemas shared between server and web

## Development Workflow

```bash
# Setup
podman compose up -d       # Start PostgreSQL
bun install                # Install all dependencies
cp .env.example .env       # Configure environment
bun run db:push            # Push schema to database

# Development
bun run dev                # Start server (3000) + web (3001)

# Database
bun run db:generate        # Generate migration files
bun run db:push            # Push schema changes
bun run db:studio          # Open Drizzle Studio

# Quality
bun run typecheck          # Type check all workspaces
bun run lint               # Lint with Biome
bun run format             # Format with Biome
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| POST | /auth/signup | No | Register user |
| POST | /auth/login | No | Login, returns JWT |
| GET | /posts | No | List posts (cursor pagination) |
| GET | /posts/:id | No | Get post by ID |
| POST | /posts | Yes | Create post |
| PUT | /posts/:id | Yes | Update post (owner only) |
| DELETE | /posts/:id | Yes | Delete post (owner only) |

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "human-readable message",
    "details": [...]
  }
}
```
