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
   * Tính thời gian ngủ trung bình mỗi ngày.
   * Coi một khoảng thời gian là giấc ngủ khi:
   * - Gia tốc tương đối ổn định (dưới ngưỡng)
   * - Khoảng thời gian liên tục ít nhất 30 phút
   * @returns Thời gian ngủ trung bình mỗi ngày tính bằng giờ
   */
  async getSleepTimeYesterday(): Promise<{ date: string; sleepHours: number | null }> {
    try {
      // Lấy dữ liệu và sắp xếp theo thời gian
      const data = await this.esp32DataModel.find().sort({ timestamp: 1 }).exec();
  
      if (!data || data.length === 0) {
        return { date: '', sleepHours: null };
      }
  
      // Lấy ngày hiện tại và ngày trước đó
      const currentDate = new Date();
      const yesterdayDate = new Date(currentDate);
      // yesterdayDate.setDate(currentDate.getDate() - 1); // Lấy ngày trước đó
      yesterdayDate.setDate(currentDate.getDate()); // Lấy ngày hiện tại
      const yesterdayDateString = yesterdayDate.toISOString().split('T')[0]; // Lấy định dạng YYYY-MM-DD
  
      const ACCELERATION_THRESHOLD = 0.5; // Ngưỡng gia tốc để xác định trạng thái nghỉ ngơi
      const MIN_SLEEP_DURATION = 30 * 60 * 1000; // Ngưỡng thời gian tối thiểu của giấc ngủ, 30 phút tính bằng milliseconds
  
      let currentPeriodStart: Date | null = null;
      let totalSleepTimeYesterday = 0; // Tổng thời gian ngủ ngày hôm qua (tính bằng milliseconds)
  
      // Phân tích dữ liệu để tìm các khoảng thời gian ngủ và tính tổng thời gian ngủ ngày hôm qua
      for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        const entryDate = new Date(entry.timestamp).toISOString().split('T')[0]; // Lấy ngày (YYYY-MM-DD)
  
        const isResting = 
          Math.abs(entry.acceleration.x) < ACCELERATION_THRESHOLD &&
          Math.abs(entry.acceleration.y) < ACCELERATION_THRESHOLD &&
          Math.abs(entry.acceleration.z) < ACCELERATION_THRESHOLD + 1;
  
        // Nếu đang nghỉ ngơi và là ngày hôm qua
        if (isResting && entryDate === yesterdayDateString && !currentPeriodStart) {
          currentPeriodStart = new Date(entry.timestamp);
        } else if (!isResting && currentPeriodStart && entryDate === yesterdayDateString) {
          const periodEnd = new Date(entry.timestamp);
          const duration = periodEnd.getTime() - currentPeriodStart.getTime();
  
          if (duration >= MIN_SLEEP_DURATION) {
            totalSleepTimeYesterday += duration; // Cộng thêm vào tổng thời gian ngủ ngày hôm qua
          }
  
          currentPeriodStart = null;
        }
      }
  
      // Xử lý period cuối cùng nếu vẫn đang trong trạng thái nghỉ ngơi vào cuối ngày hôm qua
      if (currentPeriodStart) {
        const lastEntry = data[data.length - 1];
        const duration = new Date(lastEntry.timestamp).getTime() - currentPeriodStart.getTime();
        
        if (duration >= MIN_SLEEP_DURATION) {
          totalSleepTimeYesterday += duration;
        }
      }
  
      // Chuyển đổi tổng thời gian ngủ từ milliseconds sang giờ
      const sleepHours = totalSleepTimeYesterday / (1000 * 60 * 60); // Chuyển đổi từ milliseconds sang giờ
  
      return {
        date: yesterdayDateString,
        sleepHours: Number(sleepHours.toFixed(2)),
      };
    } catch (error) {
      console.error('Error in getSleepTimeYesterday:', error);
      throw error;
    }
  }


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

  async getDataStatusPercentage(): Promise<{
    missDataPercentage: number;
    sleepPercentage: number;
    missingSleep: number;
  }> {
    try {
      // Lấy dữ liệu của ngày hôm qua
      const currentDate = new Date();
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(currentDate.getDate() );// ngày hôm nay
  
      const data = await this.esp32DataModel
        .find({
          timestamp: { 
            $gte: yesterdayDate, 
            $lt: currentDate 
          }
        })
        .exec();
  
      if (!data || data.length === 0) {
        return {
          missDataPercentage: 92,
          sleepPercentage: 8,
          missingSleep: 0
        };
      }
  
      const totalEntries = data.length;
      const missDataEntries = data.filter(entry => entry.heartRate === 0 || entry.heartRate >= 180).length;
      const sleepEntries = data.filter(entry => entry.heartRate > 30 && entry.heartRate <= 100).length;
      const missingDataEntries = data.filter(entry => entry.heartRate > 100).length;
      console.log(totalEntries);
  
      return {
        missDataPercentage: Number(((missDataEntries / totalEntries) * 100).toFixed(2)),
        sleepPercentage: Number(((sleepEntries / totalEntries) * 100).toFixed(2)),
        missingSleep: Number(((missingDataEntries / totalEntries) * 100).toFixed(2))
      };
    } catch (error) {
      console.error('Error in getDataStatusPercentage:', error);
      throw error;
    }
  }


  async getSleepTimePast7Days(): Promise<{ date: string; sleepHours: number | null }[]> {
    try {
      // Lấy dữ liệu và sắp xếp theo thời gian
      const data = await this.esp32DataModel.find().sort({ timestamp: 1 }).exec();
  
      if (!data || data.length === 0) {
        return [];
      }
  
      const sleepData = [];
      const ACCELERATION_THRESHOLD = 15;
      const MIN_SLEEP_DURATION = 30 * 60 * 1000;
  
      // Lấy 7 ngày trước
      for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - dayOffset);
        const targetDateString = targetDate.toISOString().split('T')[0];
  
        let currentPeriodStart: Date | null = null;
        let totalSleepTimeForDay = 0;
  
        // Phân tích dữ liệu để tìm các khoảng thời gian ngủ
        for (let i = 0; i < data.length; i++) {
          const entry = data[i];
          const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
  
          const isResting = 
            Math.abs(entry.acceleration.x) < ACCELERATION_THRESHOLD &&
            Math.abs(entry.acceleration.y) < ACCELERATION_THRESHOLD &&
            Math.abs(entry.acceleration.z) < ACCELERATION_THRESHOLD;
  
          if (isResting && entryDate === targetDateString && !currentPeriodStart) {
            currentPeriodStart = new Date(entry.timestamp);
          } else if (!isResting && currentPeriodStart && entryDate === targetDateString) {
            const periodEnd = new Date(entry.timestamp);
            const duration = periodEnd.getTime() - currentPeriodStart.getTime();
  
            if (duration >= MIN_SLEEP_DURATION) {
              totalSleepTimeForDay += duration;
            }
  
            currentPeriodStart = null;
          }
        }
  
        // Xử lý period cuối cùng
        if (currentPeriodStart) {
          const lastEntry = data[data.length - 1];
          const duration = new Date(lastEntry.timestamp).getTime() - currentPeriodStart.getTime();
          
          if (duration >= MIN_SLEEP_DURATION) {
            totalSleepTimeForDay += duration;
          }
        }
  
        // Chuyển đổi tổng thời gian ngủ từ milliseconds sang giờ
        const sleepHours = totalSleepTimeForDay / (1000 * 60 * 60);
  
        sleepData.push({
          date: targetDateString,
          sleepHours: Number(sleepHours.toFixed(2)),
        });
      }
  
      return sleepData;
    } catch (error) {
      console.error('Error in getSleepTimePast7Days:', error);
      throw error;
    }
  }
}
