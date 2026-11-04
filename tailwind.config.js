/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F6F0',
        'background-secondary': '#F1EEE6',
        card: '#FFFFFF',
        text: {
          main: '#292820',
          secondary: '#858276',
        },
        primary: {
          DEFAULT: '#74866B',
          hover: '#617258',
          light: '#E7EDE2',
        },
        border: {
          DEFAULT: '#E9E5DC',
          dark: '#D8D2C4',
        },
        status: {
          success: '#6F8F70',
          warning: '#C49A59',
          error: '#B96C64',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '10px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(41, 40, 32, 0.04), 0 1px 2px -1px rgba(41, 40, 32, 0.04)',
        card: '0 4px 12px 0 rgba(41, 40, 32, 0.05)',
        elevated: '0 12px 28px -4px rgba(41, 40, 32, 0.08)',
      },
    },
  },
  plugins: [],
};
