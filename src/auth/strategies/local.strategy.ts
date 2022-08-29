import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(
        `존재하지 않는 아이디 혹은 비밀번호가 맞지 않습니다.`,
      );
    }
    if (user.deleted_at !== null) {
      throw new UnauthorizedException(`탈퇴처리 된 회원입니다.`);
    }
    return user;
  }
}
