// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserServices } from './user.services';
import { UserSchema } from './schemas/user.schema'; // Đảm bảo bạn đã tạo schema đúng

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Đăng ký schema MongoDB
  ],
  controllers: [UserController],
  providers: [UserServices],
})
export class UserModule {}
