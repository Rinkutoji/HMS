/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6f8',
          100: '#e4e9ee',
          200: '#c9d3dc',
          300: '#a3b4c2',
          400: '#7690a3',
          500: '#57748a',
          600: '#455d71',
          700: '#394c5c',
          800: '#32414d',
          900: '#2c3843',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
