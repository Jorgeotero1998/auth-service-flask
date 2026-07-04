import { useState } from "react";
import { api } from "../api";

const APP_KEY = (import.meta.env.VITE_APP_KEY as string | undefined) ?? "generic";

export function DemoPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-panel/70 p-4">
        <h2 className="text-sm font-semibold">Domain demo</h2>
        <p className="mt-2 text-sm text-muted">
          This page changes per repo via <code className="rounded bg-white/10 px-1 py-0.5">VITE_APP_KEY</code>.
        </p>
      </section>

      {APP_KEY === "crm" ? <CrmDemo /> : null}
      {APP_KEY === "ecommerce" ? <EcommerceDemo /> : null}
      {APP_KEY === "support" ? <SupportDemo /> : null}
      {APP_KEY === "jobs" ? <JobsDemo /> : null}
      {APP_KEY === "gateway" ? <GatewayDemo /> : null}
      {APP_KEY === "search" ? <SearchDemo /> : null}
      {APP_KEY === "booking" ? <BookingDemo /> : null}
      {APP_KEY === "auth" ? <AuthDemo /> : null}

      {APP_KEY === "generic" ? (
        <section className="rounded-2xl border border-border bg-panel/70 p-4 text-sm text-muted">
          No domain demo configured.
        </section>
      ) : null}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-panel/70 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 text-sm">{children}</div>
    </section>
  );
}

function JsonBox({ value }: { value: unknown }) {
  return (
    <pre className="mt-2 overflow-auto rounded-xl border border-border bg-black/30 p-3 text-xs text-slate-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function CrmDemo() {
  const [orgName, setOrgName] = useState("Acme Inc");
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="CRM">
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          className="flex-1 rounded-xl border border-border bg-white/5 px-3 py-2 text-sm"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () => setOut(await api("/api/v1/crm/orgs", { method: "POST", body: JSON.stringify({ name: orgName }) }))}
        >
          Create org
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/crm/orgs"))}>
          List orgs
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function EcommerceDemo() {
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="E-commerce">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () =>
            setOut(
              await api("/api/v1/shop/products", {
                method: "POST",
                body: JSON.stringify({ sku: `SKU-${Date.now()}`, name: "Demo product", price_cents: 1999, currency: "USD" })
              })
            )
          }
        >
          Create product
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/shop/products"))}>
          List products
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/shop/orders"))}>
          List orders
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function SupportDemo() {
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="Support">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () => setOut(await api("/api/v1/support/tickets", { method: "POST", body: JSON.stringify({ subject: "Demo ticket" }) }))}
        >
          Create ticket
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/support/tickets"))}>
          List tickets
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function JobsDemo() {
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="Jobs">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () =>
            setOut(await api("/api/v1/jobs", { method: "POST", body: JSON.stringify({ name: `job-${Date.now()}`, description: "Demo job" }) }))
          }
        >
          Create job
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/jobs"))}>
          List jobs
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/jobs/runs"))}>
          List runs
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function GatewayDemo() {
  const [out, setOut] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>("");
  return (
    <Panel title="API Gateway">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            const created = await api("/api/v1/platform/api-keys", { method: "POST", body: JSON.stringify({ name: "demo" }) });
            setApiKey((created as any).api_key ?? "");
            setOut(created);
          }}
        >
          Create API key (admin)
        </button>
        <button
          className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm"
          onClick={async () =>
            setOut(
              await api("/api/v1/platform/echo?message=hello", {
                method: "GET",
                headers: apiKey ? { "X-API-Key": apiKey } : undefined
              })
            )
          }
        >
          Echo with X-API-Key
        </button>
      </div>
      <div className="mt-2 text-xs text-muted">API key: {apiKey ? apiKey : "(create one)"} </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function SearchDemo() {
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="Search + RAG">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () => setOut(await api("/api/v1/docs", { method: "POST", body: JSON.stringify({ title: "Doc", content: "This is a demo document." }) }))}
        >
          Add doc
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/docs/search?q=demo"))}>
          Search "demo"
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function BookingDemo() {
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="Booking">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () => setOut(await api("/api/v1/booking/resources", { method: "POST", body: JSON.stringify({ name: "Room A" }) }))}
        >
          Create resource
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/api/v1/booking/resources"))}>
          List resources
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

function AuthDemo() {
  const [out, setOut] = useState<any>(null);
  return (
    <Panel title="Auth Service (Flask)">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={async () => setOut(await api("/auth/register", { method: "POST", body: JSON.stringify({ email: `u${Date.now()}@ex.com`, password: "pass1234" }) }))}
        >
          Register
        </button>
        <button className="rounded-xl border border-border bg-white/5 px-3 py-2 text-sm" onClick={async () => setOut(await api("/health", { method: "GET" }))}>
          Health
        </button>
      </div>
      <JsonBox value={out} />
    </Panel>
  );
}

