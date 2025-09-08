/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1A73E8',
        'accent-blue': '#4285F4',
        'success-green': '#0F9D58',
        'warning-yellow': '#F4B400',
        'danger-red': '#DB4437',
        'neutral-bg': '#F5F5F5',
        'neutral-bg-dark': '#E0E0E0',
        'text-primary': '#3C4043'
      }
    }
  },
  plugins: [],
}