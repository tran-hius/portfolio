/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050507",
        surface: {
          50: "#14141c",
          100: "#0e0e14",
          200: "#09090d",
          300: "#050507",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.07)",
          highlight: "rgba(255, 255, 255, 0.15)",
        },
        accent: {
          DEFAULT: "#38bdf8", // Ice Sky / Cyan
          glow: "rgba(56, 189, 248, 0.15)",
          hover: "#0ea5e9",
        },
        muted: {
          DEFAULT: "#8f909e",
          foreground: "#a1a1aa",
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

