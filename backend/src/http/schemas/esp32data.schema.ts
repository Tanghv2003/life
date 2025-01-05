
import { Schema, Document } from 'mongoose';

export const AccelerationSchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
});

export const Esp32DataSchema = new Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  heartRate: { type: Number, required: true },
  acceleration: { type: AccelerationSchema, required: true },
  timestamp: { type: String, required: true },
});

export interface Acceleration {
  x: number;
  y: number;
  z: number;
}

export interface Esp32Data extends Document {
  temperature: number;
  humidity: number;
  heartRate: number;
  acceleration: Acceleration;
  timestamp: string;
}
