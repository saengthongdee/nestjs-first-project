// src/modules/carts/cart.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-cart')
  async getMyCart(@Request() req) {
    // ใช้ userId จาก JWT Token
    const userId = req.user.id || req.user._id; 
    return this.cartService.getCartByUserId(userId);
  }
}