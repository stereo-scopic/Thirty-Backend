import {
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { User } from 'src/entities';
import { CreateBlockDto } from 'src/block/dto/create-block.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiCookieAuth('Authentication')
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @ApiOperation({ summary: `프로필 조회` })
  @ApiResponse({
    status: 200,
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<any> {
    return this.userService.getUserProfileById(req.user);
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
  @ApiOkResponse({
    schema: {
      properties: {
        user: {
          type: getSchemaPath(User),
        },
        message: {
          type: `string`,
          example: `사용자 정보 수정에 성공했습니다.`,
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(req.user, updateUserDto);
  }

  @ApiOperation({ summary: `사용자 검색` })
  @ApiParam({
    name: `user_id`,
    type: `string`,
    example: `adfa8b368bcd91d3d830`,
    description: `user id`,
    required: true,
  })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({})
  @Get('/:user_id')
  async findUser(@Param('user_id') userId: string) {
    return this.userService.getById(userId);
  }

  @Delete('/:uuid')
  deleteUser(@Param('uuid') uuid: string): Promise<void> {
    return this.userService.deleteUser(uuid);
  }

  @Post('/password')
  editPassword(@Body() editPasswordDto) {
    return this.userService.editPassword(editPasswordDto);
  }

  @ApiOperation({ summary: `사용자 신고` })
  @ApiBody({
    schema: {
      properties: {
        targetUserId: {
          type: `string`,
          description: `신고하려는 사용자의 id`,
        },
        detail: {
          type: `string`,
          description: `신고 내용`,
          nullable: true,
        }
      }
    }
  })
  @ApiCreatedResponse({
    schema: {
      properties: {
        message: {
          type: `string`,
          example: `성공적으로 신고하였습니다`,
        }
      }
    }
  })
  @Post('/report')
  @UseGuards(JwtAuthGuard)
  report(@Req() req, @Body() createBlockDto: CreateBlockDto): Promise<{ message: string }> {
    return this.userService.report(req.user, createBlockDto);
  }

  @ApiOperation({ summary: `사용자 차단` })
  @ApiBody({
    schema: {
      properties: {
        targetUserId: {
          type: `string`,
          description: `차단하려는 사용자의 id`
        }
      }
    }
  })
  @ApiCreatedResponse({
    schema: {
      properties: {
        message: {
          example: `성공적으로 차단하였습니다.`,
        }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      properties: {
        message: {
          example: `이미 차단한 유저입니다.`,
        }
      }
    }
  })
  @Post('/block')
  @UseGuards(JwtAuthGuard)
  block(@Req() req, @Body('targetUserId') targetUserId: string) {
    return this.userService.block(req.user, targetUserId);
  }

  @ApiOperation({ summary: `사용자 차단 해제` })
  @ApiBody({
    schema: {
      properties: {
        targetUserId: {
          type: `string`,
          description: `차단 해제하려는 사용자의 id`
        }
      }
    }
  })
  @Post('/unblock')
  @UseGuards(JwtAuthGuard)
  unblock(@Req() req, @Body('targetUserId') targetUserId: string) {
    return this.userService.unblock(req.user, targetUserId);
  }
}
