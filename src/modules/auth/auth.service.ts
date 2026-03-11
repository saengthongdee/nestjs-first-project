import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {

    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('อีเมลนี้ถูกใช้งานแล้ว');

    return this.usersService.create({
        ...dto,
        balance: 10000,
        frozen_amount: 0
    })
  }

  async login(email: string , password: string) {

    const user = await this.usersService.findByEmail(email)
    if(!user) throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง')

    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch) throw new UnauthorizedException('อีเมลนี้ถูกใช้งานแล้ว')

    const payload = { sub : user._id , email: user.email}
    return {
        access_token: this.jwtService.sign(payload),
        user: {
            id: user._id,
            full_name: user.full_name,
            balance: user.balance
        }
    }
  }
}
