

// http.services.ts
import { Injectable } from '@nestjs/common';
import { Esp32Dto } from './dto/esp32data.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Esp32Data } from './schemas/esp32data.schema';

@Injectable()
export class HttpServices {
  constructor(
    @InjectModel('Esp32Data') private readonly esp32DataModel: Model<Esp32Data>,
  ) {}

  async saveEsp32Data(esp32Dto: Esp32Dto): Promise<Esp32Data> {
    const createdEsp32Data = new this.esp32DataModel(esp32Dto);
    return createdEsp32Data.save();
  }

  async getEsp32Data(): Promise<Esp32Data[]> {
    return this.esp32DataModel.find().exec();
  }

  /**
   * Lấy nhiệt độ phù hợp nhất cho giấc ngủ.
   * Nhiệt độ lý tưởng cho giấc ngủ có thể trong khoảng từ 15-40 độ C.
   * Gia tốc thấp chỉ ra ít chuyển động, có thể cho biết người dùng đang ngủ ngon.
   */
  async getOptimalSleepTemperature(): Promise<number | null> {
    try {
      // Lấy tất cả dữ liệu từ cơ sở dữ liệu
      const data = await this.esp32DataModel.find().exec();

      if (!data || data.length === 0) {
        return null;
      }

      // Lọc dữ liệu theo các tiêu chí: Nhiệt độ lý tưởng, gia tốc thấp
      const validData = data.filter(entry => {
        const temperatureIsGood = entry.temperature >= 15 && entry.temperature <= 40;
        const accelerationIsLow = 
          Math.abs(entry.acceleration.x) < 20 && 
          Math.abs(entry.acceleration.y) < 20 && 
          Math.abs(entry.acceleration.z) < 20;

        return temperatureIsGood && accelerationIsLow;
      });

      // Nếu có dữ liệu hợp lệ, tìm ra bản ghi có nhiệt độ phù hợp nhất
      if (validData.length > 0) {
        // Sắp xếp dữ liệu theo nhiệt độ gần nhất với mức lý tưởng (20°C)
        validData.sort((a, b) => Math.abs(a.temperature - 20) - Math.abs(b.temperature - 20));
        return validData[0].temperature;
      }

      return null;
    } catch (error) {
      console.error('Error in getOptimalSleepTemperature:', error);
      throw error;
    }
  }
}