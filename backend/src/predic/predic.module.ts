import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeartPredictionController } from './predic.controller';
import { HeartPredictionService } from './predic.services';
import { HeartPrediction, HeartPredictionSchema } from './schemas/predic.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: HeartPrediction.name, schema: HeartPredictionSchema }])],
  controllers: [HeartPredictionController],
  providers: [HeartPredictionService],
})
export class HeartPredictionModule {}
