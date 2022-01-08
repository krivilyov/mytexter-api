import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from './topic.model';
import { AuthorisationModule } from '../authorisation/authorisation.module';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService],
  imports: [SequelizeModule.forFeature([Topic]), AuthorisationModule],
})
export class TopicsModule {}
