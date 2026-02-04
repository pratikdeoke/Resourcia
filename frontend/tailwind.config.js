/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classy professional palette
        primary: {
          DEFAULT: "#0f172a", // Slate 900
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f1f5f9", // Slate 100
          foreground: "#0f172a",
        },
        accent: {
          DEFAULT: "#6366f1", // Indigo 500
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}