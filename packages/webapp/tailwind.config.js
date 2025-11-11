import daisyui from "daisyui";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { titillium: ["Titillium Web", "sans-serif"] },
    },
  },
  daisyui: {
    themes: [
      {
        italia: {
          "color-scheme": "light",
          primary: "#0066CC",
          "primary-content": "#fff",

          secondary: "#5D7083",
          "secondary-focus": "#bd0091",
          "secondary-content": "#fff",

          accent: "#0158B3",
          "accent-focus": "#F2F7FC",
          "accent-content": "#fff",

          neutral: "#262626",
          "neutral-focus": "#5c6f82",
          "neutral-content": "#fff",

          "base-100": "#fff",
          "base-200": "#F2F7FC",
          "base-300": "#f8f8f8",
          "base-content": "#1f1f1f",

          info: "#0066CC",
          success: "#008055",
          warning: "#CC7A00",
          error: "#CC334D",
        },
      },
      "light",
    ],
    // darkTheme: "dracula", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  plugins: [forms, typography, daisyui],
};
