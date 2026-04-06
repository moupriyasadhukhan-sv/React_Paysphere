/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add PaySphere brand colors here
        brand: "#2563eb", 
      },
    },
  },
  plugins: [],
}