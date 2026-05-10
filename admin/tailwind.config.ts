import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/layouts/**/*.{ts,tsx}',
  ],
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
