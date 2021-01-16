import { DataTypes, Model } from 'sequelize';
import initDB from '../../common/db';

class Team extends Model {}

Team.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.CHAR(20), allowNull: false },
    teacher: { type: DataTypes.CHAR(10), allowNull: false },
    caption_id: { type: DataTypes.INTEGER },
    tables: { type: DataTypes.CHAR(50), allowNull: false },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { sequelize: initDB(), modelName: 'Team' }
);

export default Team;
