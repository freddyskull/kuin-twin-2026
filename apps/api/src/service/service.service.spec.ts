import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { PrismaService } from '../prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('ServiceService', () => {
  let service: ServiceService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    service: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $executeRaw: jest.fn().mockResolvedValue(1),
  };

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CACHE_MANAGER, useValue: mockCache },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      title: 'Servicio de Prueba',
      vendorId: 'vendor-uuid',
      categoryId: 'cat-uuid',
      basePrice: 100,
      description: 'Descripción de prueba',
    };

    it('debe crear un servicio exitosamente si el usuario es VENDOR', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'vendor-uuid', role: Role.VENDOR });
      mockPrisma.service.findFirst.mockResolvedValue(null);
      mockPrisma.service.create.mockResolvedValue({ id: 'service-uuid', ...createDto });

      const result = await service.create(createDto as any);

      expect(result).toBeDefined();
      expect(mockPrisma.service.create).toHaveBeenCalled();
      expect(mockCache.del).toHaveBeenCalled();
    });

    it('debe lanzar ForbiddenException si el usuario es CUSTOMER', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'vendor-uuid', role: Role.CUSTOMER });

      await expect(service.create(createDto as any)).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar ForbiddenException si ya existe un servicio con el mismo título para el vendor', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'vendor-uuid', role: Role.VENDOR });
      mockPrisma.service.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(createDto as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    const updateDto = {
      title: 'Título Actualizado',
      basePrice: 150,
    };

    it('debe actualizar un servicio exitosamente', async () => {
      mockPrisma.service.findUnique.mockResolvedValue({ id: 'service-id', vendorId: 'v-id', title: 'Viejo' });
      mockPrisma.service.findFirst.mockResolvedValue(null); // No hay duplicados
      mockPrisma.service.update.mockResolvedValue({ id: 'service-id', ...updateDto });

      const result = await service.update('service-id', updateDto as any);

      expect(result.title).toBe('Título Actualizado');
      expect(mockPrisma.service.update).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el servicio no existe', async () => {
      mockPrisma.service.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto as any)).rejects.toThrow(NotFoundException);
    });
  });
});
