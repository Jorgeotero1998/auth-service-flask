import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../api";

const APP_KEY = (import.meta.env.VITE_APP_KEY as string | undefined) ?? "generic";

export function DashboardPage() {
  const q = useQuery({ queryKey: ["health"], queryFn: getHealth });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardTitle>API status</CardTitle>
        {q.isLoading ? (
          <CardBody>Checking…</CardBody>
        ) : q.isError ? (
          <CardBody className="text-red-300">{String((q.error as any)?.message ?? q.error)}</CardBody>
        ) : (
          <CardBody className="text-emerald-300">ok</CardBody>
        )}
      </Card>

      <Card>
        <CardTitle>Project</CardTitle>
        <CardBody>
          <div className="text-sm text-slate-200">{APP_KEY}</div>
          <div className="mt-1 text-xs text-muted">
            This UI is shared across your 8 repos, but renders domain demos per project.
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>What to show recruiters</CardTitle>
        <CardBody>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
            <li>Live URL + API docs</li>
            <li>Auth flow + RBAC endpoints</li>
            <li>Docker + migrations + CI badge</li>
          </ul>
        </CardBody>
      </Card>

      <div className="md:col-span-3">
        <Card>
          <CardTitle>Senior signals included</CardTitle>
          <CardBody>
            <div className="grid gap-3 md:grid-cols-3">
              <Badge>TypeScript + Tailwind</Badge>
              <Badge>React Query + caching</Badge>
              <Badge>Auth-ready API client</Badge>
              <Badge>Domain demos per repo</Badge>
              <Badge>Swagger link</Badge>
              <Badge>Deploy friendly</Badge>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border border-border bg-panel/70 p-4">{children}</section>;
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-semibold">{children}</h2>;
}
function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-2 text-sm ${className ?? ""}`}>{children}</div>;
}
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-xl border border-border bg-white/5 px-3 py-2 text-xs text-slate-100">
      {children}
    </span>
  );
}

