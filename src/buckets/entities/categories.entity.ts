import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
