import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMedicalDto {
  @IsOptional()
  @IsBoolean()
  smoking: boolean; // Hút thuốc

  @IsOptional()
  @IsBoolean()
  alcoholDrinking: boolean; // Uống rượu

  @IsOptional()
  @IsBoolean()
  stroke: boolean; // Đột quỵ

  @IsOptional()
  @IsBoolean()
  diffWalking: boolean; // Khó khăn trong việc đi lại

  @IsOptional()
  @IsString()
  race: string; // Chủng tộc

  @IsOptional()
  @IsBoolean()
  diabetic: boolean; // Bệnh tiểu đường

  @IsOptional()
  @IsBoolean()
  physicalActivity: boolean; // Hoạt động thể chất

  @IsOptional()
  @IsString()
  genHealth: string; // Sức khỏe chung

  @IsOptional()
  @IsNumber()
  sleepTime: number; // Thời gian ngủ

  @IsOptional()
  @IsBoolean()
  asthma: boolean; // Bệnh hen suyễn

  @IsOptional()
  @IsBoolean()
  kidneyDisease: boolean; // Bệnh thận

  @IsOptional()
  @IsBoolean()
  skinCancer: boolean; // Ung thư da
}