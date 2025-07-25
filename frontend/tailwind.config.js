/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FD0000",
          light: "#FF4D4D", // Hover or lighter version
          foreground: "#FFFFFF", // white text on red
        },
        secondary: {
          DEFAULT: "#000000",
          light: "#333333", // Hover or lighter version
          foreground: "#FFFFFF", // white text on black
        },
        border: "#E5E5E5",
        input: "#E5E5E5",
        ring: "#0A0A0A",
        background: "#FFFFFF",
        foreground: "#0A0A0A",
        destructive: {
          DEFAULT: "#FF4747",
          foreground: "#FAFAFA",
        },
        muted: {
          DEFAULT: "#F5F5F5",
          foreground: "#737373",
        },
        accent: {
          DEFAULT: "#F5F5F5",
          foreground: "#171717",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A0A0A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A0A0A",
        },
        dark: {
          DEFAULT: "#171717",
          light: "#262626",
        },
        light: {
          DEFAULT: "#F5F5F5",
          dark: "#E5E5E5",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "hero-pattern": "url('/img/hero-pattern.svg')",
        "login-bg":
          "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
