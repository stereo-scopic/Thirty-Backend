import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from './permitted-action.enum';
import { Bucket, User } from '../entities';
import { Role } from '../user/user-role.enum';
import { UserVisiblity } from '../user/user-visibility.enum';

type Subjects = InferSubjects<typeof Bucket | typeof User> | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all');
    }

    can(Action.Read, Bucket, { user: { visibility: UserVisiblity.PUBLIC } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
