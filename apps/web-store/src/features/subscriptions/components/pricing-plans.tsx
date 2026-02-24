"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PricingCard } from "./pricing-card";

const SUBSCRIPTION_PLANS = [
  {
    title: "Semilla",
    price: "$0",
    description: "Ideal para quienes están comenzando y quieren probar la plataforma.",
    features: [
      "Perfil básico de prestador",
      "1 publicación activa",
      "Soporte por correo",
      "Visibilidad estándar"
    ],
    isPopular: false
  },
  {
    title: "Pro",
    price: "$499 MXN",
    description: "Desbloquea el potencial máximo de tu negocio con herramientas avanzadas.",
    features: [
      "Perfil verificado",
      "Publicaciones ilimitadas",
      "Estadísticas en tiempo real",
      "Soporte prioritario 24/7",
      "Destacados en resultados"
    ],
    isPopular: true
  },
  {
    title: "Enterprise",
    price: "$999 MXN",
    description: "Soluciones personalizadas para grandes empresas y agencias.",
    features: [
      "Todo lo incluido en Pro",
      "Reportes personalizados",
      "Acceso a la API",
      "Gestor de cuenta preventa",
      "Contratos personalizados"
    ],
    isPopular: false
  }
];

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = (planTitle: string) => {
    setLoadingPlan(planTitle);
    // Simulación de carga
    setTimeout(() => {
      setLoadingPlan(null);
      alert(`Has seleccionado el plan ${planTitle}. Redirigiendo al pago...`);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ staggerChildren: 0.15 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-12"
    >
      {SUBSCRIPTION_PLANS.map((plan) => (
        <motion.div
          key={plan.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <PricingCard
            {...plan}
            loading={loadingPlan === plan.title}
            onSelect={() => handleSelectPlan(plan.title)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
