/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        // A cor de início foi alterada para um tom mais escuro
        'dark-gradient': 'linear-gradient(to bottom, #000000, #040923ff)',
      }
    },
  },
  plugins: [],
}