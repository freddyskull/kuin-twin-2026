const fs = require('fs');
const path = require('path');

// Leer el archivo legacy
const content = fs.readFileSync('index.legacy.ts', 'utf-8');

// Definir los dominios y sus patrones
const domains = {
  'auth': {
    patterns: ['User', 'Role'],
    enums: ['RoleSchema', 'RoleType']
  },
  'messaging': {
    patterns: ['Message'],
    enums: []
  },
  'media': {
    patterns: ['Media'],
    enums: []
  },
  'profiles': {
    patterns: ['Profile', 'PortfolioItem'],
    enums: []
  },
  'companies': {
    patterns: ['Company', 'Branch'],
    enums: []
  },
  'services': {
    patterns: ['Service', 'Category', 'ServiceUnit', 'ServiceMetadata'],
    enums: []
  },
  'bookings': {
    patterns: ['Booking', 'BookingDetails', 'ServiceSlot', 'BookingStatus', 'SlotStatus'],
    enums: ['BookingStatusSchema', 'BookingStatusType', 'SlotStatusSchema', 'SlotStatusType']
  },
  'payments': {
    patterns: ['Payment'],
    enums: []
  }
};

// Función para extraer esquemas de un modelo
function extractSchemasForPattern(content, pattern) {
  const schemas = [];
  const lines = content.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Buscar exports que contengan el patrón
    if (line.includes(`export const ${pattern}`) || line.includes(`export type ${pattern}`)) {
      const schemaLines = [line];
      let braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      i++;
      
      // Si es un tipo simple, solo tomar esa línea
      if (line.includes('export type') && line.includes('=') && braceCount === 0) {
        schemas.push(schemaLines.join('\n'));
        continue;
      }
      
      // Capturar el resto del esquema
      while (i < lines.length && (braceCount > 0 || !schemaLines[schemaLines.length - 1].trim().match(/[);}\]]$/))) {
        schemaLines.push(lines[i]);
        braceCount += (lines[i].match(/{/g) || []).length - (lines[i].match(/}/g) || []).length;
        i++;
        
        // Romper si encontramos una línea vacía después de cerrar
        if (braceCount === 0 && schemaLines[schemaLines.length - 1].trim() === '') {
          break;
        }
      }
      
      schemas.push(schemaLines.join('\n'));
    } else {
      i++;
    }
  }
  
  return schemas;
}

console.log("Extrayendo esquemas por dominio...\n");

// Crear directorios y archivos
for (const [domain, config] of Object.entries(domains)) {
  const domainDir = domain;
  if (!fs.existsSync(domainDir)) {
    fs.mkdirSync(domainDir, { recursive: true });
  }
  
  const allSchemas = [];
  
  // Extraer esquemas para cada patrón
  for (const pattern of config.patterns) {
    const schemas = extractSchemasForPattern(content, pattern);
    allSchemas.push(...schemas);
  }
  
  // Extraer enums específicos
  for (const enumName of config.enums) {
    const schemas = extractSchemasForPattern(content, enumName);
    allSchemas.push(...schemas);
  }
  
  if (allSchemas.length > 0) {
    // Crear archivo del dominio
    const domainFile = path.join(domainDir, 'index.ts');
    
    const fileContent = `import { z } from 'zod';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import {
  DecimalJsLikeSchema,
  isValidDecimalInput,
  JsonValueSchema,
  InputJsonValueSchema,
  NullableJsonNullValueInputSchema,
  JsonNullValueInputSchema,
  JsonNullValueFilterSchema,
} from '../common';

/////////////////////////////////////////
// ${domain.toUpperCase()} DOMAIN
/////////////////////////////////////////

${allSchemas.join('\n\n')}
`;
    
    fs.writeFileSync(domainFile, fileContent, 'utf-8');
    console.log(`✓ Creado ${domainFile} con ${allSchemas.length} esquemas`);
  }
}

console.log("\n✓ Extracción completada!");
