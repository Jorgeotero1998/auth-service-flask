import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B1020",
        panel: "rgba(255,255,255,0.06)",
        border: "rgba(255,255,255,0.12)",
        muted: "#B7C4E6",
        brand: "#7C5CFF"
      }
    }
  },
  plugins: []
} satisfies Config;

