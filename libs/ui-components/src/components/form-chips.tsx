import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { X, Tag } from 'lucide-react';
import { Label } from './ui/label';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FormChipsProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const FormChips: React.FC<FormChipsProps> = ({
  name,
  label,
  placeholder = "Presiona Enter o coma para agregar...",
  className,
  required,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [inputValue, setInputValue] = useState('');
  const error = errors[name];

  return (
    <div className={cn("grid gap-2", className)}>
      <Label
        className={cn("text-xs font-bold text-slate-500 uppercase tracking-wider", error && "text-red-500")}
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const chips = Array.isArray(field.value) ? field.value : [];

          const addChip = (value: string) => {
            const trimmed = value.trim().replace(/,$/, '');
            if (trimmed && !chips.includes(trimmed)) {
              field.onChange([...chips, trimmed]);
            }
            setInputValue('');
          };

          const removeChip = (chipToRemove: string) => {
            field.onChange(chips.filter((chip: string) => chip !== chipToRemove));
          };

          const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addChip(inputValue);
            } else if (e.key === 'Backspace' && !inputValue && chips.length > 0) {
              removeChip(chips[chips.length - 1]);
            }
          };

          return (
            <div className="space-y-3">
              <div
                className={cn(
                  "flex flex-wrap gap-2 p-1.5 min-h-[52px] bg-[#0a0b1e]/60 border border-white/10 rounded-xl transition-all focus-within:ring-2 focus-within:ring-dashboard-primary/50",
                  error && "border-red-500 focus-within:ring-red-500/50"
                )}
              >
                <AnimatePresence>
                  {chips.map((chip: string) => (
                    <motion.div
                      key={chip}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-dashboard-primary/10 border border-dashboard-primary/20 rounded-lg group"
                    >
                      <span className="text-xs font-bold text-dashboard-primary tracking-wide">{chip}</span>
                      <button
                        type="button"
                        onClick={() => removeChip(chip)}
                        className="text-dashboard-primary/50 hover:text-dashboard-primary transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <input
                  id={name}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => inputValue && addChip(inputValue)}
                  placeholder={chips.length === 0 ? placeholder : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none p-2 text-sm text-white placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2 px-1">
                <Tag className="h-3 w-3 text-slate-600" />
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                  {chips.length} etiquetas agregadas
                </span>
              </div>
            </div>
          );
        }}
      />

      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error.message as string}
        </p>
      )}
    </div>
  );
};
