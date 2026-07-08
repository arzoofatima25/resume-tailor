import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        accent: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
        success: { 500: "#10b981", 600: "#059669" },
        warning: { 500: "#f59e0b", 600: "#d97706" },
        danger: { 500: "#f43f5e", 600: "#e11d48" },
        surface: {
          light: "#fbfbfe",
          "light-raised": "#ffffff",
          dark: "#0b0c14",
          "dark-raised": "#12131f",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)",
        "gradient-mesh":
          "radial-gradient(at 20% 20%, rgba(79,70,229,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(124,58,237,0.2) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(6,182,212,0.2) 0px, transparent 50%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.25)",
        soft: "0 4px 24px rgba(15, 15, 35, 0.06)",
        "soft-dark": "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
