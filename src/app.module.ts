import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { BucketsModule } from './buckets/buckets.module';
import { UserModule } from './user/user.module';
import { ChallengeModule } from './challenge/challenge.module';
import { MikroORM } from '@mikro-orm/core';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from './casl/casl.module';
import { RewardModule } from './reward/reward.module';
import { NoticeModule } from './notice/notice.module';
import { RelationModule } from './relation/relation.module';
import { NotificationModule } from './notification/notification.module';
import { CommunityModule } from './community/community.module';
import { ThemeModule } from './theme/theme.module';
import { PushModule } from './push/push.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailModule } from './email/email.module';
import path from 'path';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: `smtps://${config.get('EMAIL_AUTH_ADDRESS')}:${config.get('EMAIL_AUTH_PASSWORD')}@${config.get('EMAIL_HOST')}`,
          defaults: {
            from: `${config.get('EMAIL_FROM_USER')} <${config.get('EMAIL_FROM_USER')}>`
          },
          template: {
            dir: path.join(__dirname, '/templates/'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            }
          }
        }
      }
    }),
    AuthModule,
    BucketsModule,
    ChallengeModule,
    UserModule,
    CaslModule,
    RewardModule,
    NoticeModule,
    RelationModule,
    NotificationModule,
    CommunityModule,
    ThemeModule,
    PushModule,
    EmailModule,
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
