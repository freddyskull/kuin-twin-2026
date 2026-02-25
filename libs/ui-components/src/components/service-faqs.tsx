'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceFaqsProps {
  faqs: FaqItem[];
}

export const ServiceFaqs = ({ faqs }: ServiceFaqsProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Preguntas Frecuentes</h2>
      </div>

      <div className="grid gap-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={cn(
              "group border rounded-2xl transition-all duration-300 overflow-hidden",
              openIndex === index
                ? "bg-card border-primary/20 shadow-lg shadow-primary/5"
                : "bg-card/50 border-border/50 hover:border-primary/30"
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors"
            >
              <span className={cn(
                "font-bold text-xs md:text-sm pr-4 transition-colors",
                openIndex === index ? "text-primary" : "text-slate-300"
              )}>
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-300 shrink-0",
                  openIndex === index && "rotate-180 text-primary"
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-4 pb-4 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
