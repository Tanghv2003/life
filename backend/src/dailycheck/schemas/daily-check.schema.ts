import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DailyCheck {
  @Prop({ required: true })
  physicalHealth: number;

  @Prop({ required: true })
  mentalHealth: number;

  @Prop({ required: true })
  timestamp: string;  // Lưu thời gian ngày tháng năm dưới dạng string
}

export type DailyCheckDocument = DailyCheck & Document;
export const DailyCheckSchema = SchemaFactory.createForClass(DailyCheck);
