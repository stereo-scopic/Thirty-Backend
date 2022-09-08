import { Bucket } from 'src/entities';

export class CreateAnswerDto {
  bucket?: Bucket;
  date: number;
  image?: string;
  music?: string;
  detail?: string;
  stamp: number;
}
