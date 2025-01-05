// src/user/dto/create-user.dto.ts
import { IsString, IsInt, IsOptional, IsDateString, IsEnum, MinLength, MaxLength } from 'class-validator';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsDateString()
  dateOfBirth: string; // Định dạng YYYY-MM-DD

  @IsEnum(Gender)
  gender: Gender;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsInt()
  @IsOptional()
  weight?: number;
}
