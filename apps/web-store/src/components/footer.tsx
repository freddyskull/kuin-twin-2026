"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { ThemeToggle } from "./theme-toggle";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // No mostrar footer en auth pages
  const isAuthPage = pathname === "/login" || pathname === "/registro";
  if (isAuthPage) return null;

  return (
    <footer className="relative bg-background border-t border-border/40 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-app py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
              KUIN<span className="text-foreground">TWIN</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              La plataforma definitiva para conectar con servicios premium y profesionales de confianza en tu área. Calidad garantizada en cada reserva.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Plataforma</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Explorar Servicios
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Precios y Planes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  Unete como Profesional
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Garantía Kuin-Twin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">Ciudad de México, México<br />Paseo de la Reforma 222</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">+52 (55) 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">hola@kuintwin.com</span>
              </li>
            </ul>
            <div className="pt-2">
              <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary hover:text-primary gap-2">
                Hablemos <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © {currentYear} Kuin-Twin. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="h-4 w-px bg-border/40" />
            <Link href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Español (MX)</Link>
            <div className="h-4 w-px bg-border/40" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Sistemas Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
