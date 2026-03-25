# bunmplate

Bun + TypeScript monorepo template for building full-stack applications with end-to-end type safety.

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Bun](https://bun.sh) |
| Backend | [Elysia.js](https://elysiajs.com) |
| Frontend | [React 19](https://react.dev) + [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) |
| Type-safe Client | [Eden](https://elysiajs.com/eden/overview) |
| Database | [PostgreSQL](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com) |
| Validation | [Zod](https://zod.dev) |
| Auth | JWT ([jose](https://github.com/panva/jose)) |
| Linter / Formatter | [Biome](https://biomejs.dev) |
| Git Hooks | [Lefthook](https://github.com/evilmartians/lefthook) |
| Container | [Podman](https://podman.io) / Docker Compose |

## Workspace Structure

```
bunmplate/
├── apps/
│   ├── server/          # Elysia.js backend (port 3000)
│   └── web/             # React SPA (port 3001)
├── packages/
│   ├── drizzle/         # Drizzle schemas + DB client
│   ├── ui/              # shadcn/ui shared components
│   └── tsconfig/        # Shared TypeScript configs
├── compose.yml          # PostgreSQL container
├── biome.json           # Linter / Formatter config
└── lefthook.yml         # Pre-commit hooks
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.2+
- [Podman](https://podman.io) or [Docker](https://www.docker.com)

### Setup

```bash
# Clone the template
gh repo create my-app --template Hiro-mackay/bunmplate --clone
cd my-app

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Start PostgreSQL
podman compose up -d   # or: docker compose up -d

# Push schema to database
bun run db:push

# Start development servers
bun run dev
```

The server runs at `http://localhost:3000` and the web app at `http://localhost:3001`.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/bunmplate` | PostgreSQL connection string |
| `DATABASE_POOL_SIZE` | `10` | Connection pool size |
| `DATABASE_IDLE_TIMEOUT` | `20` | Idle connection timeout (seconds) |
| `JWT_SECRET` | - | JWT signing key (change in production) |
| `SERVER_PORT` | `3000` | Backend server port |
| `CORS_ORIGIN` | `http://localhost:3001` | Allowed CORS origin |
| `VITE_API_URL` | `http://localhost:3000` | API URL for frontend |

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps concurrently |
| `bun run typecheck` | Type check all workspaces |
| `bun run lint` | Lint with Biome |
| `bun run format` | Format with Biome |
| `bun run check` | Lint + format with auto-fix |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |

## Architecture

### End-to-End Type Safety

Eden connects the Elysia backend to the React frontend with full type inference. The server exports its `App` type, and the web app imports it to create a typed API client -- no codegen required.

```
Elysia (server) ──exports App type──> Eden (client) ──typed requests──> TanStack Query
```

### Backend: Functional Domain Modeling

The server follows a layered architecture with Functional Domain Modeling:

```
Presentation   → Elysia controllers (HTTP boundary, unwrap Results)
Application    → Use Cases (thin orchestration: fetch → domain → persist)
Domain         → Pure functions + branded types (no I/O, no throws)
Infrastructure → Adapters (Repository, Provider implementations)
```

Key principles:
- **Entity**: `readonly interface` + module-level pure functions (factory, behavior, assertion)
- **Value Object**: Branded types with smart constructors returning `Result<T, AppError>`
- **Error Handling**: `Result` type throughout domain/application layers; only throw at HTTP boundary
- **No OOP in Domain**: Business logic lives in pure functions, not classes

### Frontend: Feature-Based Structure

```
src/
├── features/        # Feature modules (auth, posts, ...)
│   └── {feature}/
│       ├── api/         # Eden API calls + TanStack Query hooks
│       ├── components/  # Feature-specific components
│       └── pages/       # Route pages
├── components/      # Shared layout components
├── lib/             # Utilities (API client, auth helpers)
├── stores/          # Zustand stores
├── routes/          # TanStack Router route tree
└── styles/          # Global styles
```

### Database

Drizzle ORM with PostgreSQL, organized as a shared package:

```typescript
// Import DB client
import { db } from "@bunmplate/drizzle";

// Import schemas
import { usersTable } from "@bunmplate/drizzle/schemas/user";
```

Migrations are generated with `bun run db:generate` and applied with `bun run db:push`.

## Adding a New Feature

1. **Database schema** -- Add a table in `packages/drizzle/src/schemas/{feature}/`
2. **Domain** -- Define entity interface, value objects, and factory in `apps/server/src/modules/{feature}/domain/`
3. **Application** -- Write use cases in `apps/server/src/modules/{feature}/application/`
4. **Infrastructure** -- Implement repository in `apps/server/src/modules/{feature}/infrastructure/`
5. **Presentation** -- Add Elysia controller in `apps/server/src/modules/{feature}/presentation/`
6. **Frontend** -- Create feature module in `apps/web/src/features/{feature}/`

## Adding UI Components

```bash
cd packages/ui
bun run ui:add button    # Add a shadcn/ui component
```

Components are available across the monorepo:

```typescript
import { Button } from "@bunmplate/ui/components/button";
```

## License

MIT
