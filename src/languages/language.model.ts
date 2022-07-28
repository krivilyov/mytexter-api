import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface LanguageCreationAttributes {
  alias: string;
  title: string;
  isActive: number;
  img: string;
}

@Table({ tableName: 'languages' })
export class Language extends Model<Language, LanguageCreationAttributes> {
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
    unique: true,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  isActive: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  img: string;
}
