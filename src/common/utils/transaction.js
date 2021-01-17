import initDB from '../db';

/**
 * 事务封装
 * @param {(t: Transaction) => Promise<void>} callback 回调，传入事务要执行的语句
 * @returns {Promise<Error | null>}
 */
export default async function transaction(callback) {
  const t = await initDB().transaction();
  try {
    await callback(t);
    await t.commit();
    return null;
  } catch (error) {
    await t.rollback();
    return error;
  }
}
