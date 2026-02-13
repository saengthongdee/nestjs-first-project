import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Product , ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { AppError } from 'src/common/errors/app.error';

import { HttpStatus} from '@nestjs/common';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

@Injectable()
export class ProductService {

    constructor(@InjectModel(Product.name) private productModel:Model<ProductDocument>){}

    async getProducts(): Promise<Product[]>{
        return this.productModel.find().exec()
    }

    async getProduct(id:string) : Promise<Product> {

        const product = await this.productModel.findById(id).exec()

        if(!product) {
            throw new AppError('Product not found' , HttpStatus.NOT_FOUND);
        }

        return product;
    }

    async createProduct(createProductDto:ProductCreateDto) {

        const existing = await this.productModel.findOne({ name: createProductDto.name}).exec();

        if(existing) {
            throw new AppError('Product with this name already exists' , HttpStatus.BAD_REQUEST);
        }

        return await this.productModel.create(createProductDto);
    }

    async deleteProduct(id:string) {

        const deleted = await this.productModel.findByIdAndDelete(id).exec();

        if(!deleted) {
            throw new AppError('Product not found' , HttpStatus.NOT_FOUND);
        }

        return deleted; 
    }

    async updateProduct(id:string , updateProductDto:ProductUpdateDto) {

        if(updateProductDto.name) {
            
            const existing = await this.productModel.findOne({
                name: updateProductDto.name, _id:{ $ne: id}
            })

            if(existing) {
                throw new AppError('Product with this name already exists' , HttpStatus.BAD_REQUEST);
            }
        }

        const updated = await this.productModel.findByIdAndUpdate(
            id , 
            updateProductDto ,
            { new: true , runValidators: true }
        ).exec();

        if(!updated) {
            throw new AppError('Product not found' , HttpStatus.NOT_FOUND);
        }
        return updated;
    }
}
