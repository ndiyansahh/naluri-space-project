import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    { pattern: /^bg-naluri-teal$/ },
    { pattern: /^text-naluri-teal$/ },
  ],

  theme: {
    extend: {
      colors: {
        "naluri-teal": "#1A95A8",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
