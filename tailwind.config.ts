import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213D",       // primary text / nav / dark surfaces
        royal: {
          DEFAULT: "#1E40AF", // welcome banner accent
          soft: "#DBE6FB",
        },
        paper: "#F6F4F1",     // app background
        card: "#FFFFFF",
        marigold: {
          DEFAULT: "#E8A33D", // sales / growth accent
          soft: "#FBEBD2",
        },
        emerald: {
          DEFAULT: "#1F9D6B", // profit / positive
          soft: "#DEF2E8",
        },
        rust: {
          DEFAULT: "#D65F4C", // debts / alerts
          soft: "#FBE4E0",
        },
        slate: {
          muted: "#6B7280",
          line: "#E7E4DF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.04), 0 8px 24px rgba(20,33,61,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
