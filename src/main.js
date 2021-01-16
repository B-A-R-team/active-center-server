import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jwt from './common/middlewares/jwt';
import router from './router';

async function bootstrap() {
  const app = new Koa();

  app.use(bodyParser());
  app.use(jwt());

  app.use(router.routes()).use(router.allowedMethods());

  return app;
}

export default bootstrap;
