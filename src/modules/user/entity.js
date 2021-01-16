import { DataTypes, Model } from 'sequelize';
// import { TeamEntity } from '../team';
import initDB from '../../common/db';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.CHAR(15), allowNull: false },
    password: { type: DataTypes.CHAR(255), allowNull: false },
    stu_id: { type: DataTypes.CHAR(9), allowNull: false },
    gender: { type: DataTypes.TINYINT(2) },
    card_id: { type: DataTypes.CHAR(10) },
    phone: { type: DataTypes.CHAR(11) },
    class_name: { type: DataTypes.CHAR(15) },
    avatar_url: { type: DataTypes.CHAR(255) },
    comment: { type: DataTypes.CHAR(255) },
    is_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
    team_id: {
      type: DataTypes.INTEGER,
      // references: {
      //   model: TeamEntity,
      //   key: 'id',
      // },
    },
  },
  {
    sequelize: initDB(),
    modelName: 'User',
  }
);

User.sync();

export default User;
