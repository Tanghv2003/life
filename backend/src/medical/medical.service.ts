// src/medical/medical.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMedicalDto } from './dto/create-medical.dto';
import { MedicalRecord } from './schemas/medical.schema';

@Injectable()
export class MedicalService {
  constructor(
    @InjectModel('MedicalRecord') private readonly medicalModel: Model<MedicalRecord>,
  ) {}

  async create(createMedicalDto: CreateMedicalDto): Promise<MedicalRecord> {
    const createdMedical = new this.medicalModel(createMedicalDto);
    return createdMedical.save();
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalModel.find().exec();
  }

  async findOne(id: string): Promise<MedicalRecord> {
    return this.medicalModel.findById(id).exec();
  }

  async update(id: string, updateMedicalDto: CreateMedicalDto): Promise<MedicalRecord> {
    return this.medicalModel.findByIdAndUpdate(id, updateMedicalDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.medicalModel.findByIdAndDelete(id).exec();
  }
}
