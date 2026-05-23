import { apiPost } from "./api-client";

const STORAGE_KEY = "aether_auth";
const EVENT_NAME = "aether-auth-changed";

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

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

export function getAuth(): AuthState | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthState;
  } catch {
    return null;
  }
}

export function setAuth(state: AuthState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  notify();
}

export function clearAuth() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  notify();
}

export function getAuthToken(): string | null {
  return getAuth()?.token ?? null;
}

export async function login(payload: LoginPayload) {
  const response = await apiPost<{ token: string; role: AuthRole; name?: string }>(
    "/auth/login",
    payload,
  );
  const state: AuthState = {
    token: response.token,
    role: response.role,
    identifier: payload.identifier,
    name: response.name,
  };
  setAuth(state);
  return state;
}

export function logout() {
  clearAuth();
}

export function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
