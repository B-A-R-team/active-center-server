import { Sequelize } from 'sequelize';
import database from '../config/database';

let sequelize = null;

/**
 * 单例 - 数据连接对象
 * @returns {Sequelize} sequlize对象
 */
export default function initDB() {
  if (!sequelize) {
    sequelize = new Sequelize(database);
    sequelize.sync();
  }

  return sequelize;
}

/**
 * 断开数据库连接
 */
export function closeDbConnection() {
  sequelize.close();
}
