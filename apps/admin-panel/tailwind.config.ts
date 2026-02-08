import type { Config } from "tailwindcss";
import sharedConfig from "../../libs/ui-components/tailwind.config";

const config: Config = {
    presets: [sharedConfig],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../libs/ui-components/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dashboard: {
                    bg: "#0a0b1e",
                    sidebar: "#11122d",
                    card: "#1a1c3d",
                    border: "rgba(255, 255, 255, 0.05)",
                    primary: "#f5c06a",
                    secondary: "#94a3b8",
                }
            },
            borderRadius: {
                "3xl": "2rem",
                "4xl": "2.5rem",
            },
            boxShadow: {
                'gold-glow': '0 0 20px rgba(245, 192, 106, 0.2)',
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
