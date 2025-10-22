// import { space } from 'postcss/lib/list';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#000000"
      },
      fontFamily:{
        space: ["Space Grotesk", "san-serif"]
      },
    },
  },
  plugins: [],
}