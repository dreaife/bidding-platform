import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/entities/DTO/users.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() userDto: UserDto) {
        return this.authService.login(userDto.email, userDto.password);
    }

    @Post('register')
    async register(@Body() userDto: UserDto) {
        return this.authService.register(userDto);
    }
    
}
