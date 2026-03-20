import React, { useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Calendar, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label, Switch } from 'ui-components';
import type { ServiceFormValues } from '../schema';

const DAYS = [
  { key: 'Monday', label: 'Lunes' },
  { key: 'Tuesday', label: 'Martes' },
  { key: 'Wednesday', label: 'Miércoles' },
  { key: 'Thursday', label: 'Jueves' },
  { key: 'Friday', label: 'Viernes' },
  { key: 'Saturday', label: 'Sábado' },
  { key: 'Sunday', label: 'Domingo' },
];

const MOCK_HOLIDAYS = [
  { date: '2024-01-01', name: 'Año Nuevo' },
  { date: '2024-05-01', name: 'Día del Trabajo' },
  { date: '2024-07-20', name: 'Día de la Independencia' },
  { date: '2024-12-25', name: 'Navidad' },
];

export const ServiceAvailabilityStep: React.FC = () => {
  const { register, watch, setValue, control } = useFormContext<ServiceFormValues>();

  // Initialize schedule if empty
  const schedule = watch('workSchedule.schedule');
  const holidayRules = watch('workSchedule.holidayRules');

  useEffect(() => {
    if (!schedule || schedule.length === 0) {
      const defaultSchedule = DAYS.map(day => ({
        day: day.key,
        enabled: day.key !== 'Saturday' && day.key !== 'Sunday',
        startTime: '09:00',
        endTime: '18:00'
      }));
      setValue('workSchedule.schedule', defaultSchedule);
    }
  }, [schedule, setValue]);

  // Helper to toggle holiday
  const toggleHoliday = (date: string) => {
    const currentWhitelist = holidayRules?.whitelist || [];
    const currentBlacklist = holidayRules?.blacklist || [];
    const workHolidays = holidayRules?.workHolidays;

    if (workHolidays) {
      // If working holidays, list contains EXCEPTIONS (blacklist)
      if (currentBlacklist.includes(date)) {
        setValue('workSchedule.holidayRules.blacklist', currentBlacklist.filter((d: string) => d !== date));
      } else {
        setValue('workSchedule.holidayRules.blacklist', [...currentBlacklist, date]);
      }
    } else {
      // If NOT working holidays, list contains EXCEPTIONS (whitelist)
      if (currentWhitelist.includes(date)) {
        setValue('workSchedule.holidayRules.whitelist', currentWhitelist.filter((d: string) => d !== date));
      } else {
        setValue('workSchedule.holidayRules.whitelist', [...currentWhitelist, date]);
      }
    }
  };

  const isHolidayWorked = (date: string) => {
    const workHolidays = holidayRules?.workHolidays;
    const whitelist = holidayRules?.whitelist || [];
    const blacklist = holidayRules?.blacklist || [];

    if (workHolidays) {
      return !blacklist.includes(date);
    } else {
      return whitelist.includes(date);
    }
  };

  return (
    <motion.section
      key="step5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-accent/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Horario de Trabajo</h2>
      </div>

      <div className="space-y-6">
        {/* Weekly Schedule */}
        <div className="space-y-4">
          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Agenda Semanal</Label>
          <div className="grid gap-3">
            {schedule && schedule.map((item: any, index: number) => {
              const dayLabel = DAYS.find(d => d.key === item.day)?.label || item.day;
              return (
                <div key={item.day} className={`p-4 rounded-xl border transition-all ${item.enabled ? 'bg-[#0a0b1e]/60 border-primary/30' : 'bg-[#0a0b1e]/20 border-white/5 opacity-60'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 w-32">
                      <Controller
                        name={`workSchedule.schedule.${index}.enabled`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <span className={`text-sm font-bold ${item.enabled ? 'text-white' : 'text-slate-500'}`}>{dayLabel}</span>
                    </div>

                    {item.enabled && (
                      <div className="flex items-center gap-2 flex-1 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center gap-2 bg-[#1a1c3d] px-3 py-1.5 rounded-lg border border-white/5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <input
                            type="time"
                            {...register(`workSchedule.schedule.${index}.startTime`)}
                            className="bg-transparent text-white text-xs font-bold focus:outline-none"
                          />
                        </div>
                        <span className="text-slate-600 font-bold">-</span>
                        <div className="flex items-center gap-2 bg-[#1a1c3d] px-3 py-1.5 rounded-lg border border-white/5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <input
                            type="time"
                            {...register(`workSchedule.schedule.${index}.endTime`)}
                            className="bg-transparent text-white text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Holidays Configuration */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Configuración de Feriados</Label>
            <div className="flex items-center gap-4">
              <Label className="text-[10px] font-bold text-slate-400">¿TRABAJAR FERIADOS?</Label>
              <Controller
                name="workSchedule.holidayRules.workHolidays"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {MOCK_HOLIDAYS.map(holiday => {
              const worked = isHolidayWorked(holiday.date);
              return (
                <div
                  key={holiday.date}
                  onClick={() => toggleHoliday(holiday.date)}
                  className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition-all group ${worked ? 'bg-primary/10 border-primary/30' : 'bg-[#0a0b1e]/30 border-white/5'}`}
                >
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${worked ? 'text-white' : 'text-slate-500'}`}>{holiday.name}</span>
                    <span className="text-[10px] text-slate-600">{holiday.date}</span>
                  </div>
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all ${worked ? 'bg-primary text-primary border-primary' : 'bg-transparent border-white/10 text-transparent'}`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 italic text-center pt-2">
            * Selecciona los días específicos que {holidayRules?.workHolidays ? 'NO' : 'SÍ'} deseas trabajar.
          </p>
        </div>
      </div>
    </motion.section>
  );
};
