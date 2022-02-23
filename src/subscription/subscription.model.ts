import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { Injectable } from '@nestjs/common';

interface SubscriptionAttributes {
  email: string;
  sent: number;
}

@Injectable()
@Table({ tableName: 'subscription' })
export class Subscription extends Model<Subscription, SubscriptionAttributes> {
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
  email: string;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    defaultValue: 0,
  })
  sent: number;
}
