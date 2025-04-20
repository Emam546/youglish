/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        print: { raw: 'print' },
        screen: { raw: 'screen' }
      },
      colors: {
        background: '#F0F0F0',
        'secondary-color': '#E6E6E6',
        'secondary-color-disabled': 'rgba(208, 208, 208, 1)',
        black: '#000',
        white: '#fff'
      }
    }
  },
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  plugins: []
}
