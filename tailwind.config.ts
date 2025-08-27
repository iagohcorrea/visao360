import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        lora: ['var(--font-lora)', 'serif'],
        caveat: ['var(--font-caveat)', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;
