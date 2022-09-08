import { Answer, Bucket } from 'src/entities';

export interface IBucketsDetail {
  bucket: Bucket;
  answers: Answer[];
}
