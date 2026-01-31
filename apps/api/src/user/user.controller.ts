// apps/api/src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, RegisterUserNestedDto, CreateProfileDto } from './dto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /api/users
   * Crear un nuevo usuario (Simple)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  /**
   * POST /api/users/register
   * Registro anidado (Usuario + Perfil)
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerNested(@Body() registerDto: RegisterUserNestedDto): Promise<UserResponseDto> {
    return this.userService.registerNested(registerDto);
  }

  /**
   * POST /api/users/:id/profile
   * Crear o actualizar el perfil de un usuario
   */
  @Post(':id/profile')
  async createProfile(
    @Param('id') id: string,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.userService.createProfile(id, profileDto);
  }

  /**
   * GET /api/users
   * Obtener todos los usuarios
   */
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  /**
   * GET /api/users/:id
   * Obtener un usuario por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  /**
   * PATCH /api/users/:id
   * Actualizar un usuario
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * DELETE /api/users/:id
   * Eliminar un usuario
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
