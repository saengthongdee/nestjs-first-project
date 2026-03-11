import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auction } from '../auctions/schemas/auction.schema';
import { BidLog } from './schemas/bid-log.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Auction.name) private readonly auctionModel: Model<Auction>,
    @InjectModel(BidLog.name) private readonly bidLogModel: Model<BidLog>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async placeBid(
    userId: string,
    username: string,
    auctionId: string,
    amount: number,
  ) {
    // 1. ดึงข้อมูลเบื้องต้นมาตรวจสอบ (ใช้ข้อมูลล่าสุดจาก DB)
    const auction = await this.auctionModel.findById(auctionId);
    if (!auction) throw new NotFoundException('ไม่พบรายการประมูลนี้');

    const now = new Date();

    // 2. Validation: สถานะและเวลา
    if (auction.status !== 'active') throw new BadRequestException('การประมูลไม่ได้เปิดอยู่');
    if (now < auction.timeline.start_at) {
      throw new BadRequestException(`เริ่มวันที่ ${auction.timeline.start_at.toLocaleString('th-TH')}`);
    }
    if (now > auction.timeline.end_at) throw new BadRequestException('การประมูลสิ้นสุดแล้ว');

    // 3. Validation: ราคาขั้นต่ำ
    const isFirstBid = !auction.current_leader;
    const currentPrice = auction.pricing.current_price || auction.pricing.start_price;
    const minRequired = isFirstBid ? currentPrice : currentPrice + auction.pricing.min_step;

    if (amount < minRequired) {
      throw new BadRequestException(`ต้องบิดอย่างน้อย ${minRequired.toLocaleString()} บาท`);
    }

    // --- LOGIC ป้องกันเงินรวน (The Core Fix) ---
    const oldLeader = auction.current_leader;
    const newFrozenRequired = amount * 0.1;
    let amountToDebit = 0;

    // คำนวณส่วนต่างที่ต้องหักจริงจาก Balance ของผู้บิดปัจจุบัน
    if (oldLeader && oldLeader.user_id.toString() === userId) {
      // กรณีคนเดิมบิดซ้ำ: หักเพิ่มเฉพาะส่วนต่าง (ราคาใหม่ 10% - ราคาเก่า 10%)
      const alreadyFrozen = currentPrice * 0.1;
      amountToDebit = newFrozenRequired - alreadyFrozen;
    } else {
      // กรณีคนใหม่บิดแซง: ต้องหักเต็ม 10% ของยอดใหม่
      amountToDebit = newFrozenRequired;
    }

    // 4. ATOMIC UPDATE: หักเงินผู้บิดปัจจุบัน (เช็คเงินจริงใน DB วินาทีนั้นเลย)
    if (amountToDebit > 0) {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { 
          _id: userId, 
          balance: { $gte: amountToDebit } // กุญแจสำคัญ: balance ใน DB ต้องพอหักจริง
        },
        { 
          $inc: { 
            frozen_amount: amountToDebit, 
            balance: -amountToDebit 
          } 
        },
        { new: true }
      );

      // ถ้าเงินไม่พอในเสี้ยววินาทีนั้น updatedUser จะเป็น null ระบบจะหยุดทันที
      if (!updatedUser) {
        throw new BadRequestException(
          `ยอดเงินคงเหลือไม่เพียงพอ (ต้องการมัดจำเพิ่ม ${amountToDebit.toLocaleString()} บาท)`,
        );
      }
    }

    // 5. REFUND: คืนเงินคนเก่า (ทำหลังจากหักเงินคนใหม่สำเร็จแล้วเท่านั้น เพื่อความชัวร์)
    if (oldLeader && oldLeader.user_id.toString() !== userId) {
      const refundAmount = currentPrice * 0.1;
      await this.userModel.findByIdAndUpdate(oldLeader.user_id, {
        $inc: { 
          frozen_amount: -refundAmount, 
          balance: refundAmount 
        }
      });
    }

    // 6. ANTI-SNIPING: ต่อเวลา 2 นาทีถ้าบิดใน 30 วินาทีสุดท้าย
    const endTime = new Date(auction.timeline.end_at).getTime();
    let finalEndAt = auction.timeline.end_at;
    if (endTime - now.getTime() <= 30000) {
      finalEndAt = new Date(endTime + 120000);
    }

    // 7. FINAL SAVE: อัปเดตสถานะการประมูลและ Log
    const updatedAuction = await this.auctionModel.findOneAndUpdate(
      { _id: auctionId },
      {
        $set: {
          'pricing.current_price': amount,
          'current_leader': {
            user_id: new Types.ObjectId(userId),
            username: username,
            bid_at: now,
          },
          'timeline.end_at': finalEndAt
        }
      },
      { new: true }
    );

    await this.bidLogModel.create({
      auction_id: auction._id,
      user_id: new Types.ObjectId(userId),
      username: username,
      amount: amount,
    });

    return updatedAuction;
  }
}