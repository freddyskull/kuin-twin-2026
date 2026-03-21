import { describe, it, expect } from 'vitest';
import { serviceSchema } from './schema';

const MOCK_VENDOR_ID = '550e8400-e29b-41d4-a716-446655440005';
const MOCK_CAT_ID = '550e8400-e29b-41d4-a716-446655440000';
const MOCK_COMP_ID = '550e8400-e29b-41d4-a716-446655440001';
const MOCK_UNIT_ID = '550e8400-e29b-41d4-a716-446655440002';

describe('serviceSchema', () => {
    it('debería validar un objeto de servicio correcto', () => {
        const validData = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: MOCK_CAT_ID,
          companyId: MOCK_COMP_ID,
          basePrice: 100,
          unitId: MOCK_UNIT_ID,
          showPrice: true,
        };
        const result = serviceSchema.safeParse(validData);
        if (!result.success) console.log(result.error.errors);
        expect(result.success).toBe(true);
    });

    it('debería ser válido sin companyId (opcional para individuos)', () => {
        const dataNoCompany = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio Individual',
          description: 'Descripción de prueba para un servicio sin empresa.',
          categoryId: MOCK_CAT_ID,
          basePrice: 50,
          unitId: MOCK_UNIT_ID,
          showPrice: true,
        };
        const result = serviceSchema.safeParse(dataNoCompany);
        expect(result.success).toBe(true);
    });

    it('debería transformar tags de string a array', () => {
        const dataWithTagsString = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio con Tags',
          description: 'Descripción de prueba para tags.',
          categoryId: MOCK_CAT_ID,
          tags: 'tag1, tag2, tag3',
          basePrice: 10,
          unitId: MOCK_UNIT_ID,
          showPrice: true,
        };
        const result = serviceSchema.safeParse(dataWithTagsString);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.tags).toEqual(['tag1', 'tag2', 'tag3']);
        }
    });

    it('debería sanitizar comillas inteligentes en dynamicAttributes', () => {
       const dataWithSmartQuotes = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: MOCK_CAT_ID,
          basePrice: 100,
          unitId: MOCK_UNIT_ID,
          dynamicAttributes: '{\n  “clave”: “valor”\n}'
       };
       const result = serviceSchema.safeParse(dataWithSmartQuotes);
       expect(result.success).toBe(true);
       if (result.success) {
           expect(result.data.dynamicAttributes).toContain('"clave": "valor"');
           expect(result.data.dynamicAttributes).not.toContain('“');
       }
    });

    it('debería filtrar metadatos vacíos y remover el item', () => {
        const validMetadatadata = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: MOCK_CAT_ID,
          basePrice: 100,
          unitId: MOCK_UNIT_ID,
          metadata: [
              { key: 'Color', value: 'Rojo' },
              { key: '  ', value: ' ' } // Esto debería ser filtrado por el .transform
          ]
       };
       
       const result = serviceSchema.safeParse(validMetadatadata);
       if (!result.success) console.log(result.error.errors);
       expect(result.success).toBe(true);
       if (result.success) {
           expect(result.data.metadata).toHaveLength(1);
           expect(result.data.metadata![0].key).toBe('Color');
       }
    });

    it('debería permitir precio 0 si showPrice es false', () => {
        const dataNoPrice = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio de Cotización',
          description: 'Esta es una descripción de servicio para cotizar.',
          categoryId: MOCK_CAT_ID,
          basePrice: 0,
          unitId: '',
          showPrice: false,
        };
        const result = serviceSchema.safeParse(dataNoPrice);
        expect(result.success).toBe(true);
    });

    it('debería fallar si falta el precio cuando showPrice es true', () => {
        const invalidData = {
          vendorId: MOCK_VENDOR_ID,
          title: 'Servicio de Prueba',
          description: 'Esta es una descripción de prueba con más de diez caracteres.',
          categoryId: MOCK_CAT_ID,
          basePrice: 0,
          unitId: '',
          showPrice: true,
        };
        const result = serviceSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
    });
});
