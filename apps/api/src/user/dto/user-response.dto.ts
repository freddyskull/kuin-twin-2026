import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class PortfolioItemResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  imageUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageGallery?: string[];

  @IsOptional()
  dynamicAttributes?: any;
}

export class ProfileResponseDto {
    id: string;
    userId: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    serviceRadiusKm: number;
    ratingAvg: any; // Prisma Decimal
    reviewsCount: number;
    businessHours: any; // JSON
    isVerified: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PortfolioItemResponseDto)
  @IsOptional()
  portfolio?: PortfolioItemResponseDto[];
}

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  email: string;

  role: Role;

  createdAt: Date;
  updatedAt: Date;

  @ValidateNested()
  @Type(() => ProfileResponseDto)
  @IsOptional()
  profile?: ProfileResponseDto | null;
}

export type UserResponse = UserResponseDto;
