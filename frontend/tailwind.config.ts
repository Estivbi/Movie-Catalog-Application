import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        surface: '#0b1020',
        surfaceElevated: '#11172b',
        border: 'rgba(148, 163, 184, 0.16)',
        text: '#e5eefc',
        muted: '#9fb2d0',
        accent: '#f97316',
        accentSoft: '#fb923c',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(249, 115, 22, 0.18), 0 20px 60px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'cinema-radial': 'radial-gradient(circle at top, rgba(249, 115, 22, 0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.08), transparent 35%)',
      },
    },
  },
  plugins: [],
} satisfies Config;