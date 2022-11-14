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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { User } from 'src/entities';
import { CreateReportDto } from 'src/report/dto/create-report.dto';
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

  @Post('/report')
  @UseGuards(JwtAuthGuard)
  report(@Req() req, @Body() createReportDto :CreateReportDto) {
    return this.userService.report(req.user, createReportDto);
  }

  @Post('/block')
  @UseGuards(JwtAuthGuard)
  block(@Req() req, @Body('targetUserId') targetUserId: string) {
    return this.userService.block(req.user, targetUserId);
  }
}
