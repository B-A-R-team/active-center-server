import { DataTypes, Model } from 'sequelize';
import initDB from '../../common/db';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // 更多字段
  },
  {
    sequelize: initDB(),
    modelName: 'User',
  }
);

User.sync();

export default User;
