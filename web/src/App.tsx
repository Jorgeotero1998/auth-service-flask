import { useEffect, useState } from "react";
import { getHealth } from "./api";

export function App() {
  const [health, setHealth] = useState<string>("loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then((d) => setHealth(d.status))
      .catch((e) => setError(String(e?.message ?? e)));
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Portfolio Demo</h1>
        <p>React (Vite) frontend calling the API backend.</p>
      </header>

      <section className="card">
        <h2>API Health</h2>
        {error ? <p className="error">{error}</p> : <p className="ok">{health}</p>}
      </section>

      <section className="card">
        <h2>Next steps</h2>
        <ul>
          <li>Set <code>VITE_API_BASE_URL</code> for your deployed API.</li>
          <li>Pin this repo with links: Live / API Docs / Repo.</li>
        </ul>
      </section>
    </div>
  );
}

