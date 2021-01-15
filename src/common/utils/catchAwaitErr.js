/**
 * 捕获async/await的错误
 * @param {Promise} promiseFunc Promise函数
 * @example 使用说明
 *  async function throwErr() {
 *     throw new Error('123');
 *   }
 *
 *   async function test() {
 *     const [err, res] = await catchAwaitErr(throwErr());
 *
 *     if (err) {
 *       console.log(err);
 *       return;
 *     }
 *     console.log(res);
 *   }
 */
export default async function catchAwaitErr(promiseFunc) {
  return promiseFunc
    .then((data) => [null, data])
    .catch((error) => [error, null]);
}
