import {
  Sequelize,
  DataTypes,
  Model } from 'sequelize';
import moment from 'moment';
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
    get() {
      return moment(this.getDataValue('sign_time')).format('YYYY-MM-DD HH:mm:ss');
    },
  },
}, {
  sequelize: initDB(),
  modelName: 'Sign',
  timestamps: false,
});

export default Sign;
