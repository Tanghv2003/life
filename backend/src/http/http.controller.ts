import { Controller, Get, Post, Body } from '@nestjs/common';
import { HttpServices } from './http.services';
import { Esp32Dto } from './dto/esp32data.dto';
import { Esp32Data } from './schemas/esp32data.schema';

@Controller('http')
export class HttpController {
  constructor(private readonly httpServices: HttpServices) {}

  // Endpoint để lưu dữ liệu ESP32
  @Post('data')
  async handlePostData(@Body() esp32Data: Esp32Dto): Promise<string> {
    // Gọi service để lưu dữ liệu
    const savedData = await this.httpServices.saveEsp32Data(esp32Data);
    return `Data saved with ID: ${savedData.id}`;
  }

  // Endpoint để lấy tất cả dữ liệu ESP32
  @Get()
  async getEsp32Data(): Promise<Esp32Data[]> {
    return this.httpServices.getEsp32Data();
  }

  // Endpoint để lấy thông tin nhiệt độ tối ưu cho giấc ngủ
  @Get('temperature')
  async getOptimalSleepTemperature(): Promise<number | null> {
    // Gọi service để lấy dữ liệu nhiệt độ tối ưu cho giấc ngủ
    return this.httpServices.getOptimalSleepTemperature();
  }

  /**
   * Endpoint để lấy thông tin về thời gian ngủ trung bình mỗi ngày và các khoảng thời gian ngủ
   * @returns Object chứa thời gian ngủ trung bình mỗi ngày (giờ) và danh sách các khoảng thời gian ngủ
   */
  @Get('sleep-analysis')
  async getSleepAnalysis(): Promise<{ date: string; sleepHours: number | null }> {
    // Gọi service để lấy số giờ ngủ của ngày hôm qua
    return this.httpServices.getSleepTimeYesterday();
  }
  @Get('data-status')
  async getDataStatusPercentage(): Promise<{
    missDataPercentage: number;
    sleepPercentage: number;
    missingDataPercentage: number;
  }> {
    return this.httpServices.getDataStatusPercentage();
  }
  
}
