import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── upscpath.com semantic tokens (dark mode values, our default) ──────
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        elevated: 'var(--elevated)',
        border:   'var(--border)',
        text:     'var(--text)',
        'text-2': 'var(--text-2)',
        'text-3': 'var(--text-3)',

        // ── Brand palette (upscpath.com exact tokens) ─────────────────────────
        amber: {
          DEFAULT: 'var(--amber)',
          hover:   'var(--amber-hover)',
          tint:    'var(--amber-tint)',
          on:      'var(--amber-on)',
        },
        terra: {
          DEFAULT: 'var(--terra)',
          tint:    'var(--terra-tint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          tint:    'var(--accent-tint)',
          on:      'var(--accent-on)',
        },
        success: {
          DEFAULT: 'var(--success)',
          tint:    'var(--success-tint)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          tint:    'var(--warning-tint)',
        },
        error: {
          DEFAULT: 'var(--error)',
          tint:    'var(--error-tint)',
        },

        // ── Legacy aliases kept for backward compat ────────────────────────────
        saffron: {
          50:  '#fff8f0',
          100: '#ffecd1',
          200: '#ffd494',
          300: '#ffb84d',
          400: 'var(--amber)',      // remapped to upscpath amber
          500: 'var(--amber)',
          600: 'var(--amber-hover)',
          700: '#b84400',
        },
        navy: {
          900:  '#1e1c1a',
          950:  'var(--bg)',
        },
        jade: {
          400: 'var(--success)',
          500: 'var(--success)',
        },
      },

      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        heading: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },

      borderRadius: {
        'md':  '0.375rem',
        'lg':  '0.5rem',
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      animation: {
        'pulse-fast':  'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float':       'float 3s ease-in-out infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
