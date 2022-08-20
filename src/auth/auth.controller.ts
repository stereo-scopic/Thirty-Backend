import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LoaclAuthGuard)
  // @Post('/login')
  // async login(@Request() req) {
  //   return this.authService.generateAccessToken(req.user);
  // }
}
