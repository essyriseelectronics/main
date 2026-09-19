import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Fallback if not using src/
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4B0082", // Deep Royal Purple
          secondary: "#6A0DAD", 
          accent: "#FF007F", // Vibrant Pink/Magenta CTA
          coral: "#FF7F50", // Badges/Highlights
          charcoal: "#333333", // Text
          surface: "#F9FAFB", // Backgrounds
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [], // We will add @tailwindcss/forms later when building the admin
};
export default config;
