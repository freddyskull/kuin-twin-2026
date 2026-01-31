import type { Config } from "tailwindcss";
import sharedConfig from "../../libs/ui-components/tailwind.config";

const config: Config = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../libs/ui-components/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
