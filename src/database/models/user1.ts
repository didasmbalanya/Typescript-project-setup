import { Table, Column, DataType } from 'sequelize-typescript';
import { Base } from '../base';
import { IUser } from '../../globals/models/user.interface';

@Table
export default class User extends Base<User> implements IUser {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  firstname: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  lastname: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING,
  })
  email: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING,
  })
  slackId: string;
}
