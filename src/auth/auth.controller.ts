import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegsiterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register') // http://localhost/auth/register 
    register(@Body() user: RegsiterAuthDto){
        return this.authService.register(user);
    }

    @Post('login') // http://localhost/auth/login 
    login(@Body() logindata: LoginAuthDto){
        return this.authService.login(logindata);
    }

}
