import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#0D0D0F',
          surface:  '#141416',
          elevated: '#1C1C1F',
          overlay:  '#242428',
        },
        accent: {
          DEFAULT: '#E8C97A',
          hover:   '#D4B568',
          muted:   '#8A6E4A',
        },
        content: {
          primary:   '#F0EDE8',
          secondary: '#A09990',
          tertiary:  '#5E5852',
        },
        border: {
          subtle: '#232320',
          medium: '#2E2D28',
        },
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        serif:   ['"Playfair Display"', 'serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
      },
      keyframes: {
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'loading-bar': 'loading-bar 2s ease-in-out infinite',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config


