/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary indigo-purple from screenshot
        primary: {
          50:  "#eeeefd",
          100: "#d6d5fb",
          200: "#b3b1f8",
          300: "#9492f5",
          400: "#7370f2",
          500: "#5c59f0",
          600: "#4845d4",
          700: "#3633b8",
          800: "#27259c",
          900: "#1a1880",
        },
        // App background
        surface: {
          DEFAULT: "#f4f6f8",
          card:    "#ffffff",
          sidebar: "#ffffff",
          nav:     "#ffffff",
        },
        // Text
        ink: {
          primary:   "#1e2547",
          secondary: "#4a5568",
          muted:     "#929ab8",
          light:     "#c4c9d8",
        },
        // Status colors exactly from screenshot
        success: { DEFAULT: "#22c55e", light: "#dcfce7", dark: "#16a34a" },
        warning: { DEFAULT: "#f59e0b", light: "#fef3c7", dark: "#d97706" },
        danger:  { DEFAULT: "#ef4444", light: "#fee2e2", dark: "#dc2626" },
        info:    { DEFAULT: "#3b82f6", light: "#dbeafe", dark: "#2563eb" },
        purple:  { DEFAULT: "#8b5cf6", light: "#ede9fe", dark: "#7c3aed" },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl:  "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px 0 rgba(92,89,240,0.12)",
        sidebar: "2px 0 8px 0 rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
      },
    },
  },
  plugins: [],
}
