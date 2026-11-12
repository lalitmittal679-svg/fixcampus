/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F7F7F4',
        ink: '#202B3C',
        muted: '#7C8490',
        brand: { DEFAULT: '#174C40', soft: '#E4F0EA', dark: '#10382F' },
        accent: { DEFAULT: '#416FAD', soft: '#E6EEF8' },
        warn: { DEFAULT: '#E9A66B', soft: '#FFF1E3', text: '#B5692A' },
        danger: { DEFAULT: '#D66A62', soft: '#FBEAE8' },
        line: '#E9EAE7',
      },
      fontFamily: { sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { xl: '12px', '2xl': '14px' },
      boxShadow: { card: '0 1px 2px rgba(32,43,60,0.04), 0 4px 14px rgba(32,43,60,0.04)' },
    },
  },
  plugins: [],
}
