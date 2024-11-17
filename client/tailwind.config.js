/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D1D1D", // Background Black
        secondary: "#2D2D2D", // Dark Gray
        accent: "#FF5C5C",   // Red accent
        textPrimary: "#FFFFFF", // White
        textSecondary: "#B0B0B0", // Gray text
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
}

