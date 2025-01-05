// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserServices } from './user.services';
import { CreateUserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserServices) {}

  // Tạo mới người dùng
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userServices.create(createUserDto);
  }

  // Lấy tất cả người dùng
  @Get()
  async findAll(): Promise<User[]> {
    return this.userServices.findAll();
  }

  // Lấy người dùng theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userServices.findOne(id);
  }

  // Cập nhật người dùng theo ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userServices.update(id, updateUserDto);
  }

  // Xóa người dùng theo ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    return this.userServices.remove(id);
  }

  // API endpoint mới để lấy thông tin BMI
  @Get(':id/bmi')
  async getBMIInfo(@Param('id') id: string) {
    return this.userServices.getBMIInfo(id);
  }
}
