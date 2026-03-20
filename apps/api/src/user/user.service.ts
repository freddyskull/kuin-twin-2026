import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, CreateUserInput, CreateProfileInput, RegisterUserNestedInput, UpdateUserInput } from './dto';
import { User, Profile, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { updateProfileLocation } from './user-geo.utils';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto | CreateUserInput): Promise<Omit<User, 'password'>> {
    const existing = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
      } as Prisma.UserCreateInput,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async registerNested(registerDto: RegisterUserNestedInput): Promise<Omit<User, 'password'>> {
    const { email, password, role, profile } = registerDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const data: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
      role,
      profile: profile ? {
        create: {
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          businessHours: profile.businessHours as Prisma.InputJsonValue,
        }
      } : undefined
    };

    const user = await this.prisma.user.create({
      data,
      include: { profile: { include: { portfolio: true } } }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createProfile(userId: string, profileDto: CreateProfileInput): Promise<Profile> {
    const { latitude, longitude, displayName, bio, avatarUrl, phone, whatsapp, businessHours, companyId, ...rest } = profileDto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);

    const updateData: Prisma.ProfileUpdateInput = {
      displayName,
      bio,
      avatarUrl,
      phone,
      whatsapp,
      company: companyId ? { connect: { id: companyId } } : undefined,
      businessHours: businessHours as Prisma.InputJsonValue ?? Prisma.JsonNull,
      ...rest,
    };

    const createData: Prisma.ProfileCreateInput = {
      displayName,
      bio,
      avatarUrl,
      phone,
      whatsapp,
      company: companyId ? { connect: { id: companyId } } : undefined,
      user: { connect: { id: userId } },
      businessHours: businessHours as Prisma.InputJsonValue ?? Prisma.JsonNull,
      ...rest,
    };

    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });

    if (latitude !== undefined && longitude !== undefined) {
      await updateProfileLocation(this.prisma, profile.id, latitude, longitude);
    }

    const result = await this.prisma.profile.findUnique({ where: { id: profile.id } });
    if (!result) throw new NotFoundException('Error al recuperar el perfil creado');
    
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const cached = await this.cacheManager.get<Omit<User, 'password'>[]>('users:all');
    if (cached) return cached;

    const users = await this.prisma.user.findMany({
      include: { profile: { include: { portfolio: true } } },
    });

    const result = users.map(({ password, ...user }) => user);
    await this.cacheManager.set('users:all', result, 180000);
    return result;
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const cached = await this.cacheManager.get<Omit<User, 'password'>>(`user:${id}`);
    if (cached) return cached;

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: { include: { portfolio: true } }, services: true, bookings: true },
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    const { password, ...result } = user;
    await this.cacheManager.set(`user:${id}`, result, 300000);
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserInput): Promise<Omit<User, 'password'>> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    if (updateUserDto.email && updateUserDto.email !== existing.email) {
      const emailExists = await this.prisma.user.findUnique({ where: { email: updateUserDto.email } });
      if (emailExists) throw new ConflictException('El email ya está registrado');
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.role) updateData.role = updateUserDto.role;
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({ 
      where: { id }, 
      data: updateData 
    });
    
    await this.cacheManager.del(`user:${id}`);
    await this.cacheManager.del('users:all');

    const { password, ...result } = user;
    return result;
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    await this.cacheManager.del(`user:${id}`);
    await this.cacheManager.del('users:all');
    await this.prisma.user.delete({ where: { id } });
  }
}
