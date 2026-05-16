/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6', // Purple
        primaryHover: '#7c3aed', 
        secondary: '#3b82f6', // Blue
        bgBody: '#0f172a', // Deep slate for main background
        bgCard: '#1e293b', // Lighter slate for cards
        sidebarBg: '#0b0f19', // Very dark/almost black for sidebar
        textMain: '#f8fafc', // White text
        textMuted: '#94a3b8', // Muted text
        danger: '#ef4444', // Red
        success: '#10b981', // Green
        warning: '#f59e0b', // Yellow
        borderC: 'rgba(255, 255, 255, 0.08)', // Light border
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'glow-primary': '0 0 15px rgba(139, 92, 246, 0.5)',
        'glow-success': '0 0 15px rgba(16, 185, 129, 0.5)',
        'glow-danger': '0 0 15px rgba(239, 68, 68, 0.5)',
      }
    },
  },
  plugins: [],
}
