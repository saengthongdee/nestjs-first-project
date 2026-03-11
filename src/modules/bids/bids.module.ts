// src/modules/bids/bids.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { BidLog, BidLogSchema } from './schemas/bid-log.schema';
import { Auction, AuctionSchema } from '../auctions/schemas/auction.schema';
import { User, UserSchema } from '../users/schemas/user.schema'; // เพิ่มตัวนี้

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BidLog.name, schema: BidLogSchema },
      { name: Auction.name, schema: AuctionSchema },
      { name: User.name, schema: UserSchema }, // เพิ่มตัวนี้
    ]),
  ],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}