/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",           // nếu dùng Vite
    "./src/**/*.{js,ts,jsx,tsx}", // nếu dùng React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
