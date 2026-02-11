import React from 'react';
import { LoginForm } from '@/features/auth/loginForm';
import logo from '@assets/logo-kuin-twin.svg';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="grid min-h-svh lg:grid-cols-2 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="text-foreground flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-40 w-auto absolute top-10 left-1/2 -translate-x-1/2" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm bg-card/30 backdrop-blur-md p-6 rounded-md border border-border/50">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/admin/login-image3.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] "
        />
      </div>
    </motion.div>
  );
};
