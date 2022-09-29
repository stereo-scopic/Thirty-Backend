import { Entity, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from 'src/notification/notification-type.enum';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Notification extends BaseEntity {
  @ApiProperty({
    example: `adfa8b368bcd91d3d830`,
    description: `user unique id`,
    type: 'string',
  })
  @Property()
  user_id: string;

  @ApiProperty({
    example: `abcdefgt1234`,
    description: `관련 user unique id`,
    type: 'string',
  })
  @Property({ nullable: true })
  related_user_id: string;

  @ApiProperty({
    type: `string`,
    enum: NotificationType,
    description: `알림 종류\n`,
  })
  @Property()
  type: NotificationType;

  @ApiProperty({
    type: `string`,
    description: ``,
  })
  @Property({ nullable: true })
  message: string;

  @Property({ nullable: true })
  related_source_name: string;

  @Property({ nullable: true })
  related_source_id: string | number;

  @ApiProperty({
    type: `boolean`,
    example: false,
    description: ``,
  })
  @Property({ default: false })
  is_read: boolean;
}
