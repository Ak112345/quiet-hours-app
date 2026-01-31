import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        sage: {
          50: '#f6f8f7',
          100: '#e8ede9',
          200: '#d1dbd3',
          300: '#aabfae',
          400: '#7d9d82',
          500: '#5e8163',
          600: '#4a6750',
          700: '#3c5341',
          800: '#324436',
          900: '#2a382d',
        },
      },
    },
  },
  plugins: [],
};

export default config;
