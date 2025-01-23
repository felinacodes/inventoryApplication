/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './views/**/*.ejs',
    './public/**/*.html',
    './src/**/*.js',
    './src/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFBB5C',
          DEFAULT: '#FF9B50',
          dark: '#E25E3E',
        },
        secondary: {
          DEFAULT: '#C63D2F',
        },
        background: {
          DEFAULT: '#F7F7F7',
          darkBG: '#161617'
        },
      },
      textStroke: {
        '1': '1px',
        '2': '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-stroke-1': {
          '-webkit-text-stroke-width': '1px',
          'text-stroke-width': '1px',
        },
        '.text-stroke-2': {
          '-webkit-text-stroke-width': '2px',
          'text-stroke-width': '2px',
        },
        '.text-stroke-white': {
          '-webkit-text-stroke-color': '#ffffff',
          'text-stroke-color': '#ffffff',
        },
        '.text-stroke-black': {
          '-webkit-text-stroke-color': '#000000',
          'text-stroke-color': '#000000',
        },
        '.text-stroke-orange': {
          '-webkit-text-stroke-color': '#FFA500',
          'text-stroke-color': '#FFA500',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}