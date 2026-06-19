import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#08080f',
        'bg-elevated': '#0e0e1a',
        'bg-card': 'rgba(255,255,255,0.04)',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'border-medium': 'rgba(255,255,255,0.12)',
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(ellipse 70% 60% at 70% 30%, rgba(124,58,237,0.22) 0%, transparent 70%)',
        'cta-glow': 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(5deg) rotateY(-8deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(5deg) rotateY(-8deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
