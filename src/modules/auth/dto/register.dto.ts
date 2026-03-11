import { IsEmail , IsNotEmpty , IsString , MinLength} from 'class-validator'

export class RegisterDto {

    @IsEmail({} , { message: 'รูปแบบอีเมลไม่ถูกต้อง'})
    email: string;

    @IsString()
    @IsNotEmpty()
    full_name: string;

    @MinLength(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'})
    password: string
}