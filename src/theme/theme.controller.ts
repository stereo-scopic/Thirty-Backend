import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { BucketTheme } from 'src/entities';
import { ThemeService } from './theme.service';

@Controller('theme')
@ApiTags('Bucket Theme & Export')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get('')
  @ApiOperation({ summary: `내보내기 테마 리스트 조회` })
  @ApiOkResponse({
    type: BucketTheme,
    isArray: true,
  })
  async getThemeList(): Promise<BucketTheme[]> {
    return this.themeService.getThemeList();
  }

  @Post('/export')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: `완료 챌린지 내보내기` })
  @ApiBody({
    schema: {
      properties: {
        bucket: {
          type: `string`,
          example: `55b7ca179d58c05154437021d3297a`,
          description: `내보낼 버킷 id`,
        },
        theme: {
          type: `number`,
          example: 1,
          description: `내보낼 테마의 unique id`,
        },
      },
    },
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    schema: {
      properties: {
        statusCode: {
          type: `number`,
          example: 400,
        },
        message: {
          type: `string`,
          example: `완료되지 않은 챌린지는 내보낼 수 없습니다`,
        },
        error: {
          type: `string`,
          example: `Bad Request`,
        },
      },
    },
  })
  async exportBucketTheme(
    @Req() req,
    @Body('bucket') bucketId: string,
    @Body('theme') themeId: number,
  ) {
    return this.themeService.exportBucketTheme(req.user, bucketId, themeId);
  }
}
