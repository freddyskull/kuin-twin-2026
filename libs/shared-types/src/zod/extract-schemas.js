const fs = require('fs');
const path = require('path');

// Leer el archivo original
const originalFile = fs.readFileSync(
  path.join(__dirname, '../index.ts'),
  'utf-8'
);

const lines = originalFile.split('\n');

// Función para encontrar secciones por comentarios
function extractSection(startComment, endMarker) {
  const startIdx = lines.findIndex(line => line.includes(startComment));
  if (startIdx === -1) return null;
  
  let endIdx = startIdx + 1;
  while (endIdx < lines.length && !lines[endIdx].includes(endMarker)) {
    endIdx++;
  }
  
  return lines.slice(startIdx, endIdx).join('\n');
}

// Función para extraer todos los esquemas de un modelo
function extractModelSchemas(modelName) {
  const schemas = [];
  const regex = new RegExp(`export const ${modelName}.*Schema`, 'g');
  
  let inSchema = false;
  let currentSchema = [];
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.match(regex) || line.includes(`${modelName}WhereInput`) || 
        line.includes(`${modelName}CreateInput`) || line.includes(`${modelName}UpdateInput`)) {
      inSchema = true;
      currentSchema = [line];
      braceCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      continue;
    }
    
    if (inSchema) {
      currentSchema.push(line);
      braceCount += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      
      if (braceCount === 0 && line.trim() !== '') {
        schemas.push(currentSchema.join('\n'));
        inSchema = false;
        currentSchema = [];
      }
    }
  }
  
  return schemas.join('\n\n');
}

console.log('Extrayendo esquemas por dominio...');

// Crear directorios
const domains = ['auth', 'messaging', 'media', 'profiles', 'companies', 'services', 'bookings', 'payments'];
domains.forEach(domain => {
  const dir = path.join(__dirname, domain);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Script completado. Por favor, ejecuta la extracción manual para cada dominio.');
