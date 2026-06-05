/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#f8f2e8',
        porcelain: '#fffaf1',
        champagne: '#e7d5b8',
        parchment: '#efe4d2',
        sand: '#d9c2a2',
        espresso: '#14110f',
        ink: '#211b17',
        taupe: '#7d6b5a',
        bronze: '#9b734c',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        editorial: '0 28px 70px rgba(36, 26, 18, 0.14)',
        soft: '0 18px 45px rgba(42, 30, 20, 0.09)',
      },
      backgroundImage: {
        'paper-grain':
          'radial-gradient(circle at 20% 20%, rgba(155, 115, 76, 0.08), transparent 28%), radial-gradient(circle at 80% 0%, rgba(231, 213, 184, 0.5), transparent 34%)',
      },
    },
  },
  plugins: [],
};
