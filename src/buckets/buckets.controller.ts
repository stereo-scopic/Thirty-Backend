import { Controller, Get, HttpStatus, Param, Res, HttpCode, Query } from '@nestjs/common';
import { string } from 'yargs';
import { BucketsService } from './buckets.service';
import { Challenge } from './interfaces/bucket.interface';

@Controller('buckets')
export class BucketsController {
    constructor(private bucketService: BucketsService) {}
    
    @Get('/challenges')
    @HttpCode(200)
    async findChallengesAll(@Res() res: Response): Promise<Challenge[]> {
        // const challenges: object[] = await this.bucketService.getChallenges();
        // return res.status(HttpStatus.OK).json(challenges);
        return res.status(HttpStatus.OK).json([]);
    }

    @Get('/challenges/:category')
    @HttpCode(200)
    async findChallengesByCategory(@Query('category') category: string, @Res() res: Response): Promise<Challenge[]> {
        // const challenges: object[] = await this.bucketService.getCategoryChallenges(category);
        // return res.status(HttpStatus.OK).json(challenges);
        return res.status(HttpStatus.OK).json([]);
    }
}
