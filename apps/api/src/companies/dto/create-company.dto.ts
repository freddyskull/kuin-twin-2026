import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(13)
  rfc: string;

  @IsString()
  @IsNotEmpty()
  legalName: string;

  @IsString()
  @IsNotEmpty()
  fiscalRegime: string;

  @IsString()
  @IsNotEmpty()
  taxAddress: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  taxAddressZip: string;

  @IsString()
  @IsNotEmpty()
  taxAddressCity: string;

  @IsString()
  @IsNotEmpty()
  taxAddressState: string;

  @IsString()
  @IsOptional()
  taxAddressCounty?: string;

  @IsBoolean()
  @IsOptional()
  isSatVerified?: boolean;

  @IsUrl()
  @IsOptional()
  satCertificateUrl?: string;
}
