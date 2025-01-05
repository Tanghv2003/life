// src/medical/medical.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalService } from './medical.service';
import { MedicalController } from './medical.controller';
import { MedicalRecordSchema } from './schemas/medical.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MedicalRecord', schema: MedicalRecordSchema },
    ]),
  ],
  controllers: [MedicalController],
  providers: [MedicalService],
})
export class MedicalModule {}
