import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // ถ้าจะล็อกไว้ให้เฉพาะแอดมินลงสินค้า

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // เปิดใช้ถ้าต้องการให้ต้อง Login ก่อนลงสินค้า
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    return await this.auctionsService.create(createAuctionDto);
  }

  @Get()
  async findAll() {
    return await this.auctionsService.findAll();
  }
}