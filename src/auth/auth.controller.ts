import { Controller } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authSerice: AuthService,
    private readonly userService: UserService,
  ) {}
}
