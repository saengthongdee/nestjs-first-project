import { IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'ราคาบิดต้องมากกว่า 0 บาท' })
  amount: number;
}