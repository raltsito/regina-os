/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta personalizada
        'regina-bg': '#FDFBF7',
        'regina-dark': '#121212',
        'pastel-pink': '#FFD6E0',
        'pastel-blue': '#C1E7F5',
        'pastel-green': '#D0F0C0',
        'pastel-purple': '#E2CBF7',
      },
      fontFamily: {
        sans: ['"Nunito"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}