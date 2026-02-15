/**
 * Sanitiza un objeto JSON eliminando llaves de Prototype Pollution
 * y limpiando strings de posibles inyecciones de script.
 */
export const sanitizeJsonObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeJsonObject);
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    // Usamos Object.keys para evitar iterar sobre propiedades heredadas
    Object.keys(obj).forEach(key => {
      // 1. Prevenir Prototype Pollution
      if (['__proto__', 'constructor', 'prototype'].includes(key)) return;
      
      sanitized[key] = sanitizeJsonObject(obj[key]);
    });
    return sanitized;
  }

  if (typeof obj === 'string') {
    // 2. Sanitización básica de strings
    return obj
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
      .replace(/on\w+="[^"]*"/gim, "")
      .trim();
  }

  return obj;
};

