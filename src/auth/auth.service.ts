import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateAccessToken(user: User) {
    const uuid = user.uuid;
    const payload = { uuid };
    return { access_token: this.jwtService.sign(payload) };
  }

  getCookieWithJwtAccessToken(uuid: string) {
    const payload = { uuid };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN')}s`,
    });
    return {
      access_token: token,
      domain: this.configService.get('HOST_NAME'),
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN')) * 1000,
    };
  }

  getCookieWithJwtRefreshToken(uuid: string) {
    const payload = { uuid };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')}s`,
    });
    return {
      refresh_token: token,
      domain: this.configService.get('HOST_NAME'),
      path: '/',
      httpOnly: true,
      maxAge:
        Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN')) * 1000,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOptions: {
        domain: this.configService.get('HOST_NAME'),
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOptions: {
        domain: this.configService.get('HOST_NAME'),
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }
}
