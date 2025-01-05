import { Controller,Get, Post, Body } from "@nestjs/common";
import { HttpServices } from "./http.services";
import { Esp32Dto } from './dto/esp32data.dto';
import { Esp32Data } from "./schemas/esp32data.schema";

@Controller('http')
export class HttpController{
    constructor (private readonly httpServices : HttpServices){
    }

    @Post('data')
    async handlePostData(@Body() esp32Data: Esp32Dto): Promise<string> {
        // Gọi service để xử lý dữ liệu
        const savedData = await this.httpServices.saveEsp32Data(esp32Data);
        return `Data saved with ID: ${savedData.id}`;
    }

    @Get()
    async getEsp32Data(): Promise<Esp32Data[]> {
    return this.httpServices.getEsp32Data();
    }

}
