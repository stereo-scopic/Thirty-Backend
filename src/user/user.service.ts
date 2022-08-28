import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async createUser(uuid: string): Promise<User> {
    const user = this.userRepository.create({ uuid: uuid });
    await this.transaction(user);
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { id, password, password_repeat, email } = registerUserDto;
    const hashedPassword = await this.getHashedValue(password);
    await this.userRepository.nativeUpdate(
      { id: id },
      { email: email, password: hashedPassword },
    );
    return this.getById(id);
  }

  async deleteUser(uuid: string): Promise<void> {
    const result = await this.userRepository.nativeDelete({ uuid: uuid });
    console.log(result);
  }

  async getById(id: string): Promise<User> {
    return this.userRepository.findOne({ id: id });
  }

  async getByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ uuid: uuid });
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this.getById(id);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (isRefreshTokenMatching) return user;
    throw new UnauthorizedException();
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await this.getHashedValue(refreshToken);
    await this.userRepository.nativeUpdate(
      { id: userId },
      { refreshToken: currentHashedRefreshToken },
    );
  }

  private async removeRefreshToken(userId: string) {
    this.userRepository.nativeUpdate({ id: userId }, { refreshToken: null });
  }

  private async getHashedValue(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUND);
    return bcrypt.hash(value, salt);
  }

  private async transaction(user: User) {
    this.userRepository.persist(user);
  }
}
