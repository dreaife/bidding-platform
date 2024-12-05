import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty({ description: '邮箱', example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: '12345678' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @ApiProperty({ description: '用户名', example: '张三' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name: string;

  @ApiProperty({
    description: '角色',
    enum: ['bidder', 'publisher', 'admin'],
    default: 'bidder',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
