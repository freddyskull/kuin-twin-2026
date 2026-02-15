import { ServiceSlot } from '@prisma/client';

/**
 * Genera un slug basado en el título con un sufijo aleatorio para evitar colisiones
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .normalize('NFD') // Normalizar para separar acentos de las letras
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/[^\w-]+/g, '') // Eliminar caracteres no permitidos
    .replace(/--+/g, '-') // Eliminar guiones dobles
    .replace(/^-+/, '') // Eliminar guiones al principio
    .replace(/-+$/, '') + // Eliminar guiones al final
    '-' + Math.random().toString(36).substring(2, 7);
};

/**
 * Transforma los slots del DTO al formato que espera Prisma
 */
export const transformSlots = (slots: any[]): any[] => {
  return (slots || []).map((slot: any) => {
    // Si el slot ya tiene startTime/endTime de tipo Date (porque viene de DB), usarlos
    if (slot.startTime instanceof Date || (typeof slot.startTime === 'string' && slot.startTime.includes('T'))) {
      return {
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        isRecurring: !!slot.isRecurring,
        status: slot.status || 'AVAILABLE',
      };
    }

    // Si viene del formulario con formato 'Monday', '09:00', usar la lógica de generación
    const now = new Date();
    const dayMap: Record<string, number> = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    const targetDay = dayMap[slot.day];
    if (targetDay === undefined) return null;

    const currentDay = now.getDay();
    const daysUntil = (targetDay + 7 - currentDay) % 7;
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + daysUntil);
    const [startH, startM] = slot.startTime.split(':');
    startDate.setHours(parseInt(startH), parseInt(startM), 0, 0);

    const endDate = new Date(startDate);
    const [endH, endM] = slot.endTime.split(':');
    endDate.setHours(parseInt(endH), parseInt(endM), 0, 0);

    return {
      startTime: startDate,
      endTime: endDate,
      isRecurring: !!slot.isRecurring,
      status: 'AVAILABLE'
    };
  }).filter(Boolean);
};
