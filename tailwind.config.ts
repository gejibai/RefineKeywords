import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        apple: "28px"
      },
      boxShadow: {
        soft: "0 18px 42px rgba(74, 94, 61, .14)",
        card: "0 10px 24px rgba(78, 101, 68, .12)",
        island: "0 7px 0 rgba(121, 82, 45, .16), 0 18px 34px rgba(75, 96, 62, .12)"
      }
    }
  },
  plugins: []
};

export default config;
