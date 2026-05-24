export type AuthRole = "admin" | "teacher" | "student" | "parent" | "accounts";

export type AuthState = {
  token: string;
  role: AuthRole;
  identifier: string;
  name?: string;
};

type LoginResponse = { token: string; role: AuthRole; name?: string };

type LoginPayload = {
  role: AuthRole;
  identifier: string;
  access_code?: string;
};

export function getAuth(): AuthState | null {
  return null;
}

export function setAuth(state: AuthState) {
  void state;
}

export function clearAuth() {
  return;
}

export function getAuthToken(): string | null {
  return null;
}

export async function login(payload: LoginPayload) {
  return {
    token: "demo-token",
    role: payload.role,
    identifier: payload.identifier,
    name: payload.identifier || payload.role,
  } satisfies AuthState;
}


export function logout() {
  return;
}

export function subscribeAuth(callback: () => void) {
  void callback;
  return () => {};
}
