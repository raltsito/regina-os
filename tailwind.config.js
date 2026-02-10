/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Configuramos Lora como la fuente principal
        serif: ['Lora', 'serif'],
        sans: ['Lora', 'serif'], // Forzamos Lora en todo
      },
      colors: {
        // PALETA LOYAL PINK
        'loyal-cream': '#FAF2DD',   // Fondo principal
        'loyal-pink-light': '#F4C5D7', 
        'loyal-pink-mid': '#F9ADB7',
        'loyal-peach': '#FEC9C3',   // Color "Pop"
        'loyal-pink-dark': '#E981A4', // Para botones o acentos fuertes
        
        // Color de texto oscuro para contraste (Vino oscuro)
        'loyal-text': '#5D3A44', 
      }
    },
  },
  plugins: [],
}