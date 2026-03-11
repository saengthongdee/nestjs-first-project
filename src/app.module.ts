import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule"; // 1. เพิ่มตัวนี้เข้ามา
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuctionsModule } from './modules/auctions/auctions.module';
import { BidsModule } from './modules/bids/bids.module';
import { CartModule } from './modules/cart/cart.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
   imports:[
      MongooseModule.forRoot('mongodb://localhost:27017/auction'),
      ScheduleModule.forRoot(), // 2. ใส่ตัวนี้เพื่อให้ @Cron เริ่มทำงาน
      AuthModule,
      UsersModule,
      AuctionsModule,
      BidsModule,
      CartModule,
      NotificationsModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}