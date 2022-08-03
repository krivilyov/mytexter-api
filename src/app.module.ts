import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/user.model';
import { AuthorisationModule } from './authorisation/authorisation.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TopicsModule } from './topics/topics.module';
import * as path from 'path';
import { Topic } from './topics/topic.model';
import { LevelsModule } from './levels/levels.module';
import { Level } from './levels/level.model';
import { Subscription } from './subscription/subscription.model';
import { WordsModule } from './words/words.module';
import { LanguagesModule } from './languages/languages.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { SubscriptionModule } from './subscription/subscription.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Topic, Level, Subscription],
      autoLoadModels: !!process.env.AUTO_LOAD_MODELS,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('./upload'),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: true, // upgrade later with STARTTLS
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        },
      }),
    }),
    UsersModule,
    AuthorisationModule,
    FileModule,
    TopicsModule,
    LevelsModule,
    WordsModule,
    LanguagesModule,
    SubscriptionModule,
    TasksModule,
  ],
})
export class AppModule {}
