'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="mt-12 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Preguntas Frecuentes</h2>
      </div>

      <div className="grid gap-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={cn(
              "group border rounded-2xl transition-all duration-300 overflow-hidden",
              openIndex === index
                ? "bg-card border-primary/20 shadow-xl shadow-primary/5"
                : "bg-card/40 dark:bg-card/20 border-border/40 hover:border-primary/20 hover:bg-card/60 dark:hover:bg-card/40"
            )}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors"
            >
              <span className={cn(
                "font-bold text-sm md:text-base pr-4 transition-colors",
                openIndex === index ? "text-primary" : "text-foreground"
              )}>
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0",
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
                  <div className="px-5 pb-5 text-sm md:text-base text-muted-foreground leading-relaxed border-t border-border/10 pt-4">
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
