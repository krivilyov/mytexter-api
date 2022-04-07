import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Word } from '../words/word.model';
import { TaskWords } from './task-words.model';

interface TaskCreationAttributes {
  user_id: number;
  status: number;
}

@Table({ tableName: 'tasks' })
export class Task extends Model<Task, TaskCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user_id: number;
  @BelongsTo(() => User)
  user: User;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  status: number;

  @BelongsToMany(() => Word, () => TaskWords, 'task_id')
  words: Word[];
}
