import { describe, it, expect } from 'vitest';
import { serviceSchema } from './schema';

describe('serviceSchema', () => {
    it('debería validar un objeto de servicio correcto', () => {
        const validData = {
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: 'cat-123',
          companyId: 'comp-123',
          basePrice: 100,
          unitId: 'unit-123',
          showPrice: true,
        };
        const result = serviceSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    it('debería sanitizar comillas inteligentes en dynamicAttributes', () => {
       const dataWithSmartQuotes = {
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: 'cat-123',
          companyId: 'comp-123',
          basePrice: 100,
          unitId: 'unit-123',
          dynamicAttributes: '{\n  “clave”: “valor”\n}'
       };
       const result = serviceSchema.safeParse(dataWithSmartQuotes);
       expect(result.success).toBe(true);
       if (result.success) {
           expect(result.data.dynamicAttributes).toContain('"clave": "valor"');
           expect(result.data.dynamicAttributes).not.toContain('“');
       }
    });

    it('debería filtrar caracteres de control invisibles en dynamicAttributes', () => {
        const dataWithInvisibleChar = {
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: 'cat-123',
          companyId: 'comp-123',
          basePrice: 100,
          unitId: 'unit-123',
          dynamicAttributes: '{\n  "clave":\u00A0"valor"\n}'
       };
       const result = serviceSchema.safeParse(dataWithInvisibleChar);
       expect(result.success).toBe(true);
       if (result.success) {
           // Si el character \u00A0 se limpia, el parseo funciona
           const parsed = JSON.parse(result.data.dynamicAttributes!);
           expect(parsed.clave).toBe('valor');
       }
    });

    it('debería filtrar metadatos vacíos', () => {
        const dataWithMetadata = {
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: 'cat-123',
          companyId: 'comp-123',
          basePrice: 100,
          unitId: 'unit-123',
          metadata: [
              { key: 'Color', value: 'Rojo' },
              { key: '', value: '' }, // Should be removed
              { key: 'Peso', value: '' } // Should be kept or handled? Schema transform logic handles this
          ]
       };
       // Schema logic: 
       // .transform: filter items where key OR value is not empty string (so keeps if at least one is present)
       // .refine: checks that if item exists, BOTH key AND value must be filled.
       // So { key: 'Peso', value: '' } passes transform but fails refine?
       
       // Let's check schema:
       // .transform((items) => items.filter(item => item.key.trim() !== '' || item.value.trim() !== ''))
       // .refine((items) => items.every(item => item.key.trim() !== '' && item.value.trim() !== ''), 'Todos los atributos deben tener etiqueta y valor')
       
       // So { key: '', value: '' } is filtered out -> OK.
       // { key: 'Peso', value: '' } is KEPT by transform, but REJECTED by refine.
       
       // So this test case should fail if we include partial empty.
       // Let's test checking that empty-empty is removed and valid is kept.
       
       const validMetadatadata = {
          ...dataWithMetadata,
          metadata: [
              { key: 'Color', value: 'Rojo' },
              { key: '', value: '' }
          ]
       };
       
       const result = serviceSchema.safeParse(validMetadatadata);
       expect(result.success).toBe(true);
       if (result.success) {
           expect(result.data.metadata).toHaveLength(1);
           expect(result.data.metadata[0].key).toBe('Color');
       }
    });

    it('debería permitir precio 0 si showPrice es false', () => {
        const dataNoPrice = {
          title: 'Servicio de Cotización',
          description: 'Esta es una descripción de servicio para cotizar.',
          categoryId: 'cat-123',
          companyId: 'comp-123',
          basePrice: 0,
          unitId: '',
          showPrice: false,
        };
        const result = serviceSchema.safeParse(dataNoPrice);
        expect(result.success).toBe(true);
    });

    it('debería fallar si falta el precio cuando showPrice es true', () => {
        const invalidData = {
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: 'cat-123',
          companyId: 'comp-123',
          basePrice: 0,
          unitId: '',
          showPrice: true,
        };
        const result = serviceSchema.safeParse(invalidData);
        if (result.success) {
          console.log('Unexpected success:', result.data);
        }
        expect(result.success).toBe(false);
    });
});
