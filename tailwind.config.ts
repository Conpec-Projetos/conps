import type { Config } from "tailwindcss";

import { nextui } from "@nextui-org/react";

const Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./src/assets/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)"],
        poppins: ["var(--font-poppins)"],
        lato: ["var(--font-lato)"],
      },
      colors: {
        orange: {
          conpec: "#F66C0E"
        }
      },
      dropShadow: {
        white: [
          "0 0px 20px rgba(255,255, 255, 0.45)",
          "0 0px 65px rgba(255, 255,255, 0.4)",
        ],
        orange: [
          "0 0px 20px rgba(246, 108, 14, 0.45)",
          "0 0px 65px rgba(246, 108, 14, 0.4)",
        ],
      },
      caretColor: {
        transparent: "transparent",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: "rgba(60, 47, 47, 1)",
            secondary: "#6A6A6A",
          },
        },
      },
    }),
  ],
};

export default Config;