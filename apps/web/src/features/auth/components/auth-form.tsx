import { useState } from "react";
import { useLogin, useSignup } from "../api/mutations.ts";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useLogin();
  const signup = useSignup();
  const mutation = isLogin ? login : signup;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  return (
    <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="font-semibold leading-none tracking-tight">
          {isLogin ? "Login" : "Sign Up"}
        </div>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isLogin ? 1 : 8}
            />
          </div>
          {mutation.error && <p className="text-sm text-destructive">{String(mutation.error)}</p>}
          <button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
