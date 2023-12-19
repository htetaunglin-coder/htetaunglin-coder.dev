/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "flat-black": "#0a0a0a",
        pink: "#c5a0a0",
        secondary: "#131313",
        "pale-pink": "#806868",
        "light-blue": "#8f8bb4",
        "dark-pink": "#9e5e5e",
        "navy-blue": "#46427c",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        righteous: ["Righteous", "cursive"],
        dmSans: ["DM Sans", "sans-serif"],
      },
    },
    aspectRatio: {
      "4/3": "4 / 3",
    },
    screens: {
      xxs: "26.25rem",
      xs: "30rem",
      ss: "38.75rem",
      sm: "48rem",
      smd: "60rem",
      md: "66.25rem",
      lg: "75rem",
      xl: "106.25rem",
    },
  },
  plugins: [],
};
