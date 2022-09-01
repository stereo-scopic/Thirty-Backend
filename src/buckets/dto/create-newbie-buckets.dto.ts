import { ApiProperty } from '@nestjs/swagger';

export class CreateNewbieBucketDto {
  @ApiProperty({
    type: `string`,
    description: `user device uuid`,
  })
  uuid: string;

  @ApiProperty({
    example: 1,
    type: `number`,
    description: `챌린지 id`,
  })
  challenge: number;
}
