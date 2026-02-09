import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { CreateProfileDto } from './create-profile.dto';

/**
 * DTO para registro anidado (Usuario + Perfil)
 */
export class RegisterUserNestedDto extends CreateUserDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;
}

export type RegisterUserNestedInput = RegisterUserNestedDto;
