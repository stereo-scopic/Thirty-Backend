import { User } from 'src/entities';

export class CreateBucketDto {
  user: User;
  challenge: number;
}
