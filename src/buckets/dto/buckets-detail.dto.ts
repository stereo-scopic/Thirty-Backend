import { ApiProperty } from '@nestjs/swagger';
import { Answer, Bucket } from 'src/entities';

export class BucketsDetail {
  @ApiProperty({
    type: Bucket,
  })
  bucket: Bucket;

  @ApiProperty({
    type: Answer,
    isArray: true,
  })
  answers: Answer[];
}
