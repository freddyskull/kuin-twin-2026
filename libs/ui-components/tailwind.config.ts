import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        // Primary = Dorado / Gold (accento principal del dashboard)
        primary: {
          DEFAULT: "#FBBF24",
          foreground: "#000000",
          dark: "#D97706",
        },

        // Secondary = Azul KUIN (ya lo tenías, lo mantengo y amplío)
        secondary: {
          DEFAULT: "#0EA5E9",
          foreground: "#ffffff",
          dark: "#0878B8",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },

        // Card = Fondo glassmorphism futurista (semi-transparente oscuro)
        card: {
          DEFAULT: "rgba(0, 0, 0, 0.4)", // Equivalente a bg-black/40
          foreground: "#ffffff",
          border: "rgba(255, 255, 255, 0.1)", // Equivalente a border-white/10
        },

        // Colores personalizados adicionales del dashboard KUIN TWIN
        kuin: {
          blue: "#0EA5E9",
          "blue-dark": "#1e40af",
          gold: "#FBBF24",
          "gold-dark": "#D97706",
          bg: "#0a0a1a",
          "bg-via": "#0f172a",
          "bg-to": "#1e1b4b",
          "grid": "#334155",
          "text-secondary": "#64748b",
          "text-muted": "#cbd5e1",
        },

        // Fondos del dashboard (para gradientes espaciales)
        "dashboard-bg": "#0a0a1a",
        "sidebar-bg": "rgba(0, 0, 0, 0.4)",
        "header-bg": "rgba(0, 0, 0, 0.3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",     // Para tarjetas más redondeadas (rounded-3xl ≈ 1.5rem)
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
      backdropBlur: {
        xl: "24px", // backdrop-blur-xl personalizado para glassmorphism fuerte
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      backgroundImage: {
        "gradient-dashboard":
          "linear-gradient(to bottom right, #0a0a1a, #0f172a, #1e1b4b)",
        "gradient-logo":
          "linear-gradient(to bottom right, #0EA5E9, #1e40af)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;