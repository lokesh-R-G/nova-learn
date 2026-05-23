import { useEffect, useState } from "react";
import { getAuth, login as loginService, logout as logoutService, subscribeAuth, type AuthState } from "@/lib/auth";

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(() => getAuth());

  useEffect(() => {
    const unsubscribe = subscribeAuth(() => {
      setAuth(getAuth());
    });
    return unsubscribe;
  }, []);

  return {
    auth,
    login: loginService,
    logout: logoutService,
  };
}
