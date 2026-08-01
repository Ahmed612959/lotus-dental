/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Lotus brand palette — grounded in the plant itself, not generic medical teal
        cream: '#FAF7F2', // warm ivory background
        ink: '#14231C', // near-black with a green undertone, used for body text
        lotus: {
          50: '#EEF5F0',
          100: '#D8E9DD',
          200: '#B3D3BE',
          400: '#5C9273',
          600: '#2E6B4C',
          700: '#1F4D3D', // primary brand green — deep lotus leaf
          800: '#173A2E',
          900: '#102820',
        },
        petal: {
          100: '#FBEEEA',
          200: '#F0C9C0', // signature accent — soft lotus petal pink, used sparingly
          400: '#E0A599',
          600: '#C97C6C',
        },
        gold: '#C9A45C', // rare highlight for premium touches (badges, ratings)
      },
      fontFamily: {
        displayAr: ['"Cairo"', 'sans-serif'],
        displayEn: ['"Fraunces"', 'serif'],
        bodyAr: ['"Tajawal"', 'sans-serif'],
        bodyEn: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        petal: '50% 0% 50% 50%', // used only for the signature petal motif element
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(20, 35, 28, 0.08)',
        card: '0 8px 30px -8px rgba(20, 35, 28, 0.12)',
      },
      keyframes: {
        bloom: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        bloom: 'bloom 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
