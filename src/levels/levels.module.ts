import { Module } from '@nestjs/common';
import { LevelsController } from './levels.controller';
import { LevelsService } from './levels.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthorisationModule } from '../authorisation/authorisation.module';
import { Level } from './level.model';

@Module({
  controllers: [LevelsController],
  providers: [LevelsService],
  imports: [SequelizeModule.forFeature([Level]), AuthorisationModule],
})
export class LevelsModule {}
