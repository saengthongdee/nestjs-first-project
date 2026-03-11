import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator'; // ใช้ Decorator ใหม่
import { CreateBidDto } from './dto/create-bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidService: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':auctionId')
  async placeBid(
    @Param('auctionId') auctionId: string,
    @Body() createBidDto: CreateBidDto,
    @GetUser() user: any,
  ) {

    const userId = user.id;
    const username = user.full_name;

    return await this.bidService.placeBid(
      userId,
      username,
      auctionId,
      createBidDto.amount,
    );
  }
}