import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Executive Monolith Surface Hierarchy ── */
        surface: {
          DEFAULT: '#f9f9fc',
          dim: '#d9d9dc',
          'container-low': '#f3f3f6',
          'container-lowest': '#ffffff',
          'container-high': '#e8e8ea',
          'container-highest': '#e2e2e5',
        },
        primary: {
          DEFAULT: '#001736',
          container: '#002b5b',
          fixed: '#d6e3ff',
          'fixed-dim': '#aac7ff',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#16a34a',
          container: '#dcfce7',
          'on-container': '#14532d',
          foreground: '#ffffff',
        },
        tertiary: {
          DEFAULT: '#d97706',
          container: '#fef3c7',
          'on-container': '#78350f',
        },
        error: {
          DEFAULT: '#dc2626',
          container: '#fee2e2',
          'on-container': '#7f1d1d',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        'on-surface': '#1a1c1e',
        'on-surface-variant': '#44474e',
        outline: '#74777f',
        'outline-variant': '#c4c6d0',
        'ai-accent': '#7c3aed',

        /* ── Backward-compatible RAG colors ── */
        'rag-red': '#dc2626',
        'rag-amber': '#d97706',
        'rag-green': '#16a34a',

        /* ── Shadcn/ui compatible mappings ── */
        border: '#c4c6d0',
        input: '#c4c6d0',
        ring: '#001736',
        background: '#f9f9fc',
        foreground: '#1a1c1e',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1a1c1e',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1a1c1e',
        },
        muted: {
          DEFAULT: '#f3f3f6',
          foreground: '#44474e',
        },
        accent: {
          DEFAULT: '#e8e8ea',
          foreground: '#1a1c1e',
        },
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      boxShadow: {
        ambient: '0 12px 40px rgba(26, 28, 30, 0.06)',
        glass: '0 8px 32px rgba(26, 28, 30, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
