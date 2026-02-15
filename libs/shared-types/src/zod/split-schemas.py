import re
import os

# Leer el archivo legacy
with open('index.legacy.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Definir los dominios y sus patrones
domains = {
    'auth': {
        'patterns': ['User', 'Role'],
        'enums': ['RoleSchema', 'RoleType']
    },
    'messaging': {
        'patterns': ['Message'],
        'enums': []
    },
    'media': {
        'patterns': ['Media'],
        'enums': []
    },
    'profiles': {
        'patterns': ['Profile', 'PortfolioItem'],
        'enums': []
    },
    'companies': {
        'patterns': ['Company', 'Branch'],
        'enums': []
    },
    'services': {
        'patterns': ['Service', 'Category', 'ServiceUnit', 'ServiceMetadata'],
        'enums': []
    },
    'bookings': {
        'patterns': ['Booking', 'BookingDetails', 'ServiceSlot', 'BookingStatus', 'SlotStatus'],
        'enums': ['BookingStatusSchema', 'BookingStatusType', 'SlotStatusSchema', 'SlotStatusType']
    },
    'payments': {
        'patterns': ['Payment'],
        'enums': []
    }
}

# Función para extraer esquemas de un modelo
def extract_schemas_for_pattern(content, pattern):
    schemas = []
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Buscar exports que contengan el patrón
        if f'export const {pattern}' in line or f'export type {pattern}' in line:
            schema_lines = [line]
            brace_count = line.count('{') - line.count('}')
            i += 1
            
            # Si es un tipo simple, solo tomar esa línea
            if 'export type' in line and '=' in line and brace_count == 0:
                schemas.append('\n'.join(schema_lines))
                continue
            
            # Capturar el resto del esquema
            while i < len(lines) and (brace_count > 0 or not schema_lines[-1].strip().endswith((')', '}', ';'))):
                schema_lines.append(lines[i])
                brace_count += lines[i].count('{') - lines[i].count('}')
                i += 1
                
                # Romper si encontramos una línea vacía después de cerrar
                if brace_count == 0 and schema_lines[-1].strip() == '':
                    break
            
            schemas.append('\n'.join(schema_lines))
        else:
            i += 1
    
    return schemas

print("Extrayendo esquemas por dominio...")

# Crear directorios y archivos
for domain, config in domains.items():
    domain_dir = domain
    if not os.path.exists(domain_dir):
        os.makedirs(domain_dir)
    
    all_schemas = []
    
    # Extraer esquemas para cada patrón
    for pattern in config['patterns']:
        schemas = extract_schemas_for_pattern(content, pattern)
        all_schemas.extend(schemas)
    
    # Extraer enums específicos
    for enum in config['enums']:
        schemas = extract_schemas_for_pattern(content, enum)
        all_schemas.extend(schemas)
    
    if all_schemas:
        # Crear archivo del dominio
        domain_file = f"{domain_dir}/index.ts"
        
        with open(domain_file, 'w', encoding='utf-8') as f:
            f.write("import { z } from 'zod';\n")
            f.write("import { Prisma } from '@prisma/client';\n")
            f.write("import Decimal from 'decimal.js';\n")
            f.write("import {\n")
            f.write("  DecimalJsLikeSchema,\n")
            f.write("  isValidDecimalInput,\n")
            f.write("  JsonValueSchema,\n")
            f.write("  InputJsonValueSchema,\n")
            f.write("  NullableJsonNullValueInputSchema,\n")
            f.write("  JsonNullValueInputSchema,\n")
            f.write("  JsonNullValueFilterSchema,\n")
            f.write("} from '../common';\n\n")
            f.write(f"/////////////////////////////////////////\n")
            f.write(f"// {domain.upper()} DOMAIN\n")
            f.write(f"/////////////////////////////////////////\n\n")
            f.write('\n\n'.join(all_schemas))
        
        print(f"✓ Creado {domain_file} con {len(all_schemas)} esquemas")

print("\n✓ Extracción completada!")
