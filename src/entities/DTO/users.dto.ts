import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class UserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;
}

