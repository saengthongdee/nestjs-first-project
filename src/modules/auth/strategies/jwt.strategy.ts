import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      // 1. บอกให้ไปดึง Token มาจาก Header ที่ชื่อว่า Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Secret Key ต้องตรงกับที่ตั้งไว้ใน AuthModule
      secretOrKey: 'asdfa0q94385lj020_*)(jlskdjf', 
    });
  }

  // ฟังก์ชันนี้จะทำงานอัตโนมัติหลังจากถอดรหัส Token สำเร็จ
  async validate(payload: any) {
    // payload คือข้อมูลที่เราใส่ไว้ตอน Login (sub คือ userId)
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('ไม่พบผู้ใช้งานนี้ในระบบ');
    }

    // ข้อมูลที่ return ตรงนี้ จะไปอยู่ใน req.user ของทุกๆ Request
    return { 
      id: user._id, 
      email: user.email,
      full_name: user.full_name 
    };
  }
}