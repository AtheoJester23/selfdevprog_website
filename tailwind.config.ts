import type {Config} from "tailwindcss";
import typography from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
      "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    screens: {
      xxs: '360px',
      ...defaultTheme.screens
    },
    extend: {
      colors:{
        backdrop: 'rgba(0,0,0,0.7)'
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
    // require("tailwindcss-animate"),
    // typography,
  ],
}


export default config;
