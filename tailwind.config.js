/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#e8f4ff',
          100: '#d1e9ff',
          200: '#a3d3ff',
          300: '#75bcff',
          400: '#47a6ff',
          500: '#1990ff',  // Do (Important & Urgent)
          600: '#0073e6',
          700: '#0059b3',
          800: '#004080',
          900: '#00264d',
        },
        'secondary': {
          50: '#e6faff',
          100: '#ccf5ff',
          200: '#99ebff',
          300: '#66e0ff',
          400: '#33d6ff',
          500: '#00ccff',  // Decide (Important & Not Urgent)
          600: '#00b8e6',
          700: '#008fb3',
          800: '#006680',
          900: '#003d4d',
        },
        'accent': {
          50: '#fff3e6',
          100: '#ffe7cc',
          200: '#ffcf99',
          300: '#ffb766',
          400: '#ff9f33',
          500: '#ff8700',  // Delegate (Not Important & Urgent)
          600: '#e67a00',
          700: '#b35f00',
          800: '#804400',
          900: '#4d2900',
        },
        'error': {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000',  // Delete (Not Important & Not Urgent)
          600: '#e60000',
          700: '#b30000',
          800: '#800000',
          900: '#4d0000',
        },
        'warning': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};