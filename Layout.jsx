/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        military: {
          900: '#0a0f0d',
          800: '#111a14',
          700: '#1a2e1e',
          600: '#1f3a24',
          500: '#2d5a34',
          400: '#3d7a46',
          300: '#4d9a58',
          200: '#6db87a',
          100: '#a8d5b0',
          50:  '#e8f5ea'
        },
        khaki: {
          900: '#2d2a1e',
          800: '#3d3820',
          700: '#5a5228',
          600: '#7a6e34',
          500: '#9a8a40',
          400: '#c4b050',
          300: '#d4c46e',
          200: '#e4d898',
          100: '#f0e8c0',
          50:  '#faf6e8'
        },
        danger: '#dc2626',
        warning: '#d97706',
        info: '#0891b2'
      },
      fontFamily: {
        military: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace']
      }
    }
  },
  plugins: []
};
