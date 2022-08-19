import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configServcie: ConfigService,
  ) {}

  async generateAccessToken(uuid: string): Promise<string> {
    const payload = { uuid };
    return this.jwtService.sign(payload, {
      secret: this.configServcie.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configServcie.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async generateRefreshToken(uuid: string): Promise<string> {
    const payload = { uuid };
    return this.jwtService.sign(payload, {
      secret: this.configServcie.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configServcie.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
}
