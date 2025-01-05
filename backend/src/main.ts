import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Cấu hình CORS cho phép frontend (React) kết nối
  app.enableCors({
    origin: 'http://localhost:3000',  // Đảm bảo đây là URL của frontend
  });

  await app.listen(3001);  // Đảm bảo backend đang chạy trên cổng 3001
}
bootstrap();
