import { Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorisationModule } from '../authorisation/authorisation.module';
import { Language } from './language.model';
import { FileService } from '../file/file.service';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService, FileService],
  imports: [SequelizeModule.forFeature([Language]), AuthorisationModule],
  exports: [LanguagesService],
})
export class LanguagesModule {}
