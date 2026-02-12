import { Controller , Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {

    constructor(private readonly productService:ProductService){}

    @Get('/api/list')
    getProductList(): object[] {
        return this.productService.getProductList();
    }

    @Get('api/:id')
    getProductById(id: number): object | undefined {
        return this.productService.getProductById(id)
    }

}
