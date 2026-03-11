import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'bid_logs' })
export class BidLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true, index: true })
  auction_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  amount: number;
}

export const BidLogSchema = SchemaFactory.createForClass(BidLog);