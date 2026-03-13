import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { parseError } from "../../../lib/api/parseError.ts";
import { useLogin, useSignup } from "../api/mutations.ts";
import { loginSchema, signupSchema } from "../validation.ts";

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-md rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="font-semibold leading-none tracking-tight">
          {isLogin ? "Login" : "Sign Up"}
        </div>
      </div>
      <div className="p-6 pt-0">
        <AuthFormInner key={isLogin ? "login" : "signup"} isLogin={isLogin} />
        <button type="button" className="mt-4 w-full" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}

function AuthFormInner({ isLogin }: { isLogin: boolean }) {
  const schema = isLogin ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues | SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const login = useLogin();
  const signup = useSignup();
  const mutation = isLogin ? login : signup;

  function onSubmit(data: LoginValues | SignupValues) {
    mutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email
        </label>
        <input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium leading-none">
          Password
        </label>
        <input
          id="password"
          type="password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>
      {mutation.error && (
        <p role="alert" className="text-sm text-destructive">
          {parseError(mutation.error)}
        </p>
      )}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Loading..." : isLogin ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
