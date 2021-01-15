/* eslint-disable no-console */
/**
 * 数据库配置文件，敏感数据从sensitive.js导入
 */
import { databaseHost, databasePassword } from './sensitive';

export default {
  database: 'active_center_dev',
  username: 'root',
  password: databasePassword,
  host: databaseHost,
  port: '3306',
  dialect: 'mysql',
  logging: process.env.MODE === 'test' ? false : console.log,
};
