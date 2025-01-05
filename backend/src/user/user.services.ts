// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { User } from './schemas/user.schema'; // Đảm bảo bạn đã tạo schema đúng

@Injectable()
export class UserServices {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // Tạo mới user và lưu vào MongoDB
  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }

  // Lấy tất cả người dùng từ MongoDB
  async findAll() {
    return await this.userModel.find().exec();
  }

  // Lấy người dùng theo ID từ MongoDB
  async findOne(id: string) {
    return await this.userModel.findById(id).exec();
  }

  // Cập nhật người dùng theo ID trong MongoDB
  async update(id: string, updateUserDto: CreateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true, // Trả về đối tượng đã cập nhật
    }).exec();
    return updatedUser;
  }

  // Xóa người dùng theo ID trong MongoDB
  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec(); // Thay findByIdAndRemove() bằng findByIdAndDelete()
    return deletedUser;
  }


   // Tính BMI
   private calculateBMI(height: number, weight: number): number {
    // Chuyển đổi chiều cao từ cm sang m
    const heightInMeters = height / 100;
    // Tính BMI = cân nặng / (chiều cao * chiều cao)
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  // Phân loại BMI
  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 24.9) return 'Bình thường';
    if (bmi < 29.9) return 'Thừa cân';
    return 'Béo phì';
  }

  // Lấy thông tin BMI của người dùng
  async getBMIInfo(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }

    const bmi = this.calculateBMI(user.height, user.weight);
    return {
      bmi,
      category: this.getBMICategory(bmi),
      height: user.height,
      weight: user.weight
    };
  }
  
}
