/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#9333EA',
      },
      spacing: {
        128: '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    import('@tailwindcss/forms').then(module => module.default),
    import('@tailwindcss/typography').then(module => module.default),
    require('tailwind-scrollbar-hide'),
    // Other plugins here
  ],
}
