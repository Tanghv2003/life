// src/medical/medical.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { CreateMedicalDto } from './dto/create-medical.dto';
import { MedicalRecord } from './schemas/medical.schema';

@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Post()
  create(@Body() createMedicalDto: CreateMedicalDto): Promise<MedicalRecord> {
    return this.medicalService.create(createMedicalDto);
  }

  @Get()
  findAll(): Promise<MedicalRecord[]> {
    return this.medicalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MedicalRecord> {
    return this.medicalService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicalDto: CreateMedicalDto,
  ): Promise<MedicalRecord> {
    return this.medicalService.update(id, updateMedicalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.medicalService.remove(id);
  }
}
