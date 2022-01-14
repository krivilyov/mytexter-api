import { Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Word } from './word.model';
import { WordTranslations } from './word-translatios.model';
import { AuthorisationModule } from '../authorisation/authorisation.module';
import { FileService } from '../file/file.service';

@Module({
  controllers: [WordsController],
  providers: [WordsService, FileService],
  imports: [
    SequelizeModule.forFeature([Word, WordTranslations]),
    AuthorisationModule,
  ],
})
export class WordsModule {}
