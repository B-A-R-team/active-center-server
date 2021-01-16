/**
 * jwt中间件封装
 * @description 在notCheckApi和specialApi中配置无需token的API
 */
import koaJwt from 'koa-jwt';
import { JWT_SECRET } from '../../config/sensitive';

const notCheckApi = [
  {
    path: /^\/api\/v1\/team*/,
    method: 'GET',
  },
  {
    path: /^\/api\/v1\/home/,
    method: 'GET',
  },
];

const specialApi = ['/', '/api/v1', '/api/v1/register', '/api/v1/login'];

function isInApiArr(path, method) {
  return notCheckApi.some((route) => {
    if (route.path instanceof RegExp) {
      return route.path.test(path) && route.method === method;
    }
    return route.path === path && route.method === method;
  });
}

/**
 * 检查API是否需要token验证
 * @param {import('koa').Context} ctx koa上下文
 */
function checkApi(ctx) {
  if (isInApiArr(ctx.path, ctx.method)) {
    return true;
  }
  if (specialApi.includes(ctx.path)) {
    return true;
  }
  return false;
}

export default function jwt() {
  return koaJwt({ secret: JWT_SECRET }).unless({
    custom: checkApi,
  });
}
