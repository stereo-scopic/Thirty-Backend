import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { crypt } from 'src/utils/crypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createUser(uuid: string): Promise<User> {
    const refreshToken = this.authService.getRefreshToken(uuid);
    try {
      const user = new User(uuid, refreshToken);
      await this.userRepository.persistAndFlush(user);
      return user;
    } catch (error) {
      // duplicate unique key
      if (error.code == 23505)
        throw new BadRequestException(`이미 가입한 기록이 있습니다.`);
      throw new BadRequestException(`가입할 수 없습니다`);
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { id, password, email } = registerUserDto;
    const hashedPassword = await crypt.getHashedValue(password);
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

  async getById(id: string): Promise<any> {
    return this.userRepository.findOne({ id: id });
  }

  async getByUuid(uuid: string): Promise<User> {
    return this.userRepository.findOne({ uuid: uuid });
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email });
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.nativeUpdate({ id: user.id }, updateUserDto);

    // TODO: DB에서 업데이트 된 결과를 받아올 수 있는 방법 찾아서 리팩토링
    if (updateUserDto.nickname) user.nickname = updateUserDto.nickname;
    if (updateUserDto.visibility) user.visibility = updateUserDto.visibility;

    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this.getById(id);
    if (crypt.isEqualToHashed(refreshToken, user.refreshToken)) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await crypt.getHashedValue(refreshToken);
    await this.userRepository.nativeUpdate(
      { id: userId },
      { refreshToken: currentHashedRefreshToken },
    );
  }

  async setSignoutUser(id: string): Promise<void> {
    await this.userRepository.nativeUpdate(
      { id: id },
      { deleted_at: new Date() },
    );
  }

  private async removeRefreshToken(userId: string) {
    this.userRepository.nativeUpdate({ id: userId }, { refreshToken: null });
  }

  private async transaction(user: User) {
    this.userRepository.persist(user);
  }
}
