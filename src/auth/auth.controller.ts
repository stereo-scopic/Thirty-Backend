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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthorizedUserDto } from 'src/user/dto/authorized-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: `회원가입` })
  @ApiResponse({
    status: 201,
    description: `회원가입 성공`,
    type: RegisterUserDto,
  })
  @Post('/signup')
  async signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signUp(registerUserDto);
  }

  @ApiOperation({ summary: `회원탈퇴` })
  @ApiResponse({
    status: 201,
    description: `회원탈퇴 성공, response body 없음`,
  })
  @Post('/signout')
  async signout(@Body('id') id: string): Promise<void> {
    return this.authService.signout(id);
  }

  @ApiOperation({ summary: `로그인` })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 201,
    description: `로그인 성공`,
    type: AuthorizedUserDto,
  })
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
