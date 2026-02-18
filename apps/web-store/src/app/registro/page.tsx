"use client";

import { useRegister } from "@/features/auth/auth.hooks";
import { RegisterSchema, RegisterDto } from "shared-types";
import { CustomForm, FormInput, SubmitButton } from "@/components/forms";
import { Card } from "@/components/ui";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const registerMutation = useRegister();

  const handleSubmit = (data: RegisterDto) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a Inicio
        </Link>

        <Card className="p-8 border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h1>
            <p className="text-muted-foreground mt-2">Únete a Kuin-Twin y conecta con los mejores expertos.</p>
          </div>

          <CustomForm
            schema={RegisterSchema}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <FormInput
              name="displayName"
              label="Nombre Completo"
              placeholder="Tu nombre"
              required
            />
            <FormInput
              name="email"
              label="Correo Electrónico"
              placeholder="tu@email.com"
              type="email"
              required
            />
            <FormInput
              name="password"
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              type="password"
              required
            />

            {registerMutation.isError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                Hubo un error al registrarte. Intenta con otro correo.
              </div>
            )}

            <SubmitButton loading={registerMutation.isPending} className="mt-4">
              Registrarme
            </SubmitButton>
          </CustomForm>

          <p className="text-center text-sm text-muted-foreground mt-8">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
