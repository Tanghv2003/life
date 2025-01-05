// src/user/schemas/user.schema.ts
import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
});

export interface User extends Document {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: string;
  height: number;
  weight: number;
}
