import {
  Controller,
  UseGuards,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Roles } from 'src/authorisation/roles.decorator';
import { RolesGuard } from 'src/authorisation/guards/roles.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('/api')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Post('/task')
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Delete('/task/:id')
  remove(@Param('id') id: number) {
    return this.tasksService.removeTask(id);
  }

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Get('/tasks/:userId')
  getTasksByUser(
    @Param('userId') userId: number,
    @Query('order') order = 'ASC',
  ) {
    return this.tasksService.getTasksByUser(userId, order);
  }

  @Roles('admin', 'customer')
  @UseGuards(RolesGuard)
  @Get('/task/:id')
  getTaskById(@Param('id') id: number) {
    return this.tasksService.getTaskById(id);
  }
}
