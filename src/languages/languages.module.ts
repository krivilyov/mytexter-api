import { Module } from '@nestjs/common';
import { LanguagesController } from './languages.controller';
import { LanguagesService } from './languages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorisationModule } from '../authorisation/authorisation.module';
import { Language } from './language.model';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService],
  imports: [SequelizeModule.forFeature([Language]), AuthorisationModule],
  exports: [LanguagesService],
})
export class LanguagesModule {}
