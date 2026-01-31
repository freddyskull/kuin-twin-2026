import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, CreateUserInput, CreateProfileDto, CreateProfileInput, RegisterUserNestedDto, RegisterUserNestedInput, UpdateUserInput, CreatePortfolioItemInput } from './dto';
import { User, Profile, PortfolioItem } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    const { displayName, bio, avatarUrl, serviceRadiusKm, businessHours } = profileDto;

    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return this.prisma.profile.upsert({
      where: { userId },
      update: {
        displayName,
        bio,
        avatarUrl,
        serviceRadiusKm,
        businessHours: businessHours as any, // Cast because of Prisma JsonValue vs Zod
      },
      create: {
        userId,
        displayName,
        bio,
        avatarUrl,
        serviceRadiusKm,
        businessHours: businessHours as any,
      },
    });
  }

  /**
   * Agregar un item al portafolio
   */
  async addPortfolioItem(userId: string, itemDto: CreatePortfolioItemInput): Promise<PortfolioItem> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`El usuario con ID ${userId} no tiene un perfil creado aún.`);
    }

    return this.prisma.portfolioItem.create({
      data: {
        ...itemDto,
        dynamicAttributes: itemDto.dynamicAttributes as any,
        profileId: profile.id,
      },
    });
  }

  /**
   * Eliminar un item del portafolio
   */
  async removePortfolioItem(itemId: string): Promise<void> {
    const item = await this.prisma.portfolioItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item de portafolio con ID ${itemId} no encontrado`);
    }

    await this.prisma.portfolioItem.delete({
      where: { id: itemId },
    });
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
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
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: string): Promise<Omit<User, 'password'>> {
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

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
