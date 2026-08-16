/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        surface: {
          50: "var(--surface-50)",
          100: "var(--surface-100)",
          200: "var(--surface-200)",
          300: "var(--surface-300)",
        },
        border: {
          subtle: "var(--border-subtle)",
          highlight: "var(--border-highlight)",
        },
        accent: {
          DEFAULT: "var(--accent-color)",
          glow: "var(--accent-glow)",
          hover: "#0284c7",
        },
        muted: {
          DEFAULT: "var(--text-muted)",
          foreground: "var(--text-muted-foreground)",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      letterSpacing: {
        editorial: "-0.03em",
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
