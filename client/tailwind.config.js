/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#CCFF00',
        'electric-blue': '#00D9FF',
        'dark-bg': '#0a0a0a',
        'dark-card': '#1a1a1a',
        'dark-border': '#2a2a2a',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
      },
      backdropFilter: {
        'glass': 'backdrop-filter: blur(10px)',
      }
    },
  },
  plugins: [],
}
