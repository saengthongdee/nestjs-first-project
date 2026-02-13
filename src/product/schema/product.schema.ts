import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document

@Schema()
export class Product {

    @Prop({ required: true , unique: true})
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;
}

export const Productschema = SchemaFactory.createForClass(Product)