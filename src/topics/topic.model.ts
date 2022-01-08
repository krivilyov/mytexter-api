import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface TopicCreationAttributes {
  alias: string;
  title: string;
}

@Table({ tableName: 'topics' })
export class Topic extends Model<Topic, TopicCreationAttributes> {
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
