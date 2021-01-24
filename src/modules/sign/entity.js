import {
  Sequelize,
  DataTypes,
  Model } from 'sequelize';
import initDB from '../../common/db';

class Sign extends Model {}

Sign.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  admin_id: {
    type: DataTypes.INTEGER,
  },
  sign_time: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  sequelize: initDB(),
  modelName: 'Sign',
  timestamps: false,
});

export default Sign;
