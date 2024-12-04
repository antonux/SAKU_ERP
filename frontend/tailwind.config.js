/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Adds Inter as the primary sans font
      },
       transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}