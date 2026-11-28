/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#0F2A5C',
          950: '#071B3A',
        },
        emerald: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#0F2A5C',
          950: '#071B3A',
        },
        teal: {
          50: '#F5F9FF',
          100: '#E8F1FF',
          200: '#C7DFFB',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2F80ED',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#153A75',
          900: '#0F2A5C',
          950: '#071B3A',
        },
        slate: {
          50: '#F5F9FF',
          100: '#E8EEF7',
          200: '#D5E1F0',
          300: '#B4C6DE',
          400: '#8299B8',
          500: '#5B7599',
          600: '#3E587C',
          700: '#294266',
          800: '#172C4D',
          850: '#10233F',
          900: '#0A1A33',
          950: '#050F20',
        },
        navy: {
          800: '#172C4D',
          900: '#0A1A33',
          950: '#050F20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
