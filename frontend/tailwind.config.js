/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0073ea',
        primaryHover: '#0060b9',
        bgBody: '#f5f6f8',
        bgCard: '#ffffff',
        textMain: '#323338',
        textMuted: '#676879',
        danger: '#e2445c',
        success: '#00c875',
        warning: '#fdab3d',
        borderC: '#e6e9ef',
      },
      fontFamily: {
        sans: ['"Figtree"', '"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
