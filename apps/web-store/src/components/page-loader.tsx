'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const PageLoader = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Background Stars/Particles */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className={`absolute top-[20%] left-[30%] w-1.5 h-1.5 rounded-full animate-pulse blur-[1px] ${isDark ? 'bg-white' : 'bg-primary'}`} />
        <div className={`absolute top-[60%] left-[80%] w-1 h-1 rounded-full animate-pulse delay-700 blur-[1px] ${isDark ? 'bg-white' : 'bg-primary'}`} />
        <div className={`absolute top-[40%] left-[10%] w-2 h-2 rounded-full animate-pulse delay-1000 blur-[2px] ${isDark ? 'bg-white' : 'bg-primary'}`} />
        <div className={`absolute bottom-[20%] left-[50%] w-1 h-1 rounded-full animate-pulse delay-1500 blur-[1px] ${isDark ? 'bg-white' : 'bg-primary'}`} />
      </div>

      <div className="relative flex items-center justify-center z-10 scale-125">
        {/* Rotating Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-40 h-40 border-t-2 border-b-2 border-primary/40 rounded-full blur-[2px]"
        />
        
        {/* Counter-Rotating Inner Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-28 h-28 border-l-2 border-r-2 border-primary/70 rounded-full"
        />

        {/* Central Moving Orb */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            boxShadow: [
              "0 0 20px rgba(245,192,106,0.2)",
              isDark ? "0 0 60px rgba(245,192,106,0.6)" : "0 0 40px rgba(245,192,106,0.8)",
              "0 0 20px rgba(245,192,106,0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/40 relative z-20 border-4 border-white/20"
        >
          <span className="text-black font-black text-3xl font-heading">K</span>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16 text-center"
      >
        <h2 className="text-sm font-black uppercase tracking-[0.5em] text-primary animate-pulse font-heading">
          Cargando Experiencia
        </h2>
        <div className="flex gap-2 justify-center mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3] 
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                delay: i * 0.15,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(245,192,106,0.5)]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
