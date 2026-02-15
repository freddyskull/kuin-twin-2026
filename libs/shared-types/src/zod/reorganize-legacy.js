const fs = require('fs');

// Leer el archivo
const content = fs.readFileSync('index.legacy.ts', 'utf-8');
const lines = content.split('\n');

// Definir las secciones y sus marcadores
const sections = [
  { marker: '// HELPER FUNCTIONS', title: 'HELPER FUNCTIONS & UTILITIES' },
  { marker: '// ENUMS', title: 'ENUMS & SCALAR FIELDS' },
  { marker: '// MODELS', title: 'DOMAIN MODELS' },
  { marker: '// USER SCHEMA', title: 'AUTH DOMAIN - User Schemas', domain: 'auth' },
  { marker: '// MESSAGE SCHEMA', title: 'MESSAGING DOMAIN - Message Schemas', domain: 'messaging' },
  { marker: '// MEDIA SCHEMA', title: 'MEDIA DOMAIN - Media Schemas', domain: 'media' },
  { marker: '// PROFILE SCHEMA', title: 'PROFILES DOMAIN - Profile & Portfolio Schemas', domain: 'profiles' },
  { marker: '// COMPANY SCHEMA', title: 'COMPANIES DOMAIN - Company & Branch Schemas', domain: 'companies' },
  { marker: '// CATEGORY SCHEMA', title: 'SERVICES DOMAIN - Service, Category & Unit Schemas', domain: 'services' },
  { marker: '// BOOKING SCHEMA', title: 'BOOKINGS DOMAIN - Booking & Slot Schemas', domain: 'bookings' },
  { marker: '// PAYMENT SCHEMA', title: 'PAYMENTS DOMAIN - Payment Schemas', domain: 'payments' },
];

let output = [];
let currentSection = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Buscar marcadores de sección
  const section = sections.find(s => line.includes(s.marker));
  
  if (section && section !== currentSection) {
    currentSection = section;
    
    // Agregar separador visual
    output.push('');
    output.push('/'.repeat(75));
    output.push(`// ${section.title}`);
    if (section.domain) {
      output.push(`// Domain: ${section.domain}`);
    }
    output.push('/'.repeat(75));
    output.push('');
    
    // Saltar la línea del marcador original
    continue;
  }
  
  output.push(line);
}

// Escribir el archivo actualizado
fs.writeFileSync('index.legacy.ts', output.join('\n'), 'utf-8');

console.log('✓ Archivo reorganizado con secciones claras');
console.log(`✓ Total de líneas: ${output.length}`);
console.log(`✓ Secciones agregadas: ${sections.length}`);
