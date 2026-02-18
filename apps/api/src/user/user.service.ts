import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, CreateUserInput, CreateProfileDto, CreateProfileInput, RegisterUserNestedDto, RegisterUserNestedInput, UpdateUserInput } from './dto';
import { User, Profile } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Crear un nuevo usuario (Simple)
   */
  async create(createUserDto: CreateUserDto | CreateUserInput): Promise<Omit<User, 'password'>> {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    // Retornar sin el password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Registro anidado: Usuario + Perfil
   */
  async registerNested(registerDto: RegisterUserNestedInput): Promise<Omit<User, 'password'>> {
    const { email, password, role, profile } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y perfil en una transacción
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        profile: profile ? {
          create: profile
        } : undefined
      },
      include: {
        profile: {
          include: {
            portfolio: true
          }
        }
      }
    });

    // Retornar sin el password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Crear o actualizar perfil para un usuario existente
   */
  async createProfile(userId: string, profileDto: CreateProfileInput): Promise<Profile> {
    const { latitude, longitude, ...data } = profileDto;

    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: {
        ...data,
        businessHours: data.businessHours ?? undefined, // Cast implicit
      },
      create: {
        ...data,
        userId,
        businessHours: data.businessHours ?? undefined,
      },
    });

    // Actualizar ubicación si se proporcionan coordenadas
    if (latitude !== undefined && longitude !== undefined) {
      await this.updateLocation(profile.id, latitude, longitude);
    }

    return this.prisma.profile.findUnique({ where: { id: profile.id } }) as Promise<Profile>;
  }

  /**
   * Actualiza el campo location usando PostGIS raw query
   */
  private async updateLocation(profileId: string, lat: number, lng: number) {
    await this.prisma.$executeRaw`
      UPDATE "Profile"
      SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      WHERE id = ${profileId}
    `;
  }


  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const cacheKey = 'users:all';

    // Intentar obtener del cache
    const cached = await this.cacheManager.get<Omit<User, 'password'>[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const users = await this.prisma.user.findMany({
      include: {
        profile: {
          include: {
            portfolio: true
          }
        },
      },
    });

    // Remover passwords de todos los usuarios
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    // Guardar en cache por 3 minutos
    await this.cacheManager.set(cacheKey, usersWithoutPassword, 180000);

    return usersWithoutPassword;
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const cacheKey = `user:${id}`;

    // Intentar obtener del cache
    const cached = await this.cacheManager.get<Omit<User, 'password'>>(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            portfolio: true
          }
        },
        services: true,
        bookings: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { password, ...userWithoutPassword } = user;

    // Guardar en cache por 5 minutos
    await this.cacheManager.set(cacheKey, userWithoutPassword, 300000);

    return userWithoutPassword;
  }

  /**
   * Obtener un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Actualizar un usuario
   */
  async update(id: string, updateUserDto: UpdateUserInput): Promise<Omit<User, 'password'>> {
    // Verificar que el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Si se está actualizando el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Si se está actualizando la contraseña, hashearla
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Actualizar el usuario
    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Invalidar caches
    await this.cacheManager.del(`user:${id}`);
    await this.cacheManager.del('users:all');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Eliminar un usuario
   */
  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Invalidar caches
    await this.cacheManager.del(`user:${id}`);
    await this.cacheManager.del('users:all');

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
