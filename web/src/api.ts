const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function getHealth() {
  const r = await fetch(`${API_BASE_URL}/health`);
  if (!r.ok) throw new Error(`Health failed: ${r.status}`);
  return (await r.json()) as { status: string };
}

