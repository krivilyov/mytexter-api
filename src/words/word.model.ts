import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface WordCreationAttributes {
  alias: string;
  title: string;
  transcription: string;
  description: string;
  prem_description: string;
  is_phrase: boolean;
  audio: string;
  image: string;
  word_words_id: number;
  level_id: number;
  topic_id: number;
  language_id: number;
}

@Table({ tableName: 'words' })
export class Word extends Model<Word, WordCreationAttributes> {}
