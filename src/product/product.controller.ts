import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts() {
    const products = await this.productService.getProducts();
    return {
      success: true,
      data: products,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getProduct(id);
    return {
      success: true,
      data: product,
    };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createProduct(@Body() createProductDto: ProductCreateDto) {
    const product = await this.productService.createProduct(createProductDto);
    return {
      success: true,
      data: product,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    const deletedProduct = await this.productService.deleteProduct(id);
    return {
      success: true,
      data: deletedProduct,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: ProductUpdateDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      updateProductDto,
    );
    return {
      success: true,
      data: updatedProduct,
    };
  }
}
