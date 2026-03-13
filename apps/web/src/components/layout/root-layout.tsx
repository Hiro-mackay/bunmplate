import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuthStore } from "../../stores/auth.ts";

export function RootLayout({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = token !== null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-lg">
              bunmplate
            </Link>
            <Link to="/posts" className="text-muted-foreground hover:text-foreground">
              Posts
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
                <button type="button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button type="button">Login</button>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
