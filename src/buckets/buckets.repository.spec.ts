import { BucketsRepository } from './buckets.repository';

describe('BucketsRepository', () => {
  it('should be defined', () => {
    expect(new BucketsRepository()).toBeDefined();
  });
});
