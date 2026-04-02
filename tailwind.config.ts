import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  '#fff8f0',
          100: '#ffecd1',
          200: '#ffd494',
          300: '#ffb84d',
          400: '#ff9a1f',
          500: '#ff7c00',
          600: '#e05f00',
          700: '#b84400',
          800: '#943400',
          900: '#792b00',
        },
        navy: {
          50:  '#eef2ff',
          100: '#d4defd',
          200: '#aabefb',
          300: '#7094f8',
          400: '#3e64f3',
          500: '#1a3de4',
          600: '#1230c4',
          700: '#0d229e',
          800: '#0a1a7a',
          900: '#060f52',
          950: '#03082e',
        },
        jade: {
          400: '#22c55e',
          500: '#16a34a',
          600: '#15803d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'xp-fill': 'xpFill 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        xpFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
