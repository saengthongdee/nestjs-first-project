import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'Auction',
})
export class Auction extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: {
      start_price: { type: Number, required: true, min: 0 },
      current_price: { type: Number, required: true, min: 0 },
      min_step: { type: Number, required: true, min: 1 },
    },
    required: true,
  })
  pricing: {
    start_price: number;
    current_price: number;
    min_step: number;
  };

  @Prop({
    type: {
      start_at: { type: Date, required: true },
      end_at: { type: Date, required: true },
    },
    required: true,
  })
  timeline: {
    start_at: Date;
    end_at: Date;
  };

  @Prop({
    type: String,
    enum: ['active', 'closed', 'waiting_payment', 'completed'],
    default: 'active',
    index: true,
  })
  status: string;

  @Prop({
    type: {
      user_id: { type: Types.ObjectId, ref: 'User' },
      username: String,
      bid_at: { type: Date, default: Date.now },
    },
    default: null,
  })
  current_leader: {
    user_id: Types.ObjectId;
    username: string;
    bid_at: Date;
  };
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

AuctionSchema.index({ status: 1, 'timeline.end_at': 1 });