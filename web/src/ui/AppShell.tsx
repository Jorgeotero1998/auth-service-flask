import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { clearToken, openSwagger } from "../api";
import { cn } from "../lib/cn";
import { LayoutDashboard, LogIn, PlayCircle, BookOpen, LogOut } from "lucide-react";

const APP_NAME = (import.meta.env.VITE_APP_NAME as string | undefined) ?? "Portfolio App";

export function AppShell() {
  const nav = useNavigate();

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start gap-5">
          <aside className="hidden w-64 shrink-0 rounded-2xl border border-border bg-panel/70 p-4 md:block">
            <div className="mb-4">
              <div className="text-sm text-muted">Demo project</div>
              <div className="text-lg font-semibold">{APP_NAME}</div>
            </div>

            <nav className="space-y-1">
              <SideLink to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <SideLink to="/demo" icon={<PlayCircle size={18} />} label="Domain demo" />
              <SideLink to="/login" icon={<LogIn size={18} />} label="Login" />
              <button
                className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
                onClick={() => openSwagger()}
              >
                <BookOpen size={18} />
                API Docs
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
                onClick={() => {
                  clearToken();
                  nav("/login");
                }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          <main className="flex-1">
            <header className="mb-5 flex items-center justify-between rounded-2xl border border-border bg-panel/70 px-4 py-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted">Full Stack Demo</div>
                <div className="text-base font-semibold">{APP_NAME}</div>
              </div>
              <div className="flex items-center gap-2">
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl border border-border bg-white/5 px-3 py-2 text-sm hover:bg-white/10",
                      isActive && "bg-white/10"
                    )
                  }
                  to="/login"
                >
                  <span className="inline-flex items-center gap-2">
                    <LogIn size={16} />
                    Login
                  </span>
                </NavLink>
                <button
                  className="rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
                  onClick={() => openSwagger()}
                >
                  API Docs
                </button>
              </div>
            </header>

            <Outlet />

            <footer className="mt-6 text-xs text-muted">
              Tip: set <code className="rounded bg-white/10 px-1 py-0.5">VITE_API_BASE_URL</code> to your deployed API.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

function SideLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/10",
          isActive && "bg-white/10"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

