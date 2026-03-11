import { IsString, IsNotEmpty, IsNumber, IsDateString, Min, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class PricingDto {
  @IsNumber()
  @Min(0)
  start_price: number;

  @IsNumber()
  @Min(1)
  min_step: number;
}

class TimelineDto {
  @IsDateString()
  start_at: string;

  @IsDateString()
  end_at: string;
}

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => PricingDto)
  pricing: PricingDto;

  @ValidateNested()
  @Type(() => TimelineDto)
  timeline: TimelineDto;
}