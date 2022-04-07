import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

import { Task } from './task.model';
import { Word } from '../words/word.model';

@Table({ tableName: 'task-words', createdAt: false, updatedAt: false })
export class TaskWords extends Model<TaskWords> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  task_id: number;

  @ForeignKey(() => Word)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  word_id: number;
}
