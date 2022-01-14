import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Word } from './word.model';

@Table({ tableName: 'word-translations', createdAt: false, updatedAt: false })
export class WordTranslations extends Model<WordTranslations> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Word)
  @Column({
    type: DataType.INTEGER,
  })
  word_id: number;

  @ForeignKey(() => Word)
  @Column({
    type: DataType.INTEGER,
  })
  word_translate_id: number;
}
