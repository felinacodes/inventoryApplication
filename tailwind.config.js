/** @type {import('tailwindcss').Config} */
module.exports = {
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
        }
      }
    },
  },
  plugins: [],
}