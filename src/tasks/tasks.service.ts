import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Task } from './task.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task) private taskRepository: typeof Task) {}

  async createTask(dto: CreateTaskDto) {
    const errors = {
      task: '',
    };

    if (dto.words.length) {
      const task = await this.taskRepository.create({
        ...dto,
      });

      const words = dto.words;
      words.map((word) => {
        task.$set('words', word.id);
      });

      return task;
    } else {
      errors.task = 'Задача не может быть пустой';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }

  async removeTask(id: number) {
    const errors = {
      task: '',
    };

    const task = await this.taskRepository.findByPk(id);
    if (!task) {
      errors.task = 'Задача, которую вы хотите удалить - не существует';
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    await task
      .destroy()
      .then()
      .catch((error) => {
        return error;
      });
  }

  async getTasksByUser(userId: number) {
    const tasks = await this.taskRepository.findAll({
      include: { all: true, nested: true },
      where: {
        user_id: userId,
      },
    });

    return tasks;
  }
}
