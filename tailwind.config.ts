import type { Config } from "tailwindcss";

/* Direction « Bulletin d'église » (magazine-societe) — voir DIRECTION.md.
   Les noms historiques (green, gold, sun…) pointent tous vers les tokens sémantiques. */
const c = (name: string) => `oklch(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", sm: "2px", DEFAULT: "2px", md: "2px", lg: "2px", xl: "2px", "2xl": "2px", full: "9999px" },
    extend: {
      colors: {
        bg: c("bg"), surface: c("surface"), "surface-2": c("surface-2"),
        ink: c("ink"), muted: c("muted"), line: c("line"), rule: c("rule"), field: c("field"),
        accent: c("accent"), "accent-2": c("accent-2"), "on-accent": c("on-accent"), "accent-soft": c("accent-soft"),
        green: c("accent"), "green-2": c("accent-2"), "on-green": c("on-accent"),
        gold: c("accent"), "gold-soft": c("accent-soft"), sun: c("accent"),
        band: c("ink"), "band-ink": c("bg"), "band-muted": c("rule"),
        ok: c("ok"), "ok-soft": c("ok-soft"), warn: c("warn"), "warn-soft": c("warn-soft"),
        bad: c("bad"), "bad-soft": c("bad-soft"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        read: ["var(--font-read)", "Georgia", "serif"],
        sans: ["var(--font-text)", "system-ui", "-apple-system", "'Segoe UI'", "sans-serif"],
        mono: ["var(--font-text)", "system-ui", "sans-serif"],
      },
      maxWidth: { page: "1180px" },
      transitionTimingFunction: { out: "cubic-bezier(0.2, 0, 0, 1)" },
    },
  },
  plugins: [],
} satisfies Config;
