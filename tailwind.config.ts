import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        "border-active": "var(--border-active)",
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        accent: "var(--accent)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        foreground: "var(--text-primary)",
        secondary: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-primary)",
        },
        "muted-foreground": "var(--text-secondary)",
        
        // Compatibilidade com shadcn/ui
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-primary)",
        },
        popover: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-primary)",
        },
        muted: {
          DEFAULT: "var(--surface-2)",
          foreground: "var(--text-secondary)",
        },
        accent_compat: {
          DEFAULT: "var(--accent)",
          foreground: "#080808",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-bebas)", "system-ui", "sans-serif"],
      },
      boxShadow: {

      },
      lineClamp: {
        2: "2",
        3: "3",
      },
    },
  },

};

export default config;
