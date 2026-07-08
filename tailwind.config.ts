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
        pv: {
          black: "#0A0A0A",
          "black-90": "#141414",
          "black-80": "#1C1C1C",
          "black-70": "#252525",
          "black-60": "#333333",
        },
        gold: {
          DEFAULT: "#C6A55C",
          light: "#D4B976",
          pale: "#E8D5A0",
          glow: "rgba(198, 165, 92, 0.15)",
          "glow-subtle": "rgba(198, 165, 92, 0.06)",
        },
        cream: {
          DEFAULT: "#F5F0E8",
          dark: "#E8E0D0",
        },
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
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
      },
      letterSpacing: {
        luxury: "0.2em",
        wide: "0.15em",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
