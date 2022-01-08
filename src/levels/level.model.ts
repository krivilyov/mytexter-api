import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface LevelCreationAttributes {
  alias: string;
  title: string;
}

@Table({ tableName: 'levels' })
export class Level extends Model<Level, LevelCreationAttributes> {
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
}
