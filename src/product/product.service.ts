import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {

    product = [

        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 150 },
        { id: 3, name: 'Product C', price: 200 },
    ]

    getProductList(): object[] {
        return this.product;
    }

    getProductById(id: number): object | undefined {
        
        const result = this.product.find(item => item.id === id)

        return result
    }
}
