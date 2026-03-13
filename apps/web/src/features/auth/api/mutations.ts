import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../../lib/api/client.ts";
import { useAuthStore } from "../../../stores/auth.ts";

export function useSignup() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await api.auth.signup.post(input);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate({ to: "/posts" });
    },
  });
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await api.auth.login.post(input);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate({ to: "/posts" });
    },
  });
}
