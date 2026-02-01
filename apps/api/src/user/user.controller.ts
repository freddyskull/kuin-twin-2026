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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto, RegisterUserNestedDto, CreateProfileDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear usuario',
    description: 'Crea un nuevo usuario en el sistema. La contraseña se hashea automáticamente con bcrypt.'
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Registro completo',
    description: 'Crea un usuario y su perfil en una sola operación. Ideal para onboarding de proveedores.'
  })
  @ApiResponse({ status: 201, description: 'Usuario y perfil creados exitosamente' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
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

  @Get()
  @ApiOperation({ 
    summary: 'Listar usuarios',
    description: 'Obtiene todos los usuarios con sus perfiles y portafolios. Resultado cacheado por 3 minutos.'
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [UserResponseDto] })
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener usuario',
    description: 'Obtiene un usuario específico con todos sus datos relacionados. Resultado cacheado por 5 minutos.'
  })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar usuario',
    description: 'Actualiza los datos de un usuario. Si se actualiza la contraseña, se hashea automáticamente. Invalida el caché.'
  })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El email ya está en uso' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario del sistema. Esta acción es irreversible. Invalida el caché.'
  })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
