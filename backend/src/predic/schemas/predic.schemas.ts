import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeartPredictionDocument = HeartPrediction & Document;

@Schema({ timestamps: true })
export class HeartPrediction {
  @Prop()
  user_id: string;

  @Prop([{ 
    model: String,
    prediction: String,
    probability: String
  }])
  predictions: {
    model: string;
    prediction: string;
    probability: string;
  }[];

  @Prop()
  created_at: Date;
}

export const HeartPredictionSchema = SchemaFactory.createForClass(HeartPrediction);
