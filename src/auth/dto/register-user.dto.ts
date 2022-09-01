import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: `adfa8b368bcd91d3d830`,
    description: `user unique id`,
    type: 'string',
  })
  id: string;

  @ApiProperty({
    example: `example@thirty.com`,
    description: `이메일`,
    type: 'string',
  })
  email: string;

  @ApiProperty({
    example: `password1`,
    description: `비밀번호`,
    type: 'string',
  })
  password: string;

  @ApiProperty({
    example: `password1`,
    description: `비밀번호 확인`,
    type: 'string',
  })
  password_repeat: string;
}
