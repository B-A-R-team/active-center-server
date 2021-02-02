/* eslint-disable no-console */
/**
 * 数据库配置文件，敏感数据从sensitive.js导入
 */
import { databaseHost, databasePassword, localPassword } from './sensitive';

export default {
  database: process.env.MODE === 'prod' ? 'active_center' : 'active_center_dev',
  username: 'root',
  // localPassword 为本地数据库密码
  password:
    process.env.MODE === 'local' || process.env.MODE === 'test'
      ? localPassword
      : databasePassword,
  host:
    process.env.MODE === 'local' || process.env.MODE === 'test'
      ? '127.0.0.1'
      : databaseHost,
  port: '3306',
  dialect: 'mysql',
  logging: process.env.MODE === 'test' ? false : console.log,
  timezone: '+08:00',
};
