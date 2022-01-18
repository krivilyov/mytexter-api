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
import { WordsModule } from './words/words.module';
import { LanguagesModule } from './languages/languages.module';

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
      models: [User, Topic, Level],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    UsersModule,
    AuthorisationModule,
    FileModule,
    TopicsModule,
    LevelsModule,
    WordsModule,
    LanguagesModule,
  ],
})
export class AppModule {}
