/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Wedding theme colors - Premium palette
        primary: {
          50: '#fdf8f6',
          100: '#f9ebe5',
          200: '#f3d5c9',
          300: '#e9b8a3',
          400: '#dc9276',
          500: '#cf7352',
          600: '#bc5c3d',
          700: '#9c4a32',
          800: '#813f2d',
          900: '#6b3729',
          950: '#3a1a13',
        },
        secondary: {
          50: '#f8f7f4',
          100: '#efede6',
          200: '#ddd9cc',
          300: '#c7c0ab',
          400: '#afa388',
          500: '#9d8d6e',
          600: '#907d62',
          700: '#786752',
          800: '#635547',
          900: '#52473c',
          950: '#2c251f',
        },
        // Gold accent for premium feel
        gold: {
          50: '#fdfbf7',
          100: '#faf5eb',
          200: '#f3e8d3',
          300: '#e8d5b0',
          400: '#d4b896',
          500: '#c9a87c',
          600: '#b8956a',
          700: '#9a7a55',
          800: '#7d6347',
          900: '#66513b',
        },
      },
      fontFamily: {
        // Korean-friendly fonts
        sans: ['Pretendard', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif KR', 'Georgia', 'serif'],
      },
      screens: {
        /**
         * Mobile-first breakpoints
         * Requirements 9.1: 모바일 우선 반응형 디자인 (320px ~ 768px 최적화)
         * 
         * xs: 375px - iPhone SE, small phones
         * sm: 640px - Large phones, small tablets
         * md: 768px - Tablets
         * lg: 1024px - Small laptops
         * xl: 1280px - Desktops
         * 2xl: 1536px - Large desktops
         */
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        // Safe area insets for notched devices
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        /**
         * Touch-friendly spacing
         * Requirements 9.2: 터치 친화적 UI (최소 44px 터치 타겟)
         */
        '11': '2.75rem', // 44px - minimum touch target
        '12': '3rem',    // 48px - comfortable touch target
        '13': '3.25rem', // 52px - large touch target
      },
      minHeight: {
        /**
         * Touch target minimum heights
         * Requirements 9.2: 터치 친화적 UI (최소 44px 터치 타겟)
         */
        'touch': '44px',
        'touch-lg': '48px',
      },
      minWidth: {
        /**
         * Touch target minimum widths
         * Requirements 9.2: 터치 친화적 UI (최소 44px 터치 타겟)
         */
        'touch': '44px',
        'touch-lg': '48px',
      },
      fontSize: {
        /**
         * Responsive font sizes
         * Base size is 16px to prevent iOS zoom on input focus
         */
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        /**
         * Responsive border radius
         */
        'responsive': 'clamp(0.5rem, 2vw, 1rem)',
      },
      boxShadow: {
        /**
         * Subtle shadows for cards
         */
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'reveal': 'reveal 0.8s ease-out forwards',
        'stagger': 'stagger 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}
