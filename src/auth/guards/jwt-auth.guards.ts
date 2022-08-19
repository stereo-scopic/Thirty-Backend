import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //   handleRequest(err: any, user: User): User {
  //     if (err || !user) throw err || new UnauthorizedException();
  //     return user;
  //   }
}
