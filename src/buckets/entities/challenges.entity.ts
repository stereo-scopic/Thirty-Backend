import {
  BaseEntity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './categories.entity';

export class Challenge extends BaseEntity {
  @PrimaryGeneratedColumn()
  challengeId: number;

  @ManyToOne(() => Category, (category) => category.categoryId)
  category: Category;

  @Column()
  title: string;

  @Column()
  description: string;

  //   @ManyToOne(() => User)
  // author:

  @Column()
  isPublic: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  /*
  import { LocatDateTime } from "@js-joda/core";
  @CreateDateColumn({
    type: "timestamp",
    transformer: new LocalDateTransformer(),
  })
  createdAt: LocalDateTime;

  @UpdateDateColumn({
    type: "timestamp",
    transformer: new LocalDateTransformer(),
  })
  updatedAt: LocalDateTime;
  */
}
