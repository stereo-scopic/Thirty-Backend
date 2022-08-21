import { Controller, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('/:uuid')
  deleteUser(@Param('uuid') uuid: string): Promise<void> {
    return this.userService.deleteUser(uuid);
  }
}
