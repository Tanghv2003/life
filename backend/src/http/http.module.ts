import { Module } from "@nestjs/common";
import { HttpController } from "./http.controller";
import { HttpServices } from "./http.services";
import { MongooseModule } from '@nestjs/mongoose';
import { Esp32DataSchema } from './schemas/esp32data.schema';
import { Esp32Data } from "./schemas/esp32data.schema";
@Module({

    imports: [
        MongooseModule.forFeature([{ name: 'Esp32Data', schema: Esp32DataSchema }]),
      ],
    controllers : [HttpController],
    providers : [HttpServices]
})

export class HttpModule{};