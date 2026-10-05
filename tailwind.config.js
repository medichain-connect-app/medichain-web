/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#246BFD',
          dark: '#1B4FD8',
          darker: '#1340B0',
          light: '#4D8AFD',
          lighter: '#7AABFE',
          tint: '#EBF1FF',
          surface: '#F5F8FF',
          glow: 'rgba(36,107,253,0.15)',
        },
        accent: {
          red: '#EF4444',
          warning: '#F59E0B',
          emerald: '#10B981',
          violet: '#8B5CF6',
          rose: '#F43F5E',
          cyan: '#06B6D4',
        },
        success: '#10B981',
        surface: { DEFAULT: '#F8FAFC', alt: '#F1F5F9' },
        border: { DEFAULT: '#E2E8F0', strong: '#CBD5E1', light: '#F1F5F9' },
        txt: { primary: '#0F172A', secondary: '#64748B', tertiary: '#94A3B8', inverse: '#FFFFFF' },
      },
      borderRadius: {
        '4xl': '28px',
        '3xl': '22px',
        '2xl': '18px',
        xl: '14px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(36,107,253,0.12)',
        'glow-lg': '0 0 80px rgba(36,107,253,0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.06)',
        'float': '0 20px 60px rgba(0,0,0,0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(36,107,253,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(36,107,253,0.25)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(36,107,253,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(16,185,129,0.05) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
