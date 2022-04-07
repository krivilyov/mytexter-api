import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';
import { AuthorisationModule } from '../authorisation/authorisation.module';
import { TaskWords } from './task-words.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [SequelizeModule.forFeature([Task, TaskWords]), AuthorisationModule],
})
export class TasksModule {}
