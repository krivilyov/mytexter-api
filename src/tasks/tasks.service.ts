import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Task } from './task.model';
import { TaskWords } from './task-words.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateWordIntoTask } from './dto/update-word-into-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task) private taskRepository: typeof Task,
    @InjectModel(TaskWords) private taskWordsRepository: typeof TaskWords,
  ) {}

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

  async getTasksByUser(userId: number, order: string) {
    const tasks = await this.taskRepository.findAll({
      include: { all: true, nested: true },
      where: {
        user_id: userId,
      },
      order: [['id', order]],
    });

    return tasks;
  }

  async getTaskById(id: number) {
    const task = await this.taskRepository.findOne({
      include: { all: true, nested: true },
      where: {
        id: id,
      },
    });

    return task;
  }

  async updateWordIntoTask(dto: UpdateWordIntoTask) {
    const taskWord = await this.taskWordsRepository.findOne({
      where: {
        task_id: dto.task_id,
        word_id: dto.word_id,
      },
    });

    const updatedTaskWord = await taskWord.update({
      ...dto,
    });

    const task = await this.taskRepository.findOne({
      include: { all: true, nested: true },
      where: {
        id: updatedTaskWord.task_id,
      },
    });

    //check all words into task and set status
    const taskWords = await this.taskWordsRepository.findAll({
      where: {
        task_id: dto.task_id,
      },
    });

    const emptyDescription = taskWords.find(
      (taskWord) => !taskWord.description,
    );

    //if all words have descriptions -> close this task
    if (typeof emptyDescription === 'undefined') {
      await task.update({
        status: 1,
      });
    } else {
      await task.update({
        status: 0,
      });
    }

    return task;
  }
}
