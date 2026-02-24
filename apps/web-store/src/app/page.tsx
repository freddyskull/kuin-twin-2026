"use client";

import { motion } from "framer-motion";
import { Button } from '@/components/ui';
import { ArrowRight, Star, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useServices, ServiceCard } from "@/features/services";
import { useAuthStore } from "@/features/auth/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Navbar } from "@/components/navbar";

export default function Home() {
  const { data: services, isLoading, isError } = useServices();
  const { user, logout } = useAuthStore();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 container-app pt-20 pb-32 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20"
        >
          <Star className="w-3 h-3 fill-primary" />
          <span>LO MEJOR DE 2026 EN SERVICIOS LOCALES</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Encuentra la <span className="text-primary italic font-serif">excelencia</span> a la vuelta de la esquina.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Kuin-Twin conecta a los mejores profesionales con personas que buscan un servicio impecable. Rápido, seguro y cerca de ti.
        </motion.p>

        {/* Search Bar Premium */}
        <motion.div
          className="w-full max-w-3xl p-2 bg-card border border-border shadow-2xl rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="¿Qué servicio necesitas hoy?"
              className="bg-transparent border-none outline-none w-full text-base py-3"
            />
          </div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ubicación"
              className="bg-transparent border-none outline-none w-full text-base py-3"
            />
          </div>
          <Button className="w-full md:w-auto rounded-full py-6 px-8 text-lg gap-2 shadow-lg shadow-primary/20">
            Buscar
          </Button>
        </motion.div>

        {/* Featured Cards - Dynamic Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 w-full text-left"
        >
          <h2 className="text-2xl font-bold mb-8 pl-2 border-l-4 border-primary">Populares cerca de ti</h2>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-card border animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-20 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
              <p>Hubo un error al cargar los servicios. Por favor intenta más tarde.</p>
            </div>
          )}

          {!isLoading && !isError && services && services.length > 0 && (
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {services.map((service, i) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && !isError && (!services || services.length === 0) && (
            <div className="text-center py-20 opacity-60">
              <p>No se encontraron servicios disponibles en este momento.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
