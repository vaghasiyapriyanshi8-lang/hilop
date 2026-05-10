import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        surface: '#050505',
      },
    },
  },
  plugins: [],
} satisfies Config;
