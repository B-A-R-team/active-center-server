import Router from '@koa/router';

/**
 * 路由分组
 * @param {String} prefix 路由前缀
 * @param {(router: Router) => void} callback 回调函数，注册该组的路由
 */
export default function routerGroup(prefix = '', callback) {
  const router = new Router({
    prefix,
  });
  callback(router);

  return router;
}
