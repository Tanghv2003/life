import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeartPrediction, HeartPredictionDocument } from './schemas/predic.schemas';

@Injectable()
export class HeartPredictionService {
  constructor(
    @InjectModel(HeartPrediction.name) private heartPredictionModel: Model<HeartPredictionDocument>,
  ) {}

  async create(createPredictionDto: HeartPrediction): Promise<HeartPrediction> {
    const createdPrediction = new this.heartPredictionModel(createPredictionDto);
    return createdPrediction.save();
  }

  async findAll(): Promise<HeartPrediction[]> {
    return this.heartPredictionModel.find().exec();
  }

  async findOne(id: string): Promise<HeartPrediction> {
    return this.heartPredictionModel.findById(id).exec();
  }

  // Cập nhật phương thức này để tìm theo user_id
  async findByUserId(userId: string): Promise<HeartPrediction[]> {
    return this.heartPredictionModel.find({ user_id: userId }).exec();
  }
}
