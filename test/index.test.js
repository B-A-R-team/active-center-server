import { closeDbConnection } from '../src/common/db';

after(() => {
  // 断开数据库连接
  closeDbConnection();
});
