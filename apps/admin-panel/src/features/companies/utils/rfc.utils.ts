/**
 * Valida un RFC de México (Personas Físicas y Morales)
 * Morales: 12 caracteres
 * Físicas: 13 caracteres
 */
export const isValidRFC = (rfc: string): boolean => {
  const cleanRFC = rfc.trim().toUpperCase();
  
  // Regex para Personas Morales (12) y Físicas (13)
  const rfcRegex = /^(([A-ZÑ&]{3})([0-9]{2})([01][0-9])([0-3][0-9])([A-Z0-9]{3}))|(([A-ZÑ&]{4})([0-9]{2})([01][0-9])([0-3][0-9])([A-Z0-9]{3}))$/;
  
  return rfcRegex.test(cleanRFC);
};
