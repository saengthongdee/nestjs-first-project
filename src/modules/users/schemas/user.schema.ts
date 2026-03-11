import { Prop , Schema , SchemaFactory} from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as bcrypt from 'bcrypt'

@Schema({
    timestamps: true,
    collection: 'user'
})
export class User extends Document {
    
    @Prop({ required: true , unique: true , index: true})
    email: string;

    @Prop({ required: true})
    password: string

    @Prop({ required: true})
    full_name:string

    @Prop({ required: true })
    balance: number

    @Prop({ default: 0})
    frozen_amount: number
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save' , async function() {

    if(!this.isModified('password')) return

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}) 

UserSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate() as any;

  if (!update.password) return;

  const salt = await bcrypt.genSalt(10);
  update.password = await bcrypt.hash(update.password, salt);
});