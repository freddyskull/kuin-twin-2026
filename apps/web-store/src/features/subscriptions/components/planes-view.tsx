"use client";

import React from "react";
import { motion } from "framer-motion";
import { PricingPlans } from "./pricing-plans";
import { Navbar } from "@/components/navbar";

export function PlanesView() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Orbs para estética premium */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 container-app pt-32 pb-32">
        {/* Header de la Página */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Elige el plan <span className="text-primary italic font-serif">perfecto</span> para ti
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Desde emprendedores individuales hasta grandes empresas, tenemos una solución diseñada para potenciar tu presencia y ventas.
          </p>
        </motion.div>

        {/* Componente de Planes */}
        <PricingPlans />

        {/* Sección de FAQ Básica o Footer de Planes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-muted-foreground">
            ¿Tienes dudas sobre los planes? {" "}
            <a href="/contacto" className="text-primary font-bold hover:underline">
              Contacta con nuestro equipo de ventas
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
