import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        // Warm, handcrafted palette — clay terracotta accent, sage, warm cream
        clay: {
          50: '#fbf3ee',
          100: '#f6e4d8',
          200: '#ecc6ad',
          300: '#e0a380',
          400: '#d17d52',
          500: '#c2611f',
          600: '#a94e18',
          700: '#8a3e16',
          800: '#6f3318',
          900: '#5b2c17',
        },
        sage: {
          100: '#e7ece2',
          300: '#aebf9c',
          500: '#7d9466',
          700: '#566b45',
        },
        cream: {
          DEFAULT: '#f7f3ec',
          100: '#fbf8f2',
          200: '#efe8db',
        },
        ink: '#2b2622',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(24px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
