import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities';
import { hash } from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { UserTokenDto } from './dto/user-token.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: EntityRepository<User>,
    private readonly authService: AuthService,
  ) {}

  async createUser(uuid: string): Promise<UserTokenDto> {
    const user = this.userRepository.create({ uuid: uuid });
    return this.generateUserToken(user);
  }

  async getByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ uuid: uuid });
  }

  private async generateUserToken(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const accessToken = await this.authService.generateAccessToken(user.uuid);
    const refreshToken = await this.authService.generateRefreshToken(user.uuid);
    await this.setCurrentRefreshToken(refreshToken, user.id);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await hash(refreshToken, 10);
    await this.userRepository.nativeUpdate(
      { id: userId },
      { refreshToken: currentHashedRefreshToken },
    );
  }

  private async removeRefreshToken(userId: string) {
    this.userRepository.nativeUpdate({ id: userId }, { refreshToken: null });
  }
}
