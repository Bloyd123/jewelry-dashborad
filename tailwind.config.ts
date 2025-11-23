import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C158",
          dark: "#B8960F",
        },
        charcoal: {
          DEFAULT: "#2C3E50",
          dark: "#1A252F",
        },
        gray: {
          dark: "#495057",
          light: "#E9ECEF",
        },
        success: "#28A745",
        danger: "#DC3545",
        warning: "#FFC107",
        info: "#17A2B8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
      boxShadow: {
        sm: "0 2px 4px rgba(44, 62, 80, 0.08)",
        md: "0 4px 6px rgba(44, 62, 80, 0.12)",
        lg: "0 10px 20px rgba(44, 62, 80, 0.15)",
        xl: "0 20px 40px rgba(44, 62, 80, 0.2)",
        gold: "0 4px 12px rgba(212, 175, 55, 0.3)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
} 
export default config;
