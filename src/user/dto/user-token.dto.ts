import { ApiProperty } from '@nestjs/swagger';

export class UserTokenDto {
  @ApiProperty({
    type: `string`,
    description: `JWT Access Token`,
  })
  access_token: string;

  @ApiProperty({
    type: `string`,
    description: `JWT Refresh Token`,
  })
  refresh_token: string;
}
