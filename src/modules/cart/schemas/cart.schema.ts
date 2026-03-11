// src/modules/carts/schemas/cart.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'carts' })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user_id: Types.ObjectId;

  @Prop([{
    auction_id: { type: Types.ObjectId, ref: 'Auction' },
    title: String,
    final_price: Number,
    won_at: { type: Date, default: Date.now },
    payment_status: { type: String, enum: ['pending', 'paid', 'expired'], default: 'pending' },
    expired_at: Date
  }])
  items: any[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);