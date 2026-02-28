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
        navy: "#1a1f35",
        "accent-red": "#e74c3c",
        "step-blue": "#3b82f6",
        "step-blue-light": "#dbeafe",
        "step-amber": "#f59e0b",
        "step-amber-light": "#fef3c7",
        "step-pink": "#ec4899",
        "step-pink-light": "#fce7f3",
        "body-text": "#374151",
        "muted-text": "#6b7280",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "corporate"],
  },
};
export default config;
