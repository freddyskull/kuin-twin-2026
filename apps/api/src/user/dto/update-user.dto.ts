import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Schema para actualizar un usuario (todos los campos opcionales)
export class UpdateUserDto extends PartialType(CreateUserDto) {}

export type UpdateUserInput = UpdateUserDto;
