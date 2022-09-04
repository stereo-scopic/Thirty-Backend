import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { User } from 'src/entities';
import { AuthorizedUserDto } from './dto/authorized-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiCookieAuth('Authentication')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete('/:uuid')
  deleteUser(@Param('uuid') uuid: string): Promise<void> {
    return this.userService.deleteUser(uuid);
  }

  @Get('/profile')
  @ApiOperation({ summary: `프로필 조회` })
  @ApiResponse({
    status: 200,
    type: AuthorizedUserDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<User> {
    return this.userService.getById(req.user.id);
  }

  @Patch('/profile')
  @ApiOperation({ summary: `유저 정보 수정` })
  @ApiBody({
    schema: {
      properties: {
        nickname: {
          type: `string`,
          example: `해리`,
          description: `수정할 닉네임`,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: AuthorizedUserDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(req.user, updateUserDto);
  }
}
