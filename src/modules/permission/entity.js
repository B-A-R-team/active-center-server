import { DataTypes, Model } from 'sequelize';
import initDB from '../../common/db';

class Permission extends Model {}

Permission.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.CHAR(20), allowNull: false },
    desc: { type: DataTypes.CHAR(255), allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.CHAR(20), allowNull: false },
  },
  { sequelize: initDB(), modelName: 'Permission' }
);

export default Permission;
