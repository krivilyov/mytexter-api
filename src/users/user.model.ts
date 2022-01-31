import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  confirmHash: string;
  role: string;
  avatar: string;
  isActive: number;
  restoreHash?: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  confirmHash: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  isActive: number;

  @Column({
    type: DataType.ENUM('customer', 'teacher', 'admin'),
    defaultValue: 'customer',
  })
  role: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  restoreHash: string;
}
