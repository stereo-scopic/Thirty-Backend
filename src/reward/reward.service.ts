import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Prize, Reward, User } from 'src/entities';
import { PrizeUserOwnedDto } from './dto/prize-user-owned.dto';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: EntityRepository<Reward>,
    @InjectRepository(Prize)
    private readonly prizeRepository: EntityRepository<Prize>,
    private readonly em: EntityManager,
  ) {}

  async getUserRewardsList(user: User): Promise<PrizeUserOwnedDto[]> {
    const allPrizeList: Prize[] = await this.getAllPrizeList();
    const rewardsListUserHave: Reward[] = await this.getRewardListUserHave(
      user,
    );
    return this.getPrizeObjectWithUserOwned(allPrizeList, rewardsListUserHave);
  }

  /**
   * 출석 리워드
   * @param user
   * @returns
   */
  async getRewardAttendance(user: User): Promise<object | void> {
    const userId: string = user.id;
    const fulfilledDays: string[] = ['01', '07', '30'];
    for (const day of fulfilledDays) {
      const prizeCode = 'AT' + day;

      if (await this.isRewardExists(userId, prizeCode)) {
        continue;
      }
      if (user.continuous_attendance !== Number(day)) {
        continue;
      }
      await this.createReward(userId, prizeCode);
      return this.getRewardResult(userId, prizeCode);
    }
  }

  private async getAllPrizeList() {
    return this.prizeRepository.find(
      {},
      { orderBy: { prize_code: QueryOrder.ASC } },
    );
  }

  private async getRewardListUserHave(user: User) {
    return this.rewardRepository.find({ user_id: user.id });
  }

  private async createReward(userId: string, prizeCode: string): Promise<void> {
    const reward: Reward = this.rewardRepository.create({
      user_id: userId,
      prize_code: prizeCode,
    });
    await this.rewardRepository.persistAndFlush(reward);
  }

  private async isRewardExists(userId: string, prizeCode: string) {
    const reward: Reward = await this.rewardRepository.findOne({
      user_id: userId,
      prize_code: prizeCode,
    });
    if (!reward) {
      return false;
    }
    return true;
  }

  private async getRewardResult(userId: string, prizeCode: string) {
    const result = await this.em.execute(`
    SELECT R.ID
         , R.USER_ID
         , R.CREATED_AT
         , P.PRIZE_CODE
         , P.NAME
         , P.ILLUST
      FROM REWARD R
    INNER JOIN PRIZE P
       ON P.PRIZE_CODE = R.PRIZE_CODE
    WHERE 1=1
      AND R.USER_ID = '${userId}'
      AND P.PRIZE_CODE = '${prizeCode}'
  `);
    return result;
  }

  private async getPrizeObjectWithUserOwned(
    prizes: Prize[],
    rewards: Reward[],
  ): Promise<any> {
    const userRewardOwnedList: PrizeUserOwnedDto[] = [];
    let rewardIdx = 0;

    for (const _ of prizes) {
      const {
        created_at: prizeCreateDate,
        updated_at: prizeUpdateDate,
        ...prize
      } = _;
      const reward: Reward = rewards[rewardIdx];

      const rewardData = {
        created_at: null,
        isOwned: false,
      };
      const prizeWithUserOwnedData: PrizeUserOwnedDto = {};
      if (
        rewardIdx < rewards.length &&
        prize.prize_code === reward.prize_code
      ) {
        rewardData.created_at = reward.created_at;
        rewardData.isOwned = true;
        rewardIdx++;
      }
      Object.assign(prizeWithUserOwnedData, prize, rewardData);
      userRewardOwnedList.push(prizeWithUserOwnedData);
    }

    return userRewardOwnedList;
  }
}
