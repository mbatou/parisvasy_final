import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vermillion: {
          DEFAULT: "#E8432A",
          50: "#FDF0ED",
          100: "#FBDDD7",
          200: "#F6B8AB",
          300: "#F1937F",
          400: "#EC6B54",
          500: "#E8432A",
          600: "#C93420",
          700: "#9A2718",
          800: "#6B1B11",
          900: "#3C0F09",
        },
        navy: {
          DEFAULT: "#0F1B2D",
          50: "#E8EBF0",
          100: "#C5CDD8",
          200: "#8B9BB1",
          300: "#51698A",
          400: "#304057",
          500: "#0F1B2D",
          600: "#0D1726",
          700: "#0A111D",
          800: "#070C14",
          900: "#03060A",
        },
        cream: {
          DEFAULT: "#FAFAF7",
          50: "#FFFFFF",
          100: "#FAFAF7",
          200: "#F0F0E8",
          300: "#E6E6D9",
        },
        ink: {
          DEFAULT: "#111110",
          50: "#E8E8E7",
          100: "#D1D1CF",
          200: "#A3A3A0",
          300: "#757571",
          400: "#474742",
          500: "#111110",
        },
        champagne: {
          DEFAULT: "#C9A84C",
          50: "#FAF5E8",
          100: "#F2E6C4",
          200: "#E5CD89",
          300: "#D9B56E",
          400: "#C9A84C",
          500: "#B08E32",
          600: "#8A6F27",
        },
        sage: {
          DEFAULT: "#5A7A5E",
          50: "#EDF2ED",
          100: "#D4E0D5",
          200: "#A9C1AB",
          300: "#7EA281",
          400: "#5A7A5E",
          500: "#456048",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
