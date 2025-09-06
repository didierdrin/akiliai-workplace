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
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        admin: {
          bg: '#f8fafc',
          'sidebar-bg': '#047857',
          'card-bg': '#ffffff',
          border: '#e2e8f0',
          'text-primary': '#1e293b',
          'text-secondary': '#64748b',
        },
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-playfair)', 'serif'],
        'display': ['var(--font-playfair)', 'serif'],
        'body': ['var(--font-roboto)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-emerald-admin': 'linear-gradient(135deg, #047857 0%, #065f46 50%, #064e3b 100%)',
        'gradient-emerald-sidebar': 'linear-gradient(180deg, #047857 0%, #065f46 100%)',
        'gradient-emerald-card': 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        'gradient-emerald-accent': 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-emerald': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'admin': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'admin-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'admin-focus': '0 0 0 3px rgba(4, 120, 87, 0.2)',
      },
    },
  },
  plugins: [],
}

export default config
