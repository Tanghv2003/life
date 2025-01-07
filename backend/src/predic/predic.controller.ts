import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HeartPredictionService } from './predic.services';
import { HeartPrediction } from './schemas/predic.schemas';

@Controller('heart-prediction')
export class HeartPredictionController {
  constructor(private readonly heartPredictionService: HeartPredictionService) {}

  @Post()
  async create(@Body() createPredictionDto: HeartPrediction) {
    return this.heartPredictionService.create(createPredictionDto);
  }

  @Get()
  async findAll(): Promise<HeartPrediction[]> {
    return this.heartPredictionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HeartPrediction> {
    return this.heartPredictionService.findOne(id);
  }
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<HeartPrediction[]> {
    return this.heartPredictionService.findByUserId(userId);
  }
}
