import { Schema, Document } from 'mongoose';

export const MedicalRecordSchema = new Schema({
  smoking: { type: Boolean, required: false }, // Hút thuốc
  alcoholDrinking: { type: Boolean, required: false }, // Uống rượu
  stroke: { type: Boolean, required: false }, // Đột quỵ
  diffWalking: { type: Boolean, required: false }, // Khó khăn trong việc đi lại
  race: { type: String, required: false }, // Chủng tộc
  diabetic: { type: Boolean, required: false }, // Bệnh tiểu đường
  physicalActivity: { type: Boolean, required: false }, // Hoạt động thể chất
  genHealth: { type: String, required: false }, // Sức khỏe chung
  sleepTime: { type: Number, required: false }, // Thời gian ngủ
  asthma: { type: Boolean, required: false }, // Bệnh hen suyễn
  kidneyDisease: { type: Boolean, required: false }, // Bệnh thận
  skinCancer: { type: Boolean, required: false }, // Ung thư da
});

export interface MedicalRecord extends Document {
  smoking: boolean; // Hút thuốc
  alcoholDrinking: boolean; // Uống rượu
  stroke: boolean; // Đột quỵ
  diffWalking: boolean; // Khó khăn trong việc đi lại
  race: string; // Chủng tộc
  diabetic: boolean; // Bệnh tiểu đường
  physicalActivity: boolean; // Hoạt động thể chất
  genHealth: string; // Sức khỏe chung
  sleepTime: number; // Thời gian ngủ
  asthma: boolean; // Bệnh hen suyễn
  kidneyDisease: boolean; // Bệnh thận
  skinCancer: boolean; // Ung thư da
}