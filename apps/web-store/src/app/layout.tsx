import type { Metadata } from "next";
import { Ubuntu, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Footer } from "@/components/footer";
import { BackgroundOrbs } from "@/components/background-orbs";
import { ScrollTop } from "@/components/scroll-top";

/* Fuente moderna y tecnológica para títulos */
const ubuntu = Ubuntu({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

/* Fuente sans-serif moderna para cuerpo y UI */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kuin-Twin | Servicios Premium",
  description: "Encuentra los mejores servicios cerca de ti con Kuin-Twin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${ubuntu.variable} ${jakarta.variable} font-sans antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <BackgroundOrbs />
            <ScrollTop />
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
