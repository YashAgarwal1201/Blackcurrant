/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        color1: "var(--color1)",
        color2: "var(--color2)",
        color3: "var(--color3)",
        color4: "var(--color4)",
        color5: "var(--color5)",
      },
      fontFamily: {
        heading: ["var(--heading)"],
        subHeading: ["var(--subHeading)"],
        content: ["var(--content)"],
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
