import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/entities';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guards';

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
  async login(@Request() req): Promise<User> {
    return req.user;
  }
}
