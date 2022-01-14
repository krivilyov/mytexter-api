import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Language } from '../languages/language.model';
import { Topic } from '../topics/topic.model';
import { Level } from '../levels/level.model';
import { WordTranslations } from './word-translatios.model';

interface WordCreationAttributes {
  alias: string;
  title: string;
  transcription: string;
  description: string;
  prem_description: string;
  is_phrase: boolean;
  is_active: boolean;
  image: string;
  level_id: number;
  topic_id: number;
  language_id: number;
}

@Table({ tableName: 'words' })
export class Word extends Model<Word, WordCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  alias: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  transcription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  prem_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_phrase: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;

  @ForeignKey(() => Language)
  @Column
  language_id: number;
  @BelongsTo(() => Language)
  language: Language;

  @ForeignKey(() => Topic)
  @Column
  topic_id: number;
  @BelongsTo(() => Topic)
  topic: Topic;

  @ForeignKey(() => Level)
  @Column
  level_id: number;
  @BelongsTo(() => Level)
  level: Level;

  // @BelongsToMany(() => Word, () => WordTranslations, 'word_id')
  // words: Word[];

  @BelongsToMany(() => Word, () => WordTranslations, 'word_translate_id')
  t_words: Word[];
}
