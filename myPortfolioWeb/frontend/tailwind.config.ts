import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0a0e27',
          blue: '#1e3a8a',
          silver: '#c0c0c0',
          vibrant: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
export default config
