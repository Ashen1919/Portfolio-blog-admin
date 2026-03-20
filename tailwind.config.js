/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sidebar: {
          DEFAULT: '#0f1117',
          hover: '#1a1d27',
          border: '#1e2130',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          light: '#818cf8',
          muted: 'rgba(99,102,241,0.15)',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
          border: '#e2e8f0',
        },
        ink: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
          subtle: '#94a3b8',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideInLeft: 'slideInLeft 0.3s ease-out',
        shimmer: 'shimmer 2s infinite linear',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#0f172a',
            a: { color: '#6366f1' },
            h1: { color: '#0f172a' },
            h2: { color: '#0f172a' },
            h3: { color: '#0f172a' },
          },
        },
      },
    },
  },
  plugins: [],
}
