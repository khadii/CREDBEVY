import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        text: "var(--color-text)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],

      },
      screens: {
        sm: "772px", // Custom sm breakpoint at 772px
        md: "1040px", // Custom md breakpoint at 1040px
        lg: "1350px", // Custom lg breakpoint (Set this to your desired value)
      },
    },
  },
  plugins: [],
} satisfies Config;
