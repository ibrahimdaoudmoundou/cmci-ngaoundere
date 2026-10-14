import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"), surface: v("surface"), "surface-2": v("surface-2"),
        ink: v("ink"), muted: v("muted"), line: v("line"),
        green: v("green"), "green-2": v("green-2"), "on-green": v("on-green"),
        band: v("band"), "band-ink": v("band-ink"), "band-muted": v("band-muted"),
        gold: v("gold"), "gold-soft": v("gold-soft"), sun: v("sun"),
        ok: v("ok"), "ok-soft": v("ok-soft"), warn: v("warn"), "warn-soft": v("warn-soft"),
        bad: v("bad"), "bad-soft": v("bad-soft"),
      },
      fontFamily: {
        display: ["Marcellus", "Georgia", "serif"],
        sans: ["'Public Sans'", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "Menlo", "monospace"],
      },
      maxWidth: { page: "1120px" },
    },
  },
  plugins: [],
} satisfies Config;
