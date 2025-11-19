/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1a1410',
        'bg-secondary': '#2d2419',
        'bg-tertiary': '#3d2f1f',
        'text-primary': '#f5e6d3',
        'text-secondary': '#d4b896',
        'text-muted': '#a08968',
        'accent-warm': '#ff6b35',
        'accent-fire': '#ff8c42',
        'accent-ember': '#d96c2c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
