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
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            }
        }
    }
};

export default config;
