/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'White': '#F1FAEE',
        'LightBlue': '#A8DADC',
        'DarkBlue': '#1D3557',
        'Red': '#E63946',
        'Blue': '#457B9D',
      },boxShadow: {
        '3xl': '0.3vw 0.3vw 0.3vw rgba(0, 0, 0, 0.3)',
      }
    }
  },
  plugins: [],
}