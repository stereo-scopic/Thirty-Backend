import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/entities';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { LocalAuthGuard } from './guards/local-auth.guards';
import cookie from 'cookie';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @Post('/signout')
  async signout(@Body('id') id: string): Promise<void> {
    return this.authService.signout(id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const { access_token, ...options } =
      this.authService.getCookieWithJwtAccessToken(req.user);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('Authentication', access_token, options),
    );
    return req.uesr;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async test(@Req() req): Promise<any> {
    return req.user;
  }
}
