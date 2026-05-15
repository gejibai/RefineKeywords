import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        apple: "28px"
      },
      boxShadow: {
        soft: "0 18px 48px rgba(0,0,0,.08)",
        card: "0 10px 28px rgba(0,0,0,.06)"
      }
    }
  },
  plugins: []
};

export default config;
