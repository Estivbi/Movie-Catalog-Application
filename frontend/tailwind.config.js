/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Paleta Netflix x Apple del spec
      colors: {
        // Fondos
        'bg-primary':    '#000000',
        'bg-secondary':  '#0A0A0A',
        'bg-elevated':   '#1A1A1A',
        'border-subtle': '#2A2A2A',
        // Acento Netflix rojo
        accent:          '#E50914',
        'accent-hover':  '#F40612',
        // Texto Apple
        'text-primary':  '#F5F5F7',
        'text-secondary':'#86868B',
        'text-tertiary': '#48484A',
        // Estados
        success:         '#30D158',
        error:           '#FF453A',
        star:            '#FFD60A',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        'hero':    ['56px', { fontWeight: '700', letterSpacing: '-0.02em' }],
        'section': ['24px', { fontWeight: '600', letterSpacing: '-0.01em' }],
        'body':    ['17px', { fontWeight: '400', lineHeight: '1.6' }],
        'label':   ['12px', { fontWeight: '500', letterSpacing: '0.08em' }],
      },
      spacing: {
        // Sistema de 8px del spec
        '2': '8px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
      },
      borderRadius: {
        card: '12px',
        pill: '9999px',
        modal: '16px',
      },
      transitionTimingFunction: {
        // Curva Apple/Material del spec
        apple: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        // Entrada de cards con stagger
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Skeleton shimmer
        shimmer: {
          '0%':   { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Fade simple para transiciones de página
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'shimmer':    'shimmer 2s infinite linear',
        'fade-in':    'fadeIn 0.2s ease-out',
      },
      backgroundImage: {
        // Gradiente de hero tipo Netflix
        'hero-gradient': 'linear-gradient(to right, rgba(0,0,0,0.9) 40%, transparent)',
        'hero-bottom':   'linear-gradient(to top, #000 10%, transparent)',
        // Overlay de card en hover
        'card-overlay':  'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'card-hover': '0 20px 60px rgba(0,0,0,0.8)',
        'nav':        '0 1px 0 rgba(255,255,255,0.05)',
        'modal':      '0 32px 80px rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [],
};
