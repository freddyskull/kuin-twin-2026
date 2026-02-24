import { Metadata } from "next";
import { PlanesView } from "@/features/subscriptions";

export const metadata: Metadata = {
  title: "Planes de Suscripción | Kuin-Twin",
  description: "Elige el plan que mejor se adapte a tus necesidades y comienza a escalar tu negocio en Kuin-Twin.",
};

export default function PlanesPage() {
  return <PlanesView />;
}
