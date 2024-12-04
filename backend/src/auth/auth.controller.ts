import { Controller, Post, Body, Logger, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/entities/DTO/users.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: '登录' })  
    async login(@Body() userDto: UserDto) {
        this.logger.log(`auth login with body: ${JSON.stringify(userDto)}`);
        return this.authService.login(userDto.email, userDto.password);
    }

    @Post('register')
    @ApiOperation({ summary: '注册' })
    async register(@Body() userDto: UserDto) {
        this.logger.log(`auth register with body: ${JSON.stringify(userDto)}`);
        return this.authService.register(userDto);
    }

    @Post('confirm')
    @ApiOperation({ summary: '确认注册' })
    async confirmSignUp(@Body() confirmDto: { email: string; code: string }) {
        this.logger.log(`auth confirmSignUp with body: ${JSON.stringify(confirmDto)}`);
        return this.authService.confirmSignUp(confirmDto.email, confirmDto.code);
    }

    @Get('current-user')
    @ApiOperation({ summary: '获取当前用户信息' })
    async getCurrentUser(@Headers('Authorization') token: string) {
        return this.authService.getCurrentUser(token);
    }
}
