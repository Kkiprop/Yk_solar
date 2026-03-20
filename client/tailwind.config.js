export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#0f172a',
          green: '#7bc043',
          moss: '#dcf1c8',
          leaf: '#507f2d',
          cream: '#f7fbf4',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 60px rgba(32, 54, 27, 0.12)',
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(circle at top left, rgba(123, 192, 67, 0.18), transparent 32%)',
        'brand-linear': 'linear-gradient(180deg, #fdfefc 0%, #f3f8ef 100%)',
      },
    },
  },
  plugins: [],
};
