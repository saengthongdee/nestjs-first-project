// src/modules/carts/cart.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from '../auctions/schemas/auction.schema';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  // 🔥 1. ระบบปิดประมูลอัตโนมัติ (ทำงานเบื้องหลังทุก 1 นาที)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleAuctionCompletion() {
    const now = new Date();

    // หาประมูลที่หมดเวลา และยังมีสถานะ active
    const completedAuctions = await this.auctionModel.find({
      status: 'active',
      'timeline.end_at': { $lte: now },
      current_leader: { $ne: null },
    });

    if (completedAuctions.length === 0) return;

    for (const auction of completedAuctions) {
      const winnerId = auction.current_leader.user_id;
      const finalPrice = auction.pricing.current_price;

      // ย้ายสินค้าเข้า Cart ของผู้ชนะ
      await this.cartModel.findOneAndUpdate(
        { user_id: winnerId },
        {
          $push: {
            items: {
              auction_id: auction._id,
              title: auction.title,
              final_price: finalPrice,
              won_at: now,
              payment_status: 'pending',
              expired_at: new Date(now.getTime() + 48 * 60 * 60 * 1000), // ให้เวลาจ่ายเงิน 48 ชม.
            },
          },
        },
        { upsert: true },
      );

      // เปลี่ยนสถานะเป็น closed เพื่อจบงาน
      auction.status = 'closed';
      await auction.save();

      this.logger.log(`✅ Auction ${auction._id} moved to User ${winnerId}'s cart.`);
    }
  }

  // 🛒 2. ฟังก์ชันดึงข้อมูล Cart ของ User คนนั้นๆ
  async getCartByUserId(userId: string) {
    const cart = await this.cartModel.findOne({ user_id: userId })
      .populate({
        path: 'items.auction_id',
        select: 'title pricing.current_price thumbnail' 
      });

    if (!cart) {
      return { user_id: userId, items: [] };
    }
    return cart;
  }
}