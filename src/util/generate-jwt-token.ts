import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities';

export default class JwtGenerator {
  constructor(private jwtService: JwtService) {}

  async generateJwtAccessToken(user: User): Promise<string> {
    const uuid = user.uuid;
    const payload = { uuid };
    return this.jwtService.sign(payload);
  }
}
