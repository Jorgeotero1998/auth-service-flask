const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";
const APP_KEY = (import.meta.env.VITE_APP_KEY as string | undefined) ?? "generic";

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token: string) {
  localStorage.setItem("access_token", token);
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

export async function api<T = Json>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set("Content-Type", "application/json");
  const t = getToken();
  if (t) headers.set("Authorization", `Bearer ${t}`);

  const r = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const text = await r.text();
  const body = text ? (JSON.parse(text) as any) : null;
  if (!r.ok) {
    const detail = body?.detail ?? body?.message ?? `${r.status} ${r.statusText}`;
    throw new Error(String(detail));
  }
  return body as T;
}

export async function getHealth() {
  const path = APP_KEY === "auth" ? "/health" : "/api/v1/health";
  return api<{ status: string }>(path, { method: "GET" });
}

export async function login(email: string, password: string) {
  if (APP_KEY === "auth") {
    return api<{ access_token: string; refresh_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
  }
  // FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
  const r = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }).toString()
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String(body?.detail ?? "Login failed"));
  return body as { access_token: string; refresh_token: string; token_type: string };
}

export function openSwagger() {
  const path = APP_KEY === "auth" ? "/swagger" : "/docs";
  window.open(`${API_BASE_URL}${path}`, "_blank", "noopener,noreferrer");
}

