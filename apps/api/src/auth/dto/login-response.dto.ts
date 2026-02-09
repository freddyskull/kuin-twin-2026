import { IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserLoginDto {
  @IsUUID()
  id: string;

  @IsString()
  email: string;

  @IsEnum(Role)
  role: Role;
}

export class LoginResponseDto {
  @IsString()
  @ApiProperty({ description: 'Token JWT para autenticación' })
  access_token: string;

  @ValidateNested()
  @Type(() => UserLoginDto)
  @ApiProperty({ description: 'Información del usuario autenticado' })
  user: UserLoginDto;
}
