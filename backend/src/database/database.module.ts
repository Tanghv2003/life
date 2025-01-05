import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://tanghvinfo:bhXe73BqgvB2QgTk@clusterlife.kc56d.mongodb.net/hust_life'),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
