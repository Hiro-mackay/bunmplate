import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import { RootLayout } from "../components/layout/root-layout.tsx";

interface RouterContext {
  queryClient: QueryClient;
}

function RootErrorComponent({ error }: { error: Error }) {
  const router = useRouter();

  return (
    <RootLayout>
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        <button type="button" onClick={() => router.invalidate()}>
          Try again
        </button>
      </div>
    </RootLayout>
  );
}

const isDev = import.meta.env.DEV;

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <RootLayout>
      <Outlet />
      {isDev && (
        <Suspense>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
      )}
    </RootLayout>
  ),
  errorComponent: RootErrorComponent,
});
