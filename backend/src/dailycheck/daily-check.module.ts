import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyCheckController } from './daily-check.controller';
import { DailyCheckService } from './daily-check.service';
import { DailyCheck, DailyCheckSchema } from './schemas/daily-check.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyCheck.name, schema: DailyCheckSchema },
    ]),
  ],
  controllers: [DailyCheckController],
  providers: [DailyCheckService],
})
export class DailyCheckModule {}
