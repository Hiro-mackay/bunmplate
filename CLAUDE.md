# bunmplate

Bun + TypeScript monorepo template with Elysia backend and React frontend.
Eden provides end-to-end type safety from server to client.

## Stack

- **Runtime**: Bun
- **Backend**: Elysia.js (Functional Domain Modeling)
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

## Domain Modeling

Functional Domain Modeling approach. No OO in the domain layer.

### Entity

- `readonly interface` for data shape
- Module-level pure functions for behavior
  - **Factory** (`Post`, `User`): same name as the interface (TS type/value spaces coexist). Takes raw input, validates internally via Value Objects, returns `Result<Post, AppError>`
  - **Behavior** (`changeTitle`, `changeContent`): takes Entity + raw input, returns `Result<Post, AppError>` (immutable)
  - **Assertion** (`assertAuthor`): enforces domain invariants, returns `Result<Post, AppError>` (pass-through for pipeline composition)
- Entity creation MUST go through the factory — never construct the interface directly outside the domain
- All validation lives in the domain, not in Use Cases or Controllers

### Error Handling

- **Domain layer**: NEVER throw. Always return `Result<T, AppError>` — domain functions are pure
- **Application layer**: NEVER throw. Return `Result<T, AppError>` — propagate and compose with `map`/`flatMap`
- **Infrastructure layer**: may throw on I/O failures (DB, network) — caught by error plugin
- **Presentation layer**: `unwrap()` at HTTP boundary — error plugin converts thrown `AppError` to HTTP responses

Result combinators (`shared/kernel/result.ts`):
- `map(result, fn)`: transform ok value (e.g., entity → DTO)
- `flatMap(result, fn)`: chain Result-returning functions (e.g., domain operations)
- `unwrap(result)`: extract value or throw — **Presentation layer only**

### Value Object

- Branded type (`Brand<string, "Title">`) for type-safe primitives
- Smart constructor (`createTitle`): validates and returns `Result<Title, AppError>`
- Constants for validation rules (`TITLE_MIN_LENGTH`, `TITLE_MAX_LENGTH`) — reused by Elysia schema at API boundary

### Domain Service

- Pure function when logic spans multiple aggregates
- Only introduce when behavior does not belong to a single Entity

### Application Layer (Use Cases)

- Thin orchestration only: fetch → delegate to domain → persist
- MUST NOT contain validation, authorization, or state transition logic
- Dependencies injected via `Deps` interface (ports)

### Infrastructure Layer

- Classes for adapters (Repository, Provider) — they hold state (DB connection, secrets)
- `toEntity()` in Repository reconstructs branded types from DB rows via Value Object smart constructors

### Layer Rules

```
Domain:         interface + pure functions (NO imports from Application/Infrastructure)
Application:    orchestration + port interfaces (imports Domain)
Infrastructure: adapter classes (implements port interfaces, imports Domain)
Presentation:   Elysia controllers (imports Application use cases)
```

## Conventions

- Package names use `@bunmplate/` scope
- Workspace references via `workspace:*`
- Eden type export: `apps/server` exports `App` type, `apps/web` imports it
- No Turborepo - use Bun `--filter` + concurrently
