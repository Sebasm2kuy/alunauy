/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '96': '24rem',
        '120': '30rem',
      },
      height: {
        '96': '24rem', 
        '120': '30rem',
      }
    },
  },
  plugins: [],
};
