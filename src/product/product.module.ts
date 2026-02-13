import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Product , Productschema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Product.name , schema: Productschema
    }])
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
