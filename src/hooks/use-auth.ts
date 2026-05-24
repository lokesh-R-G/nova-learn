import { login as loginService, logout as logoutService, type AuthState } from "@/lib/auth";

export function useAuth() {
  return {
    auth: null as AuthState | null,
    login: loginService,
    logout: logoutService,
  };
}
