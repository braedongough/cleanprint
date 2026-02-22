/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,ts,jsx,js,html}"],
  theme: {
    extend: {
      fontFamily: {
        georgia: ["Georgia", "serif"],
        garamond: ["Garamond", "EB Garamond", "serif"],
        baskerville: ["Libre Baskerville", "serif"],
        "source-serif": ["Source Serif 4", "Source Serif Pro", "serif"],
        charter: ["Charter", "Bitstream Charter", "serif"],
      },
    },
  },
  plugins: [],
};
