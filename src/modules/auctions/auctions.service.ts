import { Injectable , ConflictException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auction } from './schemas/auction.schema';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Injectable()
export class AuctionsService {

    constructor(
        @InjectModel(Auction.name) private auctionModel: Model<Auction>
    ){}

    async create(createAuctionDto: CreateAuctionDto) {
        try {

            const newAuction = new this.auctionModel({
                ...createAuctionDto,
                pricing: {
                    ...createAuctionDto.pricing,
                    current_price: createAuctionDto.pricing.start_price,
                },
                status: 'active',
            });
            return await newAuction.save()

        }catch(error) {
            
            if(error.code === 11000) {
                throw new ConflictException('SKU นี้มีอยู่ในระบบแล้ว')
            }
            throw error
        }
    }

    async findAll() {
        return await this.auctionModel.find().sort({ createdAt: -1}).exec()
    }
    
}
