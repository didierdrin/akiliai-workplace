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
      },
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-playfair)', 'serif'],
        'display': ['var(--font-playfair)', 'serif'],
        'reading': ['var(--font-lora)', 'serif'],
      },
      backgroundImage: {
        'gradient-emerald-angular': 'linear-gradient(135deg, #047857 0%, #065f46 50%, #064e3b 100%)',
        'gradient-emerald-light': 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        'gradient-emerald-subtle': 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      clipPath: {
        'angular': 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)',
        'angular-reverse': 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
      },
    },
  },
  plugins: [],
}

export default config
