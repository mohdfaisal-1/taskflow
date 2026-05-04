/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        'gradient-primary': 'linear-gradient(135deg, #667eea, #764ba2)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb, #f5576c)',
        'gradient-success': 'linear-gradient(135deg, #4facfe, #00f2fe)',
        'gradient-warning': 'linear-gradient(135deg, #43e97b, #38f9d7)',
        'gradient-danger': 'linear-gradient(135deg, #fa709a, #fee140)',
      },
      colors: {
        glass: {
          bg: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.15)',
        }
      }
    },
  },
  plugins: [],
}
