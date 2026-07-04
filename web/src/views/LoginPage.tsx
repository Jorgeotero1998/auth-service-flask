import { useState } from "react";
import { login, setToken } from "../api";

export function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("change-me-admin");
  const [status, setStatus] = useState<string>("");

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-panel/70 p-5">
      <h2 className="text-lg font-semibold">Login</h2>
      <p className="mt-1 text-sm text-muted">
        Use the admin seed from the backend env vars (ADMIN_EMAIL / ADMIN_PASSWORD).
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setStatus("Signing in…");
          try {
            const t = await login(email, password);
            setToken(t.access_token);
            setStatus("OK. Token saved in localStorage.");
          } catch (err: any) {
            setStatus(String(err?.message ?? err));
          }
        }}
      >
        <Field label="Email">
          <input
            className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            className="w-full rounded-xl border border-border bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </Field>

        <button className="w-full rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
          Sign in
        </button>
      </form>

      {status ? (
        <div className="mt-3 rounded-xl border border-border bg-white/5 px-3 py-2 text-xs text-slate-200">
          {status}
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-muted">{label}</div>
      {children}
    </label>
  );
}

