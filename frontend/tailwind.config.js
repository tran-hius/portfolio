/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "#ec4899", /* Pink 500 */
          foreground: "#ffffff",
        },
        brand: "#f472b6", /* Pink 400 */
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        cyber: "#ec4899", /* Fallback for older classes */
      },
      fontFamily: {
        sans: ['"Chakra Petch"', "sans-serif"],
        tech: ['"Chakra Petch"', "sans-serif"],
        display: ['"Teko"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

