import { PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty({
    example: 1,
    description: `unique id`,
  })
  @PrimaryKey()
  id: number;

  @ApiProperty({
    example: `2022-08-25T00:56:47.000Z`,
    description: `등록 날짜`,
  })
  @Property({ defaultRaw: 'current_timestamp' })
  created_at: Date = new Date();

  @ApiProperty({
    example: `2022-08-25T00:56:47.000Z`,
    description: `수정 날짜`,
  })
  @Property({
    defaultRaw: 'current_timestamp',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();
}
