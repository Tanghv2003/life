import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDailyCheckDto } from './dto/create-daily-check.dto';
import { DailyCheck, DailyCheckDocument } from './schemas/daily-check.schema';

@Injectable()
export class DailyCheckService {
  constructor(
    @InjectModel(DailyCheck.name) private dailyCheckModel: Model<DailyCheckDocument>,
  ) {}

  // Tạo mới một DailyCheck
  async create(createDailyCheckDto: CreateDailyCheckDto): Promise<DailyCheck> {
    const createdDailyCheck = new this.dailyCheckModel(createDailyCheckDto);
    return createdDailyCheck.save();
  }

  // Lấy tất cả các DailyCheck
  async findAll(): Promise<DailyCheck[]> {
    return this.dailyCheckModel.find().exec();
  }

  // Cập nhật một DailyCheck theo ID
  async update(id: string, updateDailyCheckDto: CreateDailyCheckDto): Promise<DailyCheck> {
    return this.dailyCheckModel.findByIdAndUpdate(id, updateDailyCheckDto, { new: true }).exec();
  }

  // Xóa một DailyCheck theo ID
  async remove(id: string): Promise<any> {
    return this.dailyCheckModel.findByIdAndDelete(id).exec();
  }

  // Lấy DailyCheck theo ngày (timestamp là chuỗi dạng 'YYYY-MM-DD')
  async getDailyCheckByDate(date: string): Promise<DailyCheck | null> {
    // Chuyển đổi ngày nhập vào thành chuỗi theo định dạng 'YYYY-MM-DD'
    const dateString = new Date(date).toISOString().split('T')[0]; // 'YYYY-MM-DD'
    console.log(dateString);
    // Truy vấn tìm DailyCheck có timestamp là chuỗi trùng với dateString
    return this.dailyCheckModel
      .findOne({ timestamp: dateString })
      .exec();
  }

   // Lấy số ngày có sức khỏe thể chất tốt trong 30 ngày gần nhất
   async getGoodPhysicalHealthDaysInLast30Days(): Promise<number> {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 30);

    const query = {
      timestamp: {
        $gte: pastDate.toISOString().split('T')[0],
        $lte: currentDate.toISOString().split('T')[0],
      },
      physicalHealth: 1,
    };

    return this.dailyCheckModel.countDocuments(query).exec();
  }

  // Lấy số ngày có sức khỏe tinh thần tốt trong 30 ngày gần nhất
  async getGoodMentalHealthDaysInLast30Days(): Promise<number> {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 30);

    const query = {
      timestamp: {
        $gte: pastDate.toISOString().split('T')[0],
        $lte: currentDate.toISOString().split('T')[0],
      },
      mentalHealth: 1,
    };

    return this.dailyCheckModel.countDocuments(query).exec();
  }
  
}
