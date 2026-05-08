/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      colors: {
        'apple-blue': '#007AFF',
      },
      boxShadow: {
        'apple-glow':
          '0 0 0 1.5px #007AFF, 0 0 16px 2px rgba(0, 122, 255, 0.4)',
      },
      backdropBlur: {
        glass: '24px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
