/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0a0a16",
        darkCard: "rgba(18, 18, 38, 0.7)",
        customNeonIndigo: "#6366f1",
        customNeonCyan: "#06b6d4",
        customNeonEmerald: "#10b981",
        customNeonRose: "#f43f5e",
        // New Taxaformer Light Theme
        taxaLight: "#e3f0fa",
        taxaBlue: "#0b84ff",
        taxaNavy: "#0e1327",
        taxaButton: "#111827",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        neonCyan: '0 0 15px rgba(6, 182, 212, 0.4)',
        neonIndigo: '0 0 15px rgba(99, 102, 241, 0.4)',
        neonEmerald: '0 0 15px rgba(16, 185, 129, 0.4)',
        neonRose: '0 0 15px rgba(244, 63, 94, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
