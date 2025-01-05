import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { DailyCheckService } from './daily-check.service';
import { DailyCheck } from './schemas/daily-check.schema';
import { CreateDailyCheckDto } from './dto/create-daily-check.dto';

@Controller('daily-check')
export class DailyCheckController {
  constructor(private readonly dailyCheckService: DailyCheckService) {}

  // Route để tạo mới một DailyCheck
  @Post()
  create(@Body() createDailyCheckDto: CreateDailyCheckDto): Promise<DailyCheck> {
    return this.dailyCheckService.create(createDailyCheckDto);
  }

  // Route để lấy tất cả DailyChecks
  @Get()
  findAll(): Promise<DailyCheck[]> {
    return this.dailyCheckService.findAll();
  }

  // Route để cập nhật DailyCheck theo ID
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDailyCheckDto: CreateDailyCheckDto,
  ): Promise<DailyCheck> {
    return this.dailyCheckService.update(id, updateDailyCheckDto);
  }

  // Route để xóa DailyCheck theo ID
  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.dailyCheckService.remove(id);
  }

  // Route để lấy DailyCheck theo ngày
  @Get('by-date/:date')
  async getDailyCheckByDate(@Param('date') date: string): Promise<DailyCheck | string> {
    const dailyCheck = await this.dailyCheckService.getDailyCheckByDate(date);
    if (!dailyCheck) {
      console.log(`Không có DailyCheck cho ngày ${date}`);
      return `Không có DailyCheck cho ngày ${date}`;
    }
    return dailyCheck;
  }

   // Route để lấy số ngày có sức khỏe thể chất tốt trong 30 ngày gần nhất
   @Get('physical-health/good-days/last-30-days')
   async getGoodPhysicalHealthDaysInLast30Days(): Promise<number> {
     return this.dailyCheckService.getGoodPhysicalHealthDaysInLast30Days();
   }
 
   // Route để lấy số ngày có sức khỏe tinh thần tốt trong 30 ngày gần nhất
   @Get('mental-health/good-days/last-30-days')
   async getGoodMentalHealthDaysInLast30Days(): Promise<number> {
     return this.dailyCheckService.getGoodMentalHealthDaysInLast30Days();
   }
}
