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
        band: v("band"), "band-2": v("band-2"), "band-ink": v("band-ink"), "band-muted": v("band-muted"),
        gold: v("gold"), "gold-soft": v("gold-soft"), sun: v("sun"),
        ok: v("ok"), "ok-soft": v("ok-soft"), warn: v("warn"), "warn-soft": v("warn-soft"),
        bad: v("bad"), "bad-soft": v("bad-soft"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-text)", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
        mono: ["var(--font-text)", "system-ui", "sans-serif"],
      },
      maxWidth: { page: "1120px" },
    },
  },
  plugins: [],
} satisfies Config;
